import fs from 'node:fs';

let apiKey = process.env.RESEND_API_KEY;
let emailFrom = process.env.EMAIL_FROM || 'Moon Sanctum Labs <notifications@moonsanctumlabs.design>';
let notifyTo = process.env.LEAD_NOTIFY_EMAIL || 'aniketnandi559@gmail.com';

if (!apiKey && fs.existsSync('.env.local')) {
  const content = fs.readFileSync('.env.local', 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('RESEND_API_KEY=')) {
      apiKey = trimmed.replace('RESEND_API_KEY=', '').trim().replace(/^["']|["']$/g, '');
    }
    if (trimmed.startsWith('EMAIL_FROM=')) {
      emailFrom = trimmed.replace('EMAIL_FROM=', '').trim().replace(/^["']|["']$/g, '');
    }
    if (trimmed.startsWith('LEAD_NOTIFY_EMAIL=')) {
      notifyTo = trimmed.replace('LEAD_NOTIFY_EMAIL=', '').trim().replace(/^["']|["']$/g, '');
    }
  }
}

async function verifyResend() {
  console.log('=== RESEND TRANSACTIONAL EMAIL VERIFICATION ===\n');

  if (!apiKey) {
    console.log('STATUS: PENDING CREDENTIALS');
    console.log('RESEND_API_KEY is not configured.');
    console.log('Please configure RESEND_API_KEY in Render Dashboard environment variables.');
    return;
  }

  console.log('From:', emailFrom);
  console.log('To:', notifyTo);
  console.log('Reply-To: hello@moonsanctumlabs.design');
  console.log('Sending test transactional alert via Resend API...');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: emailFrom,
      to: notifyTo,
      reply_to: 'hello@moonsanctumlabs.design',
      subject: 'Moon Sanctum Labs — Production Email Delivery Verification',
      text: [
        'Moon Sanctum Labs — Decode. Build. Evolve.',
        '',
        'This is an automated verification email confirming transactional delivery from moonsanctumlabs.design.',
        `Timestamp: ${new Date().toISOString()}`,
        'System: Next.js 16.4.6 Node.js Web Service on Render (Singapore)',
        'Status: Verified',
      ].join('\n'),
    }),
  });

  const data = await res.json();
  console.log('\nHTTP Response Status:', res.status);
  console.log('Resend Response Payload:', data);

  if (res.ok && data.id) {
    console.log(`\n✓ Email successfully dispatched! Resend Message ID: ${data.id}`);
    console.log(`Please verify receipt in inbox: ${notifyTo}`);
  } else {
    console.error('\n✗ Email dispatch rejected by Resend:', data);
  }
}

verifyResend().catch(err => {
  console.error('\nEmail verification failed:', err.message);
});
