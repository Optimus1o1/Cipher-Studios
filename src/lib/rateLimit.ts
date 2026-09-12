/**
 * In-Memory Sliding Window Rate Limiter for API Route Handlers.
 * Edge and Serverless compatible with automatic stale IP garbage collection.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const ipBuckets = new Map<string, RateLimitRecord>();

// Garbage collect stale records every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    ipBuckets.forEach((record, ip) => {
      record.timestamps = record.timestamps.filter((t) => now - t < 15 * 60 * 1000);
      if (record.timestamps.length === 0) {
        ipBuckets.delete(ip);
      }
    });
  }, 10 * 60 * 1000);
}

export function checkRateLimit(
  ip: string,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const cleanIp = ip || "anonymous-client";

  let record = ipBuckets.get(cleanIp);
  if (!record) {
    record = { timestamps: [] };
    ipBuckets.set(cleanIp, record);
  }

  // Remove timestamps outside window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0];
    const resetMs = Math.max(0, windowMs - (now - oldest));
    return { allowed: false, remaining: 0, resetMs };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
    resetMs: windowMs,
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
