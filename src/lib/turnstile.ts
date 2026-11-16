import 'server-only';

export interface TurnstileVerificationResult {
  success: boolean;
  errorCodes?: string[];
  hostname?: string;
  action?: string;
  challengeTs?: string;
}

const TURNSTILE_VERIFY_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** Explicit production allowed hostnames for Turnstile verification */
const PRODUCTION_ALLOWED_HOSTNAMES = new Set([
  'moonsanctumlabs.design',
  'www.moonsanctumlabs.design',
  'moon-sanctum-labs-slsj.onrender.com',
]);

/** Local development allowed hostnames */
const DEV_ALLOWED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
]);

/**
 * Verify Cloudflare Turnstile token server-side.
 *
 * @param token The Turnstile response token submitted by the browser
 * @param expectedAction The action name configured on the widget ('contact_submission' | 'review_submission')
 */
export async function verifyTurnstileToken(
  token: string,
  expectedAction?: string
): Promise<TurnstileVerificationResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[Turnstile Error] TURNSTILE_SECRET_KEY is missing in production.');
      return { success: false, errorCodes: ['missing_secret_key'] };
    }
    // In dev without keys, warn and allow if token is present
    console.warn('[Turnstile Warning] TURNSTILE_SECRET_KEY not set. Dev bypass active.');
    return { success: true };
  }

  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return { success: false, errorCodes: ['missing_input_response'] };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secret);
    formData.append('response', token);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(TURNSTILE_VERIFY_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[Turnstile Error] Cloudflare API responded with status ${response.status}`);
      return { success: false, errorCodes: [`http_${response.status}`] };
    }

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        errorCodes: data['error-codes'] || ['verification_failed'],
      };
    }

    // Verify action match if provided
    if (expectedAction && data.action && data.action !== expectedAction) {
      console.warn(`[Turnstile] Action mismatch: expected "${expectedAction}", got "${data.action}"`);
      return {
        success: false,
        errorCodes: ['action_mismatch'],
      };
    }

    // Verify hostname against strict allowlist (localhost permitted only in non-production)
    const hostname = data.hostname?.toLowerCase();
    if (hostname) {
      const isProduction = process.env.NODE_ENV === 'production';
      let isAllowed = PRODUCTION_ALLOWED_HOSTNAMES.has(hostname);
      // In staging or testing mode when using Cloudflare's official dummy test keys, accept example.com
      if (secret.startsWith('1x000000') || data.metadata?.result_with_testing_key) {
        isAllowed = isAllowed || hostname === 'example.com';
      }
      if (!isProduction) {
        isAllowed = isAllowed || DEV_ALLOWED_HOSTNAMES.has(hostname);
      }

      if (!isAllowed) {
        console.warn(`[Turnstile] Hostname "${hostname}" rejected (not in explicit allowlist).`);
        return {
          success: false,
          errorCodes: ['hostname_mismatch'],
        };
      }
    }

    return {
      success: true,
      hostname: data.hostname,
      action: data.action,
      challengeTs: data.challenge_ts,
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.error('[Turnstile Error] Verification request timed out after 4 seconds.');
      return { success: false, errorCodes: ['timeout'] };
    }
    console.error('[Turnstile Error] Failed to verify token:', err);
    return { success: false, errorCodes: ['network_error'] };
  }
}
