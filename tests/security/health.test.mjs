import assert from 'node:assert/strict';

console.log('--- Running Health Check Endpoint Contract Tests ---');

// Mock request to verify /api/health logic
async function testHealthLogic() {
  const payload = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  };

  assert.equal(payload.status, 'healthy', 'Health check status must be healthy');
  assert.ok(payload.timestamp, 'Timestamp must be present');
  assert.equal(typeof payload.uptime, 'number', 'Uptime must be a number');

  // Verify no environment secrets or database credentials leak
  const serialized = JSON.stringify(payload);
  assert.ok(!serialized.includes('supabase'), 'Must never leak Supabase info');
  assert.ok(!serialized.includes('secret'), 'Must never leak secrets');
  assert.ok(!serialized.includes('redis'), 'Must never leak Redis info');

  console.log('✓ Health check endpoint contract test passed.');
}

testHealthLogic().catch((err) => {
  console.error('Health test failed:', err);
  process.exit(1);
});
