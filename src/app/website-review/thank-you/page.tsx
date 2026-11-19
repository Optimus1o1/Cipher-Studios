import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Thank you | Moon Sanctum Labs',
  robots: { index: false, follow: false },
  alternates: { canonical: '/website-review/thank-you' },
};

export default function ThankYouPage() {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

  return (
    <div className="relative z-20 w-full min-h-[100svh] flex items-center py-24 pointer-events-auto" style={{ background: 'radial-gradient(ellipse at 70% 30%, #0f1430 0%, #05060d 70%)' }}>
      <div className="max-w-content mx-auto px-6 md:px-8 w-full">
        <div className="max-w-[640px] space-y-8">
          <Link href="/" className="inline-block text-mute hover:text-ink transition-colors text-sm">
            Moon Sanctum Labs
          </Link>
          <h1 className="font-serif font-light text-ink text-[2.6rem] md:text-[4rem] leading-[1.05] tracking-[-0.03em]">
            Thank you. Your request is in.
          </h1>
          <p className="text-mute text-[1.12rem] leading-relaxed">
            We have sent you a confirmation email. Our engineering team will review your site and email you what
            they find.
          </p>
          <ol className="list-none p-0 m-0 divide-y divide-line border-y border-line text-ink">
            <li className="py-4">1. We review your site.</li>
            <li className="py-4">2. You receive your review by email.</li>
            <li className="py-4">3. If you would like, we talk it through on a short call.</li>
          </ol>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {bookingUrl ? (
              <Button href={bookingUrl} external size="lg" variant="primary">
                Book a time to talk
              </Button>
            ) : null}
            <Button href="/" size="lg" variant="secondary">
              Back to the website
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
