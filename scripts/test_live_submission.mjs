const BASE_URL = process.env.BASE_URL || 'https://moon-sanctum-labs-slsj.onrender.com';

async function testSubmission() {
  console.log(`=== LIVE FORM SUBMISSION TEST SUITE ===`);
  console.log(`Target: ${BASE_URL}\n`);

  // 1. Test POST /api/contact
  console.log('1. Testing POST /api/contact...');
  const contactPayload = {
    name: 'Aniket Nandi Live Verification',
    email: 'aniketnandi559@gmail.com',
    service: 'web-design',
    message: 'Phase 5 live contact form submission verification for Moon Sanctum Labs.',
    turnstileToken: 'XXXX.DUMMY.TOKEN.XXXX',
  };

  const contactRes = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': BASE_URL,
    },
    body: JSON.stringify(contactPayload),
  });

  console.log(`  HTTP Status: ${contactRes.status}`);
  const contactData = await contactRes.json();
  console.log(`  Response:`, contactData);

  // 2. Test POST /api/review
  console.log('\n2. Testing POST /api/review...');
  const reviewPayload = {
    name: 'Aniket Nandi Live Review Verification',
    email: 'aniketnandi559@gmail.com',
    hasWebsite: true,
    website: 'https://moonsanctumlabs.design',
    goal: 'A faster website',
    budget: '$1,500 to $3,500',
    message: 'Phase 5 live website audit request verification.',
    turnstileToken: 'XXXX.DUMMY.TOKEN.XXXX',
  };

  const reviewRes = await fetch(`${BASE_URL}/api/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': BASE_URL,
    },
    body: JSON.stringify(reviewPayload),
  });

  console.log(`  HTTP Status: ${reviewRes.status}`);
  const reviewData = await reviewRes.json();
  console.log(`  Response:`, reviewData);

  console.log('\n=== Live submission tests concluded ===');
}

testSubmission().catch(console.error);
