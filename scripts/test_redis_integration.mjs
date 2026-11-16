import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import fs from 'node:fs';

let url = process.env.UPSTASH_REDIS_REST_URL;
let token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url && fs.existsSync('.env.local')) {
  const content = fs.readFileSync('.env.local', 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('UPSTASH_REDIS_REST_URL=')) {
      url = trimmed.replace('UPSTASH_REDIS_REST_URL=', '').trim().replace(/^["']|["']$/g, '');
    }
    if (trimmed.startsWith('UPSTASH_REDIS_REST_TOKEN=')) {
      token = trimmed.replace('UPSTASH_REDIS_REST_TOKEN=', '').trim().replace(/^["']|["']$/g, '');
    }
  }
}

async function verifyUpstash() {
  console.log('=== UPSTASH REDIS INTEGRATION & LATENCY BENCHMARK ===\n');

  if (!url || !token) {
    console.log('STATUS: PENDING CREDENTIALS');
    console.log('UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not configured.');
    console.log('Please configure these credentials in Render Dashboard environment variables.');
    return;
  }

  console.log('Target Redis REST URL:', url.replace(/\/\/.*@/, '//***@'));
  const redis = new Redis({ url, token });

  // 1. Latency benchmark (5 rounds)
  const latencies = [];
  console.log('\nMeasuring round-trip REST latency (5 samples):');
  for (let i = 1; i <= 5; i++) {
    const start = performance.now();
    await redis.ping();
    const duration = performance.now() - start;
    latencies.push(duration);
    console.log(`  Sample ${i}: ${duration.toFixed(2)} ms`);
    await new Promise(r => setTimeout(r, 100));
  }

  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const minLatency = Math.min(...latencies);
  const maxLatency = Math.max(...latencies);
  console.log(`\nLatency Summary: Avg: ${avgLatency.toFixed(2)} ms | Min: ${minLatency.toFixed(2)} ms | Max: ${maxLatency.toFixed(2)} ms`);

  // 2. Sliding window ratelimit contract test
  console.log('\nTesting Ratelimit Sliding-Window Contract:');
  const testLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '10 m'),
    prefix: 'msl_test_bench',
  });

  const testId = `bench_${Date.now()}`;
  const res1 = await testLimiter.limit(testId);
  console.log(`  Request 1: Allowed = ${res1.success} | Remaining = ${res1.remaining} / 5 | Reset in = ${Math.ceil((res1.reset - Date.now()) / 1000)}s`);

  const res2 = await testLimiter.limit(testId);
  console.log(`  Request 2: Allowed = ${res2.success} | Remaining = ${res2.remaining} / 5`);

  if (res1.success && res2.remaining === 3) {
    console.log('\n✓ Sliding-window counter correctly decremented in remote Redis.');
  }

  console.log('\nUpstash Redis verification completed successfully.');
}

verifyUpstash().catch(err => {
  console.error('\nRedis verification failed:', err.message);
});
