import React from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { processSteps } from '@/data/process';
import { OrbitalServicesHero } from '@/components/ui/orbital/OrbitalServicesHero';
import { ServicesGrid } from '@/components/ui/orbital/ServicesGrid';

export const metadata: Metadata = {
  title: 'Services | Moon Sanctum Labs — Digital Engineering & Design',
  description:
    'Six engineering disciplines: Website design, web development, SEO, digital marketing, branding, and care plans. Measurable engineering targets and transparent client handover.',
  alternates: {
    canonical: '/services',
  },
};

export default function ServicesPage() {
  return (
    <div className="w-full pt-28 pb-20 pointer-events-none">
      {/* Services Header */}
      <div className="relative max-w-content mx-auto px-6 md:px-8 pt-10 pb-6 text-center pointer-events-none select-none">
        {/* Soft scrim behind hero text block only (eyebrow, headline, subtitle, hint) */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none z-0"
          style={{
            top: '-50px',
            bottom: '-10px',
            left: 'calc(50% - min(510px, 48vw))',
            right: 'calc(50% - min(510px, 48vw))',
            background:
              'radial-gradient(ellipse at center, rgba(5, 6, 13, 0.88) 0%, rgba(5, 6, 13, 0.75) 55%, rgba(5, 6, 13, 0.38) 80%, rgba(5, 6, 13, 0) 100%)',
          }}
        />
        <div className="relative z-10">
          <span
            id="hero-eyebrow"
            className="text-[0.92rem] font-mono tracking-wider uppercase inline-block text-accent-copper font-medium"
            style={{
              textShadow: '0 1px 12px rgba(5, 6, 13, 0.8)',
            }}
          >
            Studio Capabilities · 06 Disciplines
          </span>
          <h1
            id="hero-headline"
            className="font-serif font-light text-ink text-[2.8rem] md:text-[4.6rem] leading-[1.06] tracking-[-0.025em] max-w-[16ch] mx-auto mt-4 mb-6"
          >
            Six services, one team, one standard.
          </h1>
          <p
            id="hero-subtitle"
            className="text-[1.12rem] md:text-[1.2rem] leading-relaxed max-w-[56ch] mx-auto text-[#C9CEDC]"
            style={{
              textShadow: '0 1px 12px rgba(5, 6, 13, 0.8)',
            }}
          >
            Choose an individual engineering discipline or commission an end-to-end digital launch.
            Six bespoke capabilities orbiting our central commitment to measurable quality.
          </p>
        </div>
      </div>

      {/* Interactive 3D Orbital Services Fleet Hero */}
      <OrbitalServicesHero />

      {/* Services Grid with Synchronized Orbital States */}
      <Section veil={false} borderTop={true} className="py-16 pointer-events-auto">
        <div className="space-y-12">
          <SectionHeading
            tag="Core Offerings"
            title="Disciplines engineered for sustainable commercial growth."
            lead="Detailed deliverables, technical capabilities, and transparent timelines across our six practices."
          />
          <ServicesGrid />
        </div>
      </Section>

      {/* Process Section */}
      <Section id="process" borderTop={true} className="mt-16 py-16 pointer-events-auto">
        <SectionHeading
          tag="Our Methodology"
          title="A calm, clear path from first call to launch."
          lead="How we run every single engagement, ensuring complete alignment before a single line of code is produced."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step) => (
            <div
              key={step.number}
              className="border-t border-line pt-6 space-y-3"
            >
              <span className="text-accent-copper text-[0.88rem] font-mono font-medium">
                0{step.number}
              </span>
              <h3 className="font-serif text-ink text-[1.5rem] font-light">
                {step.title}
              </h3>
              <p className="text-mute text-[0.96rem] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Free Website Review Callout */}
      <div className="max-w-content mx-auto px-6 md:px-8 pt-12 pointer-events-auto">
        <div className="p-6 md:p-8 rounded-card bg-bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-serif font-light text-ink text-[1.35rem] md:text-[1.5rem]">
              Not sure which service scope fits your goals?
            </h3>
            <p className="text-mute text-[0.98rem] leading-relaxed max-w-[50ch]">
              Send us your website address. We&apos;ll audit its speed, search crawlability, and conversion flow, providing three actionable fixes.
            </p>
          </div>
          <Button
            href="/website-review?utm_source=msl-site&utm_medium=internal&utm_campaign=service-page"
            size="md"
            variant="secondary"
            className="shrink-0"
          >
            Get a free website review
          </Button>
        </div>
      </div>

      {/* Bottom CTA */}
      <Section borderTop={true} className="bg-veil-deep mt-16 py-16 text-center pointer-events-auto">
        <div className="max-w-[650px] mx-auto space-y-6">
          <h2 className="font-serif text-ink text-[2.4rem] md:text-[3.2rem] font-light">
            Need a unified digital package?
          </h2>
          <p className="text-mute text-[1.1rem] leading-relaxed">
            Most growing businesses combine design, high-performance development, and ongoing SEO.
            Share your goals and we will structure a clear, unified project proposal.
          </p>
          <div className="pt-2">
            <Button href="/contact" size="lg" variant="primary">
              Request a project quote
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
