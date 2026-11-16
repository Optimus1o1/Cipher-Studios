async function run() {
  const payload = {
    name: 'Aniket Nandi Review Test',
    email: 'aniketnandi559@gmail.com',
    hasWebsite: true,
    website: 'moonsanctumlabs.design',
    goal: 'A faster website',
    budget: '$1,500 to $3,500',
    message: 'Phase 4 live staging end-to-end review verification for Moon Sanctum Labs.',
    turnstileToken: 'XXXX.DUMMY.TOKEN.XXXX'
  };

  const res = await fetch('https://moon-sanctum-labs-slsj.onrender.com/api/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://moon-sanctum-labs-slsj.onrender.com'
    },
    body: JSON.stringify(payload)
  });

  console.log('Review Submission Status:', res.status);
  const data = await res.json();
  console.log('Review Submission Response:', data);
}

run().catch(console.error);
