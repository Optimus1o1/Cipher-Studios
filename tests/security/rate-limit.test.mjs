import assert from 'node:assert/strict';
import crypto from 'node:crypto';

// Set mock environment variables for test execution
process.env.IP_HASH_SECRET = 'b59f14b547453c460e2b1dfe8d542bdb80664d919e4e3a196549d9b437a74c28';

console.log('--- Running Rate Limiter & Render Network Tests ---');

// 1. Test IP Anonymization HMAC
function hashClientIp(rawIp, secret = process.env.IP_HASH_SECRET) {
  return crypto.createHmac('sha256', secret).update(rawIp).digest('hex');
}

const ip1 = '192.168.1.50';
const ip2 = '192.168.1.51';

const hash1 = hashClientIp(ip1);
const hash2 = hashClientIp(ip2);

assert.equal(hash1.length, 64, 'Hash must be a 64-character SHA-256 hex string');
assert.notEqual(hash1, hash2, 'Different IP addresses must generate distinct hashes');
assert.notEqual(hash1, ip1, 'Raw IP address must never be preserved in the hash');
assert.equal(hash1, hashClientIp(ip1), 'Same IP must generate deterministic hash with same secret');

const diffSecretHash = hashClientIp(ip1, 'alternate_secret_key_1234567890');
assert.notEqual(hash1, diffSecretHash, 'Different secret keys must generate completely different hashes');

console.log('✓ IP Anonymization (HMAC-SHA256) tests passed.');

// 2. Test Render X-Forwarded-For & Spoofing Resistance
function isValidIp(ip) {
  if (!ip || typeof ip !== 'string') return false;
  const trimmed = ip.trim();
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Regex.test(trimmed)) return true;
  const ipv6Regex = /^[0-9a-fA-F:]{2,39}$/;
  if (ipv6Regex.test(trimmed) && trimmed.includes(':')) return true;
  return false;
}

function extractClientIp(headers, isProd = false) {
  const cfRay = headers.get('cf-ray');
  const cfConnectingIp = headers.get('cf-connecting-ip');
  // 1. CF-Connecting-IP is trusted ONLY in the verified Cloudflare traffic path (when CF-Ray is present)
  if (cfRay && cfConnectingIp && isValidIp(cfConnectingIp.trim())) {
    return cfConnectingIp.trim();
  }

  // 2. Render X-Forwarded-For: Render appends the verified connecting IP to the end of the list
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean);
    for (let i = parts.length - 1; i >= 0; i--) {
      const candidate = parts[i];
      if (isValidIp(candidate)) {
        return candidate;
      }
    }
  }

  // 3. Fail-closed anti-bypass
  if (!isProd) {
    return '127.0.0.1';
  }
  return 'unidentified-client';
}

function extractRayId(headers) {
  return headers.get('cf-ray') || null;
}

// Test A: Direct single IP
const directHeaders = new Map([['x-forwarded-for', '198.51.100.1']]);
assert.equal(extractClientIp(directHeaders), '198.51.100.1', 'Direct IP must be extracted');

// Test B: Client-Supplied Header Spoofing Attempt
// Attacker sends: X-Forwarded-For: 1.1.1.1 (spoofed)
// Render appends: 203.0.113.50 (real client IP)
// Resulting header: "1.1.1.1, 203.0.113.50"
const spoofedHeaders = new Map([['x-forwarded-for', '1.1.1.1, 203.0.113.50']]);
assert.equal(
  extractClientIp(spoofedHeaders),
  '203.0.113.50',
  'Render rightmost IP must defeat spoofed client-supplied headers'
);

// Test C: Garbage/Malicious injection in forwarded header
const garbageHeaders = new Map([['x-forwarded-for', 'malicious<script>, 10.0.0.1, 198.51.100.22']]);
assert.equal(
  extractClientIp(garbageHeaders),
  '198.51.100.22',
  'Garbage headers must be ignored and valid rightmost IP selected'
);

// Test D: Verified Cloudflare Path (CF-Connecting-IP + CF-Ray)
const verifiedCfHeaders = new Map([
  ['cf-connecting-ip', '198.51.100.77'],
  ['cf-ray', '8e27c1a84f932e12-SIN'],
  ['x-forwarded-for', '1.1.1.1, 10.0.0.1'],
]);
assert.equal(
  extractClientIp(verifiedCfHeaders),
  '198.51.100.77',
  'CF-Connecting-IP must be trusted when accompanied by valid CF-Ray'
);

// Test E: Forged CF-Connecting-IP Without CF-Ray
// Attacker crafts CF-Connecting-IP: 8.8.8.8 directly, bypassing Cloudflare
// Render reverse proxy appends real IP 198.51.100.88 to X-Forwarded-For
const forgedCfHeaders = new Map([
  ['cf-connecting-ip', '8.8.8.8'], // Forged
  ['x-forwarded-for', '198.51.100.88'], // Real Render appended IP
]);
assert.equal(
  extractClientIp(forgedCfHeaders),
  '198.51.100.88',
  'Forged CF-Connecting-IP without CF-Ray must be rejected in favor of Render X-Forwarded-For'
);

// Test F: Missing or Malformed Headers Anti-Bypass
const emptyHeaders = new Map();
assert.equal(
  extractClientIp(emptyHeaders, true),
  'unidentified-client',
  'Missing headers in production must fail-closed to unidentified-client'
);
assert.equal(
  extractClientIp(emptyHeaders, false),
  '127.0.0.1',
  'Missing headers in dev fallback to 127.0.0.1'
);

// Test G: CF-Ray extraction
const rayHeaders = new Map([['cf-ray', '8e27c1a84f932e12-SIN']]);
assert.equal(extractRayId(rayHeaders), '8e27c1a84f932e12-SIN', 'CF-Ray ID must be extracted for request tracing');

console.log('✓ Render reverse proxy & spoofing resistance tests passed.');

// 3. Test Sliding-Window Rate Limiter logic
class MemorySlidingWindow {
  constructor(limit = 5, windowMs = 600000) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.map = new Map();
  }

  check(id) {
    const now = Date.now();
    const entry = this.map.get(id);
    if (entry && entry.resetAt <= now) {
      this.map.delete(id);
    }
    const current = this.map.get(id) || { count: 0, resetAt: now + this.windowMs };
    if (current.count >= this.limit) {
      return { success: false, limit: this.limit, remaining: 0, reset: current.resetAt };
    }
    current.count += 1;
    this.map.set(id, current);
    return { success: true, limit: this.limit, remaining: this.limit - current.count, reset: current.resetAt };
  }
}

const limiter = new MemorySlidingWindow(5, 600000);
const testId = 'test-client-hash-abc';

for (let i = 1; i <= 5; i++) {
  const res = limiter.check(testId);
  assert.equal(res.success, true, `Request ${i} should be allowed`);
  assert.equal(res.remaining, 5 - i, `Remaining quota should be ${5 - i}`);
}

const blocked = limiter.check(testId);
assert.equal(blocked.success, false, '6th request within window must be rejected');
assert.equal(blocked.remaining, 0, 'Remaining count on rejected request must be 0');

console.log('✓ Sliding-window rate limiter enforcement tests passed.');
