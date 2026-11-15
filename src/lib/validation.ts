import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name (at least 2 characters)').max(100, 'Name is too long'),
  email: z.string().trim().email('Please enter a valid email address'),
  service: z.string().min(1, 'Please select what service you need'),
  message: z.string().trim().min(10, 'Please tell us a bit more about your project (at least 10 characters)').max(3000, 'Message is too long'),
  honeypot: z.string().max(0, 'Bot submission rejected').optional(),
  turnstileToken: z.string().min(1, 'Security verification required').max(2048, 'Token invalid'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// ---------- Free website review (landing page) ----------
export const REVIEW_GOALS = [
  'More enquiries and sales',
  'A faster website',
  'Show up on Google',
  'A new design or rebrand',
  'Not sure yet',
] as const;

export const REVIEW_BUDGETS = [
  'Under $1,500',
  '$1,500 to $3,500',
  '$3,500 to $8,000',
  'Over $8,000',
  'Prefer not to say',
] as const;

export const TRACKING_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref'] as const;

/** Accepts 'example.com' or 'https://example.com/page'. Returns a clean https/http URL, or null. */
export function normalizeWebsite(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!/^https?:$/.test(url.protocol)) return null;
    if (!url.hostname.includes('.') || url.hostname.length > 253) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export const reviewFormSchema = z
  .object({
    name: z.string().trim().min(2, 'Please enter your name (at least 2 characters)').max(100, 'Name is too long'),
    email: z.string().trim().email('Please enter a valid email address'),
    hasWebsite: z.boolean(),
    website: z.string().trim().max(300, 'Website address is too long').optional().default(''),
    goal: z.enum(REVIEW_GOALS, { message: 'Please choose your main goal' }),
    budget: z.enum(REVIEW_BUDGETS).optional(),
    message: z.string().trim().max(2000, 'Message is too long').optional().default(''),
    tracking: z.record(z.enum(TRACKING_KEYS), z.string().max(100)).optional(),
    honeypot: z.string().max(0, 'Bot submission rejected').optional(),
    turnstileToken: z.string().min(1, 'Security verification required').max(2048, 'Token invalid'),
  })
  .superRefine((v, ctx) => {
    if (v.hasWebsite && !normalizeWebsite(v.website)) {
      ctx.addIssue({
        code: 'custom',
        path: ['website'],
        message: 'Please enter your website address, for example yourbusiness.com',
      });
    }
    if (!v.hasWebsite && v.message.length < 10) {
      ctx.addIssue({
        code: 'custom',
        path: ['message'],
        message: 'Please tell us a little about your project (at least 10 characters)',
      });
    }
  });

export type ReviewFormData = z.infer<typeof reviewFormSchema>;
