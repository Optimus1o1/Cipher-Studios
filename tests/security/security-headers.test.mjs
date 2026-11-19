import assert from 'node:assert/strict';
import nextConfig from '../../next.config.mjs';

console.log('--- Running Security Headers & CSP Configuration Tests ---');

async function testHeaders() {
  const headersConfig = await nextConfig.headers();
  assert.ok(Array.isArray(headersConfig), 'headers() must return an array');

  const globalRule = headersConfig.find((r) => r.source === '/(.*)');
  assert.ok(globalRule, 'Global header rule for /(.*) must be defined');

  const headerMap = new Map();
  for (const h of globalRule.headers) {
    headerMap.set(h.key.toLowerCase(), h.value);
  }

  // 1. Content Security Policy (Enforcing & Report-Only)
  const enforcingCsp = headerMap.get('content-security-policy');
  assert.ok(enforcingCsp, 'Enforcing Content-Security-Policy header must be present');
  assert.ok(enforcingCsp.includes("default-src 'self'"), "Enforcing CSP must include default-src 'self'");

  const csp = headerMap.get('content-security-policy-report-only');
  assert.ok(csp, 'Content-Security-Policy-Report-Only header must be present');
  assert.ok(csp.includes("default-src 'self'"), "CSP must include default-src 'self'");
  assert.ok(
    csp.includes('https://challenges.cloudflare.com'),
    'CSP must allow Cloudflare Turnstile challenges'
  );
  assert.ok(csp.includes("frame-ancestors 'none'"), "CSP must disallow iframe embedding (frame-ancestors 'none')");
  assert.ok(!csp.includes('supabase.co'), 'CSP connect-src must NEVER expose server-only Supabase endpoint to browser');

  // 2. Clickjacking protection
  assert.equal(headerMap.get('x-frame-options'), 'DENY', 'X-Frame-Options must be DENY');

  // 3. MIME sniffing
  assert.equal(headerMap.get('x-content-type-options'), 'nosniff', 'X-Content-Type-Options must be nosniff');

  // 4. Referrer Policy
  assert.equal(
    headerMap.get('referrer-policy'),
    'strict-origin-when-cross-origin',
    'Referrer-Policy must be strict-origin-when-cross-origin'
  );

  // 5. Permissions Policy
  const permissions = headerMap.get('permissions-policy');
  assert.ok(permissions, 'Permissions-Policy header must be present');
  assert.ok(permissions.includes('camera=()'), 'Camera permission must be restricted');
  assert.ok(permissions.includes('microphone=()'), 'Microphone permission must be restricted');
  assert.ok(permissions.includes('geolocation=()'), 'Geolocation permission must be restricted');

  console.log('✓ All security headers and CSP Report-Only rules verified successfully.');
}

testHeaders().catch((err) => {
  console.error('Security headers test failed:', err);
  process.exit(1);
});
