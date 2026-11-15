import { NextRequest, NextResponse } from 'next/server';
import { reviewFormSchema, normalizeWebsite, TRACKING_KEYS } from '@/lib/validation';
import { checkRateLimit, extractClientIp, hashClientIp } from '@/lib/rateLimit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 32 * 1024; // 32 KB
const oneLine = (s: string) => s.replace(/[\r\n\t]+/g, ' ').trim();

/**
 * 1. Method Guard: Disallow non-POST methods with 405 Method Not Allowed
 */
export async function GET() {
  return new NextResponse('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'POST' },
  });
}
export async function PUT() {
  return new NextResponse('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'POST' },
  });
}
export async function DELETE() {
  return new NextResponse('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'POST' },
  });
}
export async function PATCH() {
  return new NextResponse('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'POST' },
  });
}

/**
 * 2. Same-Origin Verification
 */
function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // Non-browser testing clients permitted
  try {
    const originHost = new URL(origin).host;
    const host = req.headers.get('host') || req.headers.get('x-forwarded-host');
    return originHost === host;
  } catch {
    return false;
  }
}

/**
 * 3. 32 KB Streamed Body Limit Reader
 */
async function readBoundedBody(
  req: NextRequest
): Promise<{ text: string } | { error: string; status: number }> {
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return { error: 'Payload too large. Request body exceeds 32 KB.', status: 413 };
  }

  if (!req.body) {
    return { text: '' };
  }

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.length;
        if (totalBytes > MAX_BODY_BYTES) {
          return { error: 'Payload too large. Request body exceeds 32 KB.', status: 413 };
        }
        chunks.push(value);
      }
    }
  } finally {
    reader.releaseLock();
  }

  const totalBuffer = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    totalBuffer.set(chunk, offset);
    offset += chunk.length;
  }

  return { text: new TextDecoder('utf-8').decode(totalBuffer) };
}

export async function POST(req: NextRequest) {
  try {
    // 2. Same-Origin Check
    if (!isSameOrigin(req)) {
      return NextResponse.json({ success: false, error: 'Request blocked.' }, { status: 403 });
    }

    // 3. 32 KB Streamed Body Limit
    const bodyResult = await readBoundedBody(req);
    if ('error' in bodyResult) {
      return NextResponse.json(
        { success: false, error: bodyResult.error },
        { status: bodyResult.status }
      );
    }

    // 4. Client Identifier & Cryptographic Anonymization
    const rawIp = extractClientIp(req);
    const clientHash = hashClientIp(rawIp);

    // 5. Distributed Sliding-Window Rate Limiting (Upstash Redis)
    const rateResult = await checkRateLimit(`review:${clientHash}`, 5, 10 * 60 * 1000);
    const isDegradedMode = Boolean(rateResult.degraded);

    if (!rateResult.success && !isDegradedMode) {
      const retryAfterSeconds = Math.max(1, Math.ceil((rateResult.reset - Date.now()) / 1000));
      return NextResponse.json(
        {
          success: false,
          error: 'Too many submissions from this connection. Please try again shortly.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSeconds),
          },
        }
      );
    }

    // 6. Safe JSON Parsing
    let body: any;
    try {
      body = JSON.parse(bodyResult.text || '{}');
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    // 7. Honeypot Anti-Bot Filter
    if (body && typeof body === 'object' && body.honeypot) {
      return NextResponse.json({
        success: true,
        message: 'Your website review request has been received.',
      });
    }

    // 8. Zod Schema Validation
    const parsed = reviewFormSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: issue?.message || 'Invalid form input.',
          field: issue?.path[0],
        },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const website = d.hasWebsite ? normalizeWebsite(d.website) : null;

    // 9. Server-Side Cloudflare Turnstile Verification
    const turnstileResult = await verifyTurnstileToken(d.turnstileToken, 'review_submission');
    if (!turnstileResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Security verification failed. Please refresh and try again.',
        },
        { status: 403 }
      );
    }

    if (isDegradedMode) {
      console.warn('[Review API] Allowed request under Degraded Defense Mode (Turnstile verified).');
    }

    // Restrict tracking payload keys and max length
    const rawTracking = (d.tracking || {}) as Record<string, string | undefined>;
    const sanitizedTracking: Record<string, string> = {};
    for (const key of TRACKING_KEYS) {
      const val = rawTracking[key];
      if (val && typeof val === 'string') {
        sanitizedTracking[key] = val.slice(0, 100);
      }
    }

    // 10. Supabase PostgreSQL Storage
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      console.error('[Review API] Database configuration missing.');
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to process your request at this time. Please try again shortly.',
        },
        { status: 500 }
      );
    }

    const { error: dbError } = await supabase.from('review_submissions').insert({
      name: oneLine(d.name),
      email: d.email.trim().toLowerCase(),
      website,
      has_website: d.hasWebsite,
      goal: d.goal,
      budget: d.budget || null,
      message: d.message ? d.message.trim() : null,
      tracking: sanitizedTracking,
      status: 'new',
    });

    if (dbError) {
      console.error('[Review API] Database insertion failed. Code:', dbError.code);
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to process your request at this time. Please try again shortly.',
        },
        { status: 500 }
      );
    }

    // Asynchronous Studio Notification (Resend)
    const notifyTo = process.env.LEAD_NOTIFY_EMAIL;
    if (notifyTo) {
      try {
        await sendEmail({
          to: notifyTo,
          replyTo: d.email.trim(),
          subject: `Website Review Request: ${d.name} (${website || 'No site yet'})`,
          text: [
            `Name: ${d.name}`,
            `Email: ${d.email}`,
            `Website: ${website || 'Does not have a website yet'}`,
            `Primary Goal: ${d.goal}`,
            `Budget Range: ${d.budget || 'Not specified'}`,
            '',
            'Project / Context:',
            d.message || '(None provided)',
            '',
            'Attribution Data:',
            Object.keys(sanitizedTracking).length > 0
              ? JSON.stringify(sanitizedTracking, null, 2)
              : '(Direct / None)',
            '',
            `Timestamp: ${new Date().toISOString()}`,
          ].join('\n'),
        });
      } catch (emailErr) {
        console.error('[Review API] Email notification failed (submission was saved):', emailErr);
      }
    }

    // Return sanitized success response (no internal database IDs exposed)
    return NextResponse.json({
      success: true,
      message: 'Your website review request has been received.',
    });
  } catch (error) {
    console.error('[Review API] Unexpected error occurred:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while processing your request. Please try again shortly.',
      },
      { status: 500 }
    );
  }
}
