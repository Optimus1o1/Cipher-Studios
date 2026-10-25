interface EmailInput {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

/**
 * Sends a plain-text email through Resend's REST API (no extra dependency).
 * Returns true only if the provider accepted the message.
 */
export async function sendEmail({ to, subject, text, replyTo }: EmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return false;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to,
        subject: subject.replace(/[\r\n]+/g, ' ').slice(0, 200),
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: controller.signal,
    });
    if (!res.ok) console.error('Email provider rejected message:', res.status);
    return res.ok;
  } catch (err) {
    console.error('Email send failed:', err);
    return false;
  } finally {
    clearTimeout(timer);
  }
}
