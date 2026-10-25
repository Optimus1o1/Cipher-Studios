import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rateLimit';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    // 1. IP extraction & Rate limiting
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const rateResult = checkRateLimit(ip, 5, 10 * 60 * 1000);
    if (!rateResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many submissions from this connection. Please try again shortly.',
        },
        { status: 429 }
      );
    }

    // 2. Parse request body
    const body = await req.json();

    // 3. Honeypot check (anti-bot)
    if (body.honeypot && body.honeypot.length > 0) {
      // Pretend success to confuse spam bots
      return NextResponse.json({
        success: true,
        message: 'Project details received.',
      });
    }

    // 4. Validate fields with Zod
    const validation = contactFormSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.errors[0]?.message || 'Invalid form input';
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    const { name, email, service, message } = validation.data;

    // 5. Store lead in Firestore if configured
    let leadId = `lead_${Date.now()}`;
    if (adminDb) {
      try {
        const docRef = await adminDb.collection('leads').add({
          name,
          email,
          service,
          message,
          ip,
          createdAt: new Date().toISOString(),
          status: 'new',
          source: 'website_contact_form',
        });
        leadId = docRef.id;
      } catch (dbErr) {
        console.error('Firestore write error:', dbErr);
        // Continue gracefully so user is not blocked
      }
    } else {
      console.log('Firebase Admin not configured; lead logged locally:', {
        leadId,
        name,
        email,
        service,
        message,
        createdAt: new Date().toISOString(),
      });
    }

    // 6. Return success
    return NextResponse.json({
      success: true,
      leadId,
      message:
        'Thank you. We have received your project details and will reply within one working day.',
    });
  } catch (error) {
    console.error('Error in /api/contact:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred while submitting. Please email hello@moonsanctumlabs.com directly.',
      },
      { status: 500 }
    );
  }
}
