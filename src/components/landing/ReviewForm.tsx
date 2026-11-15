'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { REVIEW_BUDGETS, REVIEW_GOALS, TRACKING_KEYS, reviewFormSchema } from '@/lib/validation';
import { TurnstileWidget, TurnstileWidgetRef } from '@/components/ui/TurnstileWidget';

const fieldBase =
  'w-full bg-bg-surface border border-line focus:border-accent text-ink rounded-input px-4 py-3 text-[1rem] outline-none transition-colors placeholder:text-mute/60';

interface FormState {
  name: string;
  email: string;
  hasWebsite: boolean;
  website: string;
  goal: string;
  budget: string;
  message: string;
  honeypot: string;
}

const initial: FormState = {
  name: '',
  email: '',
  hasWebsite: true,
  website: '',
  goal: '',
  budget: '',
  message: '',
  honeypot: '',
};

function readTracking(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  TRACKING_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) out[key] = value.slice(0, 100);
  });
  if (!out.ref && document.referrer) {
    try {
      out.ref = new URL(document.referrer).hostname.slice(0, 100);
    } catch {
      /* ignore bad referrer */
    }
  }
  return out;
}

export function ReviewForm() {
  const router = useRouter();
  const [data, setData] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<TurnstileWidgetRef>(null);

  const set = (name: keyof FormState, value: string | boolean) => {
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const a11y = (id: string) => ({
    id,
    name: id,
    'aria-invalid': errors[id] ? true : undefined,
    'aria-describedby': errors[id] ? `${id}-error` : undefined,
  });

  const fieldError = (id: string) =>
    errors[id] ? (
      <p id={`${id}-error`} role="alert" className="text-sm text-red-300 mt-1.5">
        {errors[id]}
      </p>
    ) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!turnstileToken) {
      setServerError('Please complete the security verification below before submitting.');
      return;
    }

    const payload = {
      name: data.name,
      email: data.email,
      hasWebsite: data.hasWebsite,
      website: data.hasWebsite ? data.website : '',
      goal: data.goal || undefined,
      budget: data.budget || undefined,
      message: data.message,
      honeypot: data.honeypot,
      turnstileToken,
    };

    const result = reviewFormSchema.safeParse(payload);
    if (!result.success) {
      const next: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0] ?? '');
        if (key && !next[key]) next[key] = issue.message;
      });
      setErrors(next);
      const first = Object.keys(next)[0];
      if (first) document.getElementById(first)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, tracking: readTracking() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        if (json.field && json.error) {
          setErrors({ [String(json.field)]: json.error });
        }
        throw new Error(json.error || 'Something went wrong. Please try again.');
      }
      router.push('/website-review/thank-you');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setTurnstileToken('');
      turnstileRef.current?.reset();
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Honeypot: hidden from people, tempting to bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="honeypot">Leave this blank</label>
        <input
          id="honeypot"
          name="honeypot"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={data.honeypot}
          onChange={(e) => set('honeypot', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm text-mute mb-2">
            Your name
          </label>
          <input
            {...a11y('name')}
            type="text"
            autoComplete="name"
            value={data.name}
            onChange={(e) => set('name', e.target.value)}
            className={fieldBase}
          />
          {fieldError('name')}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-mute mb-2">
            Email
          </label>
          <input
            {...a11y('email')}
            type="email"
            autoComplete="email"
            value={data.email}
            onChange={(e) => set('email', e.target.value)}
            className={fieldBase}
          />
          {fieldError('email')}
        </div>
      </div>

      <div>
        <label htmlFor="website" className="block text-sm text-mute mb-2">
          Your website address
        </label>
        <input
          {...a11y('website')}
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="yourbusiness.com"
          disabled={!data.hasWebsite}
          value={data.hasWebsite ? data.website : ''}
          onChange={(e) => set('website', e.target.value)}
          className={`${fieldBase} disabled:opacity-40`}
        />
        {fieldError('website')}
        <label className="mt-3 flex items-center gap-3 text-sm text-mute cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!data.hasWebsite}
            onChange={(e) => set('hasWebsite', !e.target.checked)}
            className="size-4 accent-[#d8c3a0]"
          />
          I don&apos;t have a website yet
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="goal" className="block text-sm text-mute mb-2">
            Your main goal
          </label>
          <select
            {...a11y('goal')}
            value={data.goal}
            onChange={(e) => set('goal', e.target.value)}
            className={fieldBase}
          >
            <option value="">Choose one</option>
            {REVIEW_GOALS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          {fieldError('goal')}
        </div>
        <div>
          <label htmlFor="budget" className="block text-sm text-mute mb-2">
            Budget <span className="text-mute/70">(optional)</span>
          </label>
          <select
            {...a11y('budget')}
            value={data.budget}
            onChange={(e) => set('budget', e.target.value)}
            className={fieldBase}
          >
            <option value="">Choose one</option>
            {REVIEW_BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {fieldError('budget')}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-mute mb-2">
          {data.hasWebsite ? 'Anything we should know?' : 'Tell us about your project'}{' '}
          {data.hasWebsite && <span className="text-mute/70">(optional)</span>}
        </label>
        <textarea
          {...a11y('message')}
          rows={4}
          value={data.message}
          onChange={(e) => set('message', e.target.value)}
          className={`${fieldBase} resize-y min-h-[110px]`}
        />
        {fieldError('message')}
      </div>

      {/* Cloudflare Turnstile Bot Defense */}
      <TurnstileWidget
        ref={turnstileRef}
        action="review_submission"
        onVerify={(token) => {
          setTurnstileToken(token);
          if (serverError.includes('security verification')) {
            setServerError('');
          }
        }}
        onExpire={() => setTurnstileToken('')}
        onError={() => setTurnstileToken('')}
      />

      {serverError && (
        <div role="alert" className="flex items-start gap-3 rounded-input border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-200">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <p>{serverError}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="size-5 mr-2 animate-spin" />
              Sending
            </>
          ) : (
            'Get my free review'
          )}
        </Button>
        {/* TODO: link this sentence to your Privacy Policy page once it exists */}
        <p className="text-sm text-mute">We use your details only to reply to this request.</p>
      </div>
    </form>
  );
}
