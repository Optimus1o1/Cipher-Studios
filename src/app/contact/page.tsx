'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, MapPin, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/glass/GlassCard';
import { servicesData } from '@/data/services';
import { contactFormSchema } from '@/lib/validation';

function ContactForm() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get('service') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
    honeypot: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for that field
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('idle');
    setErrorMessage('');
    setFieldErrors({});

    // Client-side Zod validation
    const result = contactFormSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const fieldName = err.path[0] as string;
        if (fieldName && !errors[fieldName]) {
          errors[fieldName] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send submission.');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        service: '',
        message: '',
        honeypot: '',
      });
    } catch (err: unknown) {
      setSubmitStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot field for anti-spam (hidden from real users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="honeypot">Leave this blank</label>
        <input
          type="text"
          id="honeypot"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-mute">
            Your name <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Stewart Nolan"
            className="w-full bg-white/5 border border-line focus:border-accent text-ink rounded-input px-4 py-3 text-[1rem] outline-none transition-colors placeholder:text-mute/40"
          />
          {fieldErrors.name && (
            <p className="text-xs text-red-400 mt-1">{fieldErrors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-mute">
            Email address <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="stewart@example.com"
            className="w-full bg-white/5 border border-line focus:border-accent text-ink rounded-input px-4 py-3 text-[1rem] outline-none transition-colors placeholder:text-mute/40"
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-400 mt-1">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      {/* Service selector */}
      <div className="space-y-2">
        <label htmlFor="service" className="block text-sm font-medium text-mute">
          What service do you need? <span className="text-accent">*</span>
        </label>
        <select
          id="service"
          name="service"
          required
          value={formData.service}
          onChange={handleChange}
          className="w-full bg-[#0b0d18] border border-line focus:border-accent text-ink rounded-input px-4 py-3 text-[1rem] outline-none transition-colors"
        >
          <option value="" disabled>
            Select a service or focus area
          </option>
          {servicesData.map((s) => (
            <option key={s.slug} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value="A full launch package">A full launch package (Design + Code + SEO)</option>
          <option value="Not sure yet">Not sure yet (Need guidance)</option>
        </select>
        {fieldErrors.service && (
          <p className="text-xs text-red-400 mt-1">{fieldErrors.service}</p>
        )}
      </div>

      {/* Message textarea */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-mute">
          About your business and project <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us what you sell, who you sell to, and what you want the new website or campaign to accomplish."
          className="w-full bg-white/5 border border-line focus:border-accent text-ink rounded-input px-4 py-3 text-[1rem] outline-none transition-colors placeholder:text-mute/40 resize-y"
        />
        {fieldErrors.message && (
          <p className="text-xs text-red-400 mt-1">{fieldErrors.message}</p>
        )}
      </div>

      {/* Submission feedback alerts */}
      {submitStatus === 'success' && (
        <div className="p-4 rounded-input bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-300 text-sm">
          <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Details received successfully.</p>
            <p className="text-emerald-300/80 mt-1">
              Thank you for reaching out. We will review your requirements and
              reply to your email within one business day.
            </p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 rounded-input bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Submission could not be completed.</p>
            <p className="text-rose-300/80 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Submit button */}
      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          variant="primary"
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[200px]"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>Sending details...</span>
            </span>
          ) : (
            'Send project details'
          )}
        </Button>
      </div>
    </form>
  );
}

export default function ContactPage() {
  return (
    <div className="w-full pt-28 pb-20">
      <Section veil={false} className="py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading and Context */}
          <div className="space-y-8">
            <div>
              <span className="text-accent text-[0.92rem] uppercase tracking-wider font-medium">
                Initiate Project
              </span>
              <h1 className="font-serif font-light text-ink text-[2.8rem] sm:text-[3.6rem] md:text-[4.4rem] leading-[1.06] tracking-[-0.025em] mt-3 mb-6">
                Tell us about your project.
              </h1>
              <p className="text-mute text-[1.12rem] leading-relaxed max-w-[48ch]">
                Share a few details about your vision and timeline. We review every
                submission carefully and reply within one business day with honest
                advice and next steps.
              </p>
            </div>

            {/* Studio Info Card */}
            <GlassCard tone="dark" className="space-y-6 p-7">
              <div className="flex items-start gap-3.5">
                <MapPin className="size-5 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="text-ink font-medium text-sm">Studio Location</h4>
                  <p className="text-mute text-sm mt-0.5">
                    Kolkata, West Bengal, India (IST)
                  </p>
                  <p className="text-mute text-xs mt-0.5">
                    Operating seamlessly across global timezones.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="size-5 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="text-ink font-medium text-sm">Direct Contact</h4>
                  <a
                    href="mailto:hello@moonsanctumlabs.com"
                    className="text-accent hover:underline text-sm mt-0.5 inline-block"
                  >
                    hello@moonsanctumlabs.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="size-5 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="text-ink font-medium text-sm">Guaranteed Response</h4>
                  <p className="text-mute text-sm mt-0.5">
                    Within 24 business hours. No spam, no sales pressure.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Contact Form */}
          <GlassCard tone="dark" className="p-8 md:p-10">
            <div className="mb-6 pb-5 border-b border-line flex items-center justify-between flex-wrap gap-2 text-sm text-mute">
              <span>Not sure where to start?</span>
              <Link
                href="/website-review?utm_source=msl-site&utm_medium=internal&utm_campaign=contact-intro"
                className="text-accent hover:underline font-medium inline-flex items-center gap-1"
              >
                Get a free review &rarr;
              </Link>
            </div>
            <Suspense fallback={<div className="text-mute py-8">Loading form...</div>}>
              <ContactForm />
            </Suspense>
          </GlassCard>
        </div>
      </Section>
    </div>
  );
}
