import fs from 'node:fs';

let apiKey = process.env.RESEND_API_KEY;
let emailFrom = process.env.EMAIL_FROM || 'Moon Sanctum Labs Verification <notifications@moonsanctumlabs.design>';

if (!apiKey && fs.existsSync('.env.local')) {
  const content = fs.readFileSync('.env.local', 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('RESEND_API_KEY=')) {
      apiKey = trimmed.replace('RESEND_API_KEY=', '').trim().replace(/^["']|["']$/g, '');
    }
  }
}

async function testForwarding() {
  console.log('=== TESTING INBOUND EMAIL FORWARDING VIA RESEND ===\n');

  if (!apiKey) {
    console.error('RESEND_API_KEY is not set');
    return;
  }

  const payload = {
    from: emailFrom,
    to: 'hello@moonsanctumlabs.design',
    subject: `Moon Sanctum Labs — Inbound Forwarding Test [${new Date().toISOString()}]`,
    text: [
      'Moon Sanctum Labs — Decode. Build. Evolve.',
      '',
      'This is an automated test message dispatched to hello@moonsanctumlabs.design to verify Porkbun inbound email forwarding to aniketnandi559@gmail.com.',
      '',
      `Timestamp: ${new Date().toISOString()}`,
      'Route: Resend SMTP -> Porkbun MX (fwd1.porkbun.com) -> Gmail (aniketnandi559@gmail.com)'
    ].join('\n')
  };

  console.log('Sending message to: hello@moonsanctumlabs.design');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const body = await res.json();
  console.log('Resend API Response:', res.status, JSON.stringify(body, null, 2));

  if (res.ok) {
    console.log(`\n✅ Message accepted by Resend with ID: ${body.id}`);
    console.log('Resend will deliver to MX fwd1.porkbun.com / fwd2.porkbun.com.');
    console.log('Please check your Gmail inbox (aniketnandi559@gmail.com) for this email!');
  } else {
    console.error('❌ Resend failed to send message:', body);
  }
}

testForwarding().catch(console.error);
