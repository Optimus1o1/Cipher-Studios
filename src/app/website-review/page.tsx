'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { ReviewForm } from '@/components/landing/ReviewForm';

// Edit these to match what you can really deliver.
const REVIEW_TURNAROUND = 'two working days';

const problems = [
  'They load slowly on phones, so visitors leave before the page appears.',
  'People searching for you on Google find your competitors first.',
  'Visitors read the page, then leave without getting in touch.',
];

const included = [
  'A speed check on mobile and desktop',
  'How visible you are on Google for your business name and main services',
  'What stands between a visitor and an enquiry',
  'Three fixes, ranked by impact and effort',
  'A 15-minute call to walk through it, if you want one',
];

const steps = [
  { title: 'Send your address', body: 'Fill in the short form below. It takes about a minute.' },
  { title: 'We review it', body: `An engineer on our team looks at your site and writes up what they find, within ${REVIEW_TURNAROUND}.` },
  { title: 'You get your review', body: 'It arrives by email, with a call if you would like one. No pressure to buy.' },
];

const faqs = [
  {
    q: 'Is it really free?',
    a: 'Yes. The review costs nothing and carries no obligation. If you would like us to fix what we find, we will quote separately and you can say no.',
  },
  {
    q: 'What do you need from me?',
    a: 'Your website address and your main goal. If you do not have a website yet, tick the box on the form and tell us about your project instead.',
  },
  {
    q: 'How long does it take?',
    a: `We aim to send your review within ${REVIEW_TURNAROUND}. We limit how many we take each week, so every one gets proper attention.`,
  },
  {
    q: 'What happens to my details?',
    a: 'We use them only to reply to your request. We do not sell or share them.',
  },
  {
    q: 'Will you push me to buy something?',
    a: 'No. You get the review either way, and you decide what, if anything, to do next.',
  },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 font-serif text-[1.18rem] text-ink hover:text-accent transition-colors">
      <span className="relative block w-5 h-5 rounded-full bg-ink overflow-hidden" aria-hidden="true">
        <span className="absolute inset-0 rounded-full bg-bg -translate-x-[36%]" />
      </span>
      <span className="font-light">Moon Sanctum Labs</span>
    </Link>
  );
}

export default function WebsiteReviewPage() {
  return (
    <div className="relative z-20 w-full pointer-events-auto">
      {/* Sticky header: logo and return action permanently accessible */}
      <header className="sticky top-0 inset-x-0 z-30 bg-bg/85 backdrop-blur-md border-b border-line/40 pointer-events-auto">
        <div className="max-w-content mx-auto px-4 sm:px-6 md:px-8 h-[64px] sm:h-[72px] flex items-center justify-between">
          <Logo />
          <Button href="/" size="sm" variant="secondary" className="px-3 sm:px-4 text-[0.82rem] sm:text-[0.88rem]">
            Back to home
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[85svh] flex items-center pt-16 sm:pt-20 pb-16">
        <div className="max-w-content mx-auto px-4 sm:px-6 md:px-8 w-full">
          <div className="max-w-[720px] space-y-6 sm:space-y-7">
            <h1 className="font-serif font-light text-ink text-[2.1rem] sm:text-[3.2rem] md:text-[4.2rem] leading-[1.08] tracking-[-0.03em] break-words">
              A free review of your website, from our studio team.
            </h1>
            <p className="text-mute text-[1.05rem] sm:text-[1.15rem] leading-relaxed max-w-[52ch]">
              Send us your site address. Within {REVIEW_TURNAROUND} you will get an honest review of its speed, search
              visibility and enquiry flow, with the three fixes worth doing first.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              <Button href="#review" size="lg" variant="primary" className="w-full sm:w-auto justify-center">
                Get my free review
              </Button>
              <span className="text-mute text-[0.92rem]">Free, no obligation, no sales pressure.</span>
            </div>
          </div>
        </div>
      </section>

      {/* The problem */}
      <Section veil={false} className="bg-bg">
        <h2 className="font-serif font-light text-ink text-[1.8rem] sm:text-[2.4rem] md:text-[3rem] leading-[1.1] tracking-[-0.025em] max-w-[20ch] mb-10 sm:mb-12">
          Most business websites lose customers in the same three ways.
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8 list-none p-0 m-0">
          {problems.map((p) => (
            <li key={p} className="border-t border-line pt-6 text-ink text-[1.05rem] sm:text-[1.08rem] leading-relaxed">
              {p}
            </li>
          ))}
        </ul>
      </Section>

      {/* What you get */}
      <Section veil={false} className="bg-bg-surface/40">
        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-10 md:gap-12">
          <h2 className="font-serif font-light text-ink text-[1.8rem] sm:text-[2.4rem] md:text-[3rem] leading-[1.1] tracking-[-0.025em] max-w-[14ch]">
            What is in your review.
          </h2>
          <ul className="list-none p-0 m-0 divide-y divide-line border-y border-line">
            {included.map((item) => (
              <li key={item} className="py-5 text-ink text-[1.05rem] sm:text-[1.08rem]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* How it works */}
      <Section veil={false} className="bg-bg">
        <h2 className="font-serif font-light text-ink text-[1.8rem] sm:text-[2.4rem] md:text-[3rem] leading-[1.1] tracking-[-0.025em] mb-10 sm:mb-12">
          Three simple steps.
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 list-none p-0 m-0">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t border-line pt-6 space-y-3">
              <span className="text-accent font-mono text-sm">0{i + 1}</span>
              <h3 className="font-serif font-light text-ink text-[1.4rem] sm:text-[1.5rem]">{s.title}</h3>
              <p className="text-mute text-[0.95rem] sm:text-[0.98rem] leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Who it is for */}
      <Section veil={false} className="bg-bg-surface/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          <div className="space-y-4">
            <h2 className="font-serif font-light text-ink text-[1.6rem] sm:text-[1.9rem] md:text-[2.2rem] leading-tight">A good fit if</h2>
            <p className="text-mute text-[1rem] sm:text-[1.05rem] leading-relaxed max-w-[44ch]">
              You run a business or startup, you have a website (or are about to build one), and you want clear advice
              from a person who will tell you the truth.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="font-serif font-light text-ink text-[1.6rem] sm:text-[1.9rem] md:text-[2.2rem] leading-tight">
              Probably not a fit if
            </h2>
            <p className="text-mute text-[1rem] sm:text-[1.05rem] leading-relaxed max-w-[44ch]">
              You want the cheapest possible template site, or an automated report with no human advice.
            </p>
          </div>
        </div>
      </Section>

      {/* TODO: add a Proof section here once you have a real case study or client quote to show. */}

      {/* FAQ */}
      <Section veil={false} className="bg-bg">
        <div className="max-w-[820px]">
          <h2 className="font-serif font-light text-ink text-[1.8rem] sm:text-[2.4rem] md:text-[3rem] leading-[1.1] tracking-[-0.025em] mb-8 sm:mb-10">
            Questions
          </h2>
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5 sm:py-6">
                <summary className="flex items-center justify-between gap-6 cursor-pointer list-none font-serif font-light text-ink text-[1.18rem] sm:text-[1.3rem] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-accent text-2xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-mute leading-relaxed max-w-[60ch] text-[0.98rem] sm:text-[1rem]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* Form */}
      <Section id="review" veil={false} className="bg-bg-surface/60 py-12 sm:py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-8 md:gap-16">
          <div className="space-y-4 sm:space-y-5">
            <h2 className="font-serif font-light text-ink text-[2rem] sm:text-[2.6rem] md:text-[3rem] leading-[1.1] tracking-[-0.025em] max-w-[12ch]">
              Get your free review.
            </h2>
            <p className="text-mute text-[1rem] sm:text-[1.05rem] leading-relaxed max-w-[38ch]">
              Tell us where to look and what you want from your site. We will take it from there.
            </p>
          </div>
          <ReviewForm />
        </div>
      </Section>

      {/* Minimal footer */}
      <footer className="bg-bg border-t border-line py-8 sm:py-10 text-mute text-sm">
        <div className="max-w-content mx-auto px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Moon Sanctum Labs. Kolkata, India.</p>
          <p className="text-mute text-xs sm:text-sm">Decode. Build. Evolve.</p>
        </div>
      </footer>
    </div>
  );
}
