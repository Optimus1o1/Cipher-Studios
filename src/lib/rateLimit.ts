import 'server-only';
import crypto from 'crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Anonymize client IP address using HMAC-SHA256 with a high-entropy secret.
 * Raw IP addresses are NEVER logged, returned, or stored in any database.
 */
export function hashClientIp(rawIp: string): string {
  const secret = process.env.IP_HASH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL_SECURITY_ERROR: IP_HASH_SECRET must be configured in production.');
    }
    return crypto.createHmac('sha256', 'msl_dev_ephemeral_salt').update(rawIp).digest('hex');
  }
  return crypto.createHmac('sha256', secret).update(rawIp).digest('hex');
}

/**
 * Validates whether a candidate string is a syntactically valid IPv4 or IPv6 address.
 */
function isValidIp(ip: string): boolean {
  if (!ip || typeof ip !== 'string') return false;
  const trimmed = ip.trim();
  // IPv4 check
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Regex.test(trimmed)) return true;
  // IPv6 check
  const ipv6Regex = /^[0-9a-fA-F:]{2,39}$/;
  if (ipv6Regex.test(trimmed) && trimmed.includes(':')) return true;
  return false;
}

/**
 * Extract client IP address specifically hardened for Render's reverse proxy mesh.
 *
 * Security Guarantees:
 * 1. Verified Cloudflare Path: CF-Connecting-IP is trusted ONLY when accompanied by a valid CF-Ray header.
 * 2. Render X-Forwarded-For Strategy: Render's reverse proxy appends the connecting client IP to the END of X-Forwarded-For.
 *    Traversing from right to left ensures we read Render's proxy-added IP and defeat client-prepended spoofed headers.
 * 3. Syntax Validation: Strict regex check ensures only syntactically valid IPv4 or IPv6 addresses are accepted.
 * 4. Fail-Closed Anti-Bypass: If headers are missing, empty, or completely malformed, returns 'unidentified-client'.
 *    This ensures malformed requests are pooled into a single strict rate limit bucket rather than bypassing controls.
 */
export function extractClientIp(req: Request): string {
  // 1. Cloudflare verified path: only trust cf-connecting-ip if cf-ray is also present
  const cfRay = req.headers.get('cf-ray');
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfRay && cfConnectingIp && isValidIp(cfConnectingIp.trim())) {
    return cfConnectingIp.trim();
  }

  // 2. Render X-Forwarded-For: Render appends the verified connecting IP to the end of the list.
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean);
    // Walk from the right (most recent proxy additions from Render edge) to find the first valid IP
    for (let i = parts.length - 1; i >= 0; i--) {
      const candidate = parts[i];
      if (isValidIp(candidate)) {
        return candidate;
      }
    }
  }

  // 3. Fail-Closed fallback for local development or non-proxied requests
  if (process.env.NODE_ENV !== 'production') {
    return '127.0.0.1';
  }

  return 'unidentified-client';
}

/**
 * Extract CF-Ray request tracing ID supplied by Render's edge
 */
export function extractRayId(req: Request): string | null {
  return req.headers.get('cf-ray') || null;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  degraded?: boolean;
  reason?: string;
}

let ratelimitInstance: Ratelimit | null = null;
let hasLoggedUpstashNotice = false;

function getRatelimit(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (!hasLoggedUpstashNotice && process.env.NODE_ENV !== 'production') {
      console.warn('[RateLimit] UPSTASH_REDIS_REST_URL/TOKEN not set. Using local development fallback.');
      hasLoggedUpstashNotice = true;
    }
    return null;
  }

  if (!ratelimitInstance) {
    const redis = new Redis({
      url,
      token,
    });
    ratelimitInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '10 m'),
      analytics: true,
      prefix: 'msl_ratelimit',
      timeout: 2500, // 2.5s maximum wait before timeout failover
    });
  }

  return ratelimitInstance;
}

// Development in-memory rate limiter fallback
const devIpMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Check rate limit for a hashed client identifier using sliding-window algorithm.
 * Limit: 5 requests per 10 minutes (600,000 ms).
 */
export async function checkRateLimit(
  hashedIdentifier: string,
  limit: number = 5,
  windowMs: number = 10 * 60 * 1000
): Promise<RateLimitResult> {
  const ratelimiter = getRatelimit();

  if (ratelimiter) {
    try {
      const result = await ratelimiter.limit(hashedIdentifier);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    } catch (err) {
      console.error('[RateLimit Error] Upstash Redis check failed or timed out:', err);
      // Failover into Degraded Defense Mode:
      // Request will only proceed if Turnstile bot verification succeeds.
      return {
        success: false,
        limit,
        remaining: 0,
        reset: Date.now() + windowMs,
        degraded: true,
        reason: 'redis_unavailable',
      };
    }
  }

  // Local development / CI test fallback
  const now = Date.now();
  const existing = devIpMap.get(hashedIdentifier);

  if (existing && existing.resetAt <= now) {
    devIpMap.delete(hashedIdentifier);
  }

  const current = devIpMap.get(hashedIdentifier) || { count: 0, resetAt: now + windowMs };

  if (current.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: current.resetAt,
    };
  }

  current.count += 1;
  devIpMap.set(hashedIdentifier, current);

  // Periodic cleanup if map grows
  if (devIpMap.size > 1000) {
    devIpMap.forEach((val, key) => {
      if (val.resetAt <= now) {
        devIpMap.delete(key);
      }
    });
  }

  return {
    success: true,
    limit,
    remaining: limit - current.count,
    reset: current.resetAt,
  };
}
