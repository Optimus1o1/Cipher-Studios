interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipMap = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 10 * 60 * 1000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = ipMap.get(ip);

  // Clean expired
  if (existing && existing.resetAt <= now) {
    ipMap.delete(ip);
  }

  const current = ipMap.get(ip) || { count: 0, resetAt: now + windowMs };

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;
  ipMap.set(ip, current);

  // Periodic cleanup if map grows
  if (ipMap.size > 1000) {
    ipMap.forEach((val, key) => {
      if (val.resetAt <= now) {
        ipMap.delete(key);
      }
    });
  }

  return {
    allowed: true,
    remaining: limit - current.count,
    resetAt: current.resetAt,
  };
}
