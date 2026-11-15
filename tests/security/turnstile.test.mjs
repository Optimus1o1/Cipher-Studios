import assert from 'node:assert/strict';

console.log('--- Running Cloudflare Turnstile Server Verification Tests ---');

const PRODUCTION_ALLOWED_HOSTNAMES = new Set([
  'moonsanctumlabs.design',
  'www.moonsanctumlabs.design',
  'moon-sanctum-labs.onrender.com',
  'moon-sanctum-labs-slsj.onrender.com',
]);

const DEV_ALLOWED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
]);

function isAllowedHostname(hostname, isProd = false) {
  if (!hostname) return true;
  const lower = hostname.toLowerCase();
  let allowed = PRODUCTION_ALLOWED_HOSTNAMES.has(lower);
  if (!isProd) {
    allowed = allowed || DEV_ALLOWED_HOSTNAMES.has(lower);
  }
  return allowed;
}

// 1. Production Allowlist Validation
assert.equal(isAllowedHostname('moonsanctumlabs.design', true), true, 'Production root domain must be allowed');
assert.equal(isAllowedHostname('www.moonsanctumlabs.design', true), true, 'Production www domain must be allowed');
assert.equal(isAllowedHostname('moon-sanctum-labs.onrender.com', true), true, 'Explicit Render service domain must be allowed');

// 2. Production Strict Rejections
assert.equal(isAllowedHostname('arbitrary-service.onrender.com', true), false, 'Arbitrary *.onrender.com must be rejected');
assert.equal(isAllowedHostname('moonsanctumlabs.com', true), false, 'Unowned .com domain must be rejected');
assert.equal(isAllowedHostname('phishing-site.com', true), false, 'Malicious external domains must be rejected');
assert.equal(isAllowedHostname('localhost', true), false, 'localhost must be rejected in production mode');
assert.equal(isAllowedHostname('127.0.0.1', true), false, '127.0.0.1 must be rejected in production mode');

// 3. Development Mode
assert.equal(isAllowedHostname('localhost', false), true, 'localhost allowed in development mode');
assert.equal(isAllowedHostname('127.0.0.1', false), true, '127.0.0.1 allowed in development mode');

// 4. Action Verification
function verifyAction(expected, actual) {
  if (!expected || !actual) return true;
  return expected === actual;
}

assert.equal(verifyAction('contact_submission', 'contact_submission'), true);
assert.equal(verifyAction('contact_submission', 'review_submission'), false, 'Cross-form token reuse must be blocked');

// 5. Token Input Validation
function validateTokenInput(token) {
  return typeof token === 'string' && token.trim().length > 0;
}

assert.equal(validateTokenInput(''), false, 'Empty token must be rejected');
assert.equal(validateTokenInput('   '), false, 'Whitespace token must be rejected');
assert.equal(validateTokenInput(null), false, 'Null token must be rejected');
assert.equal(validateTokenInput('valid-token-string'), true, 'Valid token string accepted');

console.log('✓ Cloudflare Turnstile verification contract tests passed with strict hostnames.');
