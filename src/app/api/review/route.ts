import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { reviewFormSchema, normalizeWebsite } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rateLimit';
import { adminDb } from '@/lib/firebaseAdmin';
import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

const oneLine = (s: string) => s.replace(/[\r\n\t]+/g, ' ').trim();

function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // browsers always send Origin on POST; this only lets non-browser tools through
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown'
  );
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ success: false, error: 'Request blocked.' }, { status: 403 });
  }

  const ip = clientIp(req);
  // NOTE: in-memory limiter. Replace with a shared store (Upstash Redis / Cloudflare) in production.
  const rate = checkRateLimit(`review:${ip}`, 5, 10 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many submissions from this connection. Please try again shortly.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: pretend success so bots learn nothing
  if (typeof body === 'object' && body !== null && (body as { honeypot?: unknown }).honeypot) {
    return NextResponse.json({ success: true });
  }

  const parsed = reviewFormSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { success: false, error: issue?.message || 'Invalid form input', field: issue?.path[0] },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const website = d.hasWebsite ? normalizeWebsite(d.website) : null;
  const ipHash = createHash('sha256')
    .update(`${ip}:${process.env.IP_HASH_SALT ?? ''}`)
    .digest('hex')
    .slice(0, 16);

  const lead = {
    type: 'website_review',
    name: oneLine(d.name),
    email: d.email,
    hasWebsite: d.hasWebsite,
    website,
    goal: d.goal,
    budget: d.budget ?? null,
    message: d.message,
    tracking: d.tracking ?? {},
    ipHash,
    status: 'new',
    source: 'website_review_landing',
    createdAt: new Date().toISOString(),
  };

  // 1. Store the lead
  let stored = false;
  let leadId = `review_${Date.now()}`;
  if (adminDb) {
    try {
      const ref = await adminDb.collection('leads').add(lead);
      leadId = ref.id;
      stored = true;
    } catch (err) {
      console.error('Firestore write error:', err);
    }
  }

  // 2. Notify the studio
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL;
  const notified = notifyTo
    ? await sendEmail({
        to: notifyTo,
        replyTo: lead.email,
        subject: `New website review request: ${lead.name}`,
        text: [
          `Name: ${lead.name}`,
          `Email: ${lead.email}`,
          `Website: ${website ?? 'No website yet'}`,
          `Goal: ${lead.goal}`,
          `Budget: ${lead.budget ?? 'Not given'}`,
          `Tracking: ${JSON.stringify(lead.tracking)}`,
          '',
          lead.message || '(no message)',
          '',
          `Lead ID: ${leadId}`,
        ].join('\n'),
      })
    : false;

  // 3. Never tell a visitor it worked if the lead was neither saved nor emailed
  if (!stored && !notified) {
    console.error('Review lead could not be saved or emailed:', leadId);
    return NextResponse.json(
      {
        success: false,
        error:
          'We could not save your request just now. Please email hello@moonsanctumlabs.com and we will review your site straight away.',
      },
      { status: 503 }
    );
  }

  // 4. Confirmation to the visitor (best effort)
  await sendEmail({
    to: lead.email,
    subject: 'We have your website review request',
    text: [
      `Hi ${lead.name.split(' ')[0]},`,
      '',
      'Thank you. We have your request and a senior member of our team will review your site and email you what we find.',
      '',
      'If anything changes, just reply to this email.',
      '',
      'Moon Sanctum Labs',
    ].join('\n'),
  });

  return NextResponse.json({ success: true, leadId });
}
