import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validation';
import { checkRateLimit, extractClientIp, hashClientIp } from '@/lib/rateLimit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 32 * 1024; // 32 KB

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
    const rateResult = await checkRateLimit(`contact:${clientHash}`, 5, 10 * 60 * 1000);
    const isDegradedMode = Boolean(rateResult.degraded);

    if (isDegradedMode) {
      console.warn(
        '[OPERATIONAL_WARNING] Contact rate limiting degraded mode active (Redis unreachable). Distributed rate limiting is NOT operational; relying on Turnstile bot verification.',
        {
          hashPrefix: clientHash.slice(0, 8),
          timestamp: new Date().toISOString(),
        }
      );
    }

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
      // Return 200 immediately to deceive automated scrapers
      return NextResponse.json({
        success: true,
        message: 'Your project details have been received. We will be in touch shortly.',
      });
    }

    // 8. Zod Schema Validation
    const validation = contactFormSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || 'Invalid form input.';
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }

    const { name, email, service, message, turnstileToken } = validation.data;

    // 9. Server-Side Cloudflare Turnstile Verification
    const turnstileResult = await verifyTurnstileToken(turnstileToken, 'contact_submission');
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
      console.warn('[Contact API] Allowed request under Degraded Defense Mode (Turnstile verified).');
    }

    // 10. Supabase PostgreSQL Storage
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      console.error('[Contact API] Database configuration missing.');
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to process your request at this time. Please try again shortly.',
        },
        { status: 500 }
      );
    }

    const { error: dbError } = await supabase.from('contact_submissions').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      service: service ? service.trim() : null,
      message: message.trim(),
      status: 'new',
    });

    if (dbError) {
      console.error('[Contact API] Database insertion failed. Code:', dbError.code);
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
          replyTo: email.trim(),
          subject: `New Project Inquiry: ${name.trim()}`,
          text: [
            `Name: ${name.trim()}`,
            `Email: ${email.trim()}`,
            `Service: ${service || 'General inquiry'}`,
            '',
            'Message:',
            message.trim(),
            '',
            `Received: ${new Date().toISOString()}`,
          ].join('\n'),
        });
      } catch (emailErr) {
        console.error('[Contact API] Email notification failed (submission was saved):', emailErr);
      }
    }

    // Return sanitized success response (no internal database IDs exposed)
    return NextResponse.json({
      success: true,
      message: 'Your project details have been received. We will be in touch shortly.',
    });
  } catch (error) {
    console.error('[Contact API] Unexpected error occurred:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while processing your request. Please try again shortly.',
      },
      { status: 500 }
    );
  }
}
