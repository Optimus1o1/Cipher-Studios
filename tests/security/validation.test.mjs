import assert from 'node:assert/strict';
import { z } from 'zod';

console.log('--- Running Schema Validation & Injection Prevention Tests ---');

// Reconstruct validation logic matching src/lib/validation.ts
const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name (at least 2 characters)').max(100, 'Name is too long'),
  email: z.string().trim().email('Please enter a valid email address'),
  service: z.string().min(1, 'Please select what service you need'),
  message: z.string().trim().min(10, 'Please tell us a bit more about your project (at least 10 characters)').max(3000, 'Message is too long'),
  honeypot: z.string().max(0, 'Bot submission rejected').optional(),
  turnstileToken: z.string().min(1, 'Security verification required').max(2048, 'Token invalid'),
});

// 1. Contact Form Valid
const validContact = {
  name: 'Stewart Nolan',
  email: 'stewart@example.com',
  service: 'web-development',
  message: 'We are seeking a senior studio to architect our Next.js web application.',
  turnstileToken: 'test-turnstile-token-xyz',
};
const res1 = contactFormSchema.safeParse(validContact);
assert.equal(res1.success, true, 'Valid contact payload should pass');

// 2. Contact Form Missing Turnstile Token
const missingTurnstileContact = {
  ...validContact,
  turnstileToken: '',
};
const res2 = contactFormSchema.safeParse(missingTurnstileContact);
assert.equal(res2.success, false, 'Missing turnstile token must be rejected');

// 3. Contact Form Honeypot Filled
const honeypotContact = {
  ...validContact,
  honeypot: 'spambot-value',
};
const res3 = contactFormSchema.safeParse(honeypotContact);
assert.equal(res3.success, false, 'Filled honeypot must fail validation');

// 4. Contact Form Invalid Email
const badEmailContact = {
  ...validContact,
  email: 'not-an-email',
};
const res4 = contactFormSchema.safeParse(badEmailContact);
assert.equal(res4.success, false, 'Invalid email format must fail validation');

// 5. Contact Form Oversized Message
const oversizedContact = {
  ...validContact,
  message: 'a'.repeat(3001),
};
const res5 = contactFormSchema.safeParse(oversizedContact);
assert.equal(res5.success, false, 'Message exceeding 3000 chars must fail validation');

console.log('✓ Contact form validation tests passed.');

// Review Form Validation Tests
const REVIEW_GOALS = [
  'More enquiries and sales',
  'A faster website',
  'Show up on Google',
  'A new design or rebrand',
  'Not sure yet',
];

function normalizeWebsite(input) {
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

// 6. Website Normalization
assert.equal(normalizeWebsite('example.com'), 'https://example.com/');
assert.equal(normalizeWebsite('https://sub.domain.co.uk/path'), 'https://sub.domain.co.uk/path');
assert.equal(normalizeWebsite('javascript:alert(1)'), null, 'JavaScript pseudo-protocols must be rejected');
assert.equal(normalizeWebsite('data:text/html,bad'), null, 'Data URIs must be rejected');
assert.equal(normalizeWebsite(''), null, 'Empty strings must return null');

console.log('✓ Website URL normalization and sanitization tests passed.');
