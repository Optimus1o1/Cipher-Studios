import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Clock, UserCheck, ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { servicesData } from '@/data/services';
import { processSteps } from '@/data/process';
import { OrbitalServicesHero } from '@/components/ui/orbital/OrbitalServicesHero';
import { ServicesGrid } from '@/components/ui/orbital/ServicesGrid';

export const metadata: Metadata = {
  title: 'Services | Moon Sanctum Labs',
  description:
    'Six senior disciplines: Web design, web development, SEO, digital marketing, branding, and care plans. Transparent timelines and total ownership.',
};

export default function ServicesPage() {
  return (
    <div className="w-full pt-28 pb-20 pointer-events-none">
      {/* Services Header */}
      <div className="max-w-content mx-auto px-6 md:px-8 pt-10 pb-6 text-center pointer-events-none select-none">
        <span className="text-accent text-[0.95rem] font-medium tracking-wide uppercase inline-block">
          Studio Capabilities
        </span>
        <h1 className="font-serif font-light text-ink text-[2.8rem] md:text-[4.6rem] leading-[1.06] tracking-[-0.025em] max-w-[16ch] mx-auto mt-4 mb-6">
          Six services, one team, one standard.
        </h1>
        <p className="text-mute text-[1.12rem] md:text-[1.2rem] leading-relaxed max-w-[54ch] mx-auto">
          Choose an individual service or commission an end-to-end launch. Six bespoke capabilities orbiting our central mission to help your business grow.
        </p>
      </div>

      {/* Interactive 3D Orbital Services Fleet Hero */}
      <OrbitalServicesHero />

      {/* Services Grid with Synchronized Orbital States */}
      <Section veil={false} borderTop={true} className="py-12 pointer-events-auto">
        <ServicesGrid />
      </Section>

      {/* Process Section */}
      <Section id="process" borderTop={true} className="mt-16 pointer-events-auto">
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
              <span className="text-accent text-[0.88rem] font-mono font-medium">
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
              Not sure what you need?
            </h3>
            <p className="text-mute text-[0.98rem] leading-relaxed max-w-[50ch]">
              Send us your website address and we&apos;ll pinpoint the top three fixes for speed, Google ranking, and conversions.
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
      <Section borderTop={true} className="bg-veil-deep mt-16 text-center pointer-events-auto">
        <div className="max-w-[650px] mx-auto space-y-6">
          <h2 className="font-serif text-ink text-[2.4rem] md:text-[3.2rem] font-light">
            Need a tailored package?
          </h2>
          <p className="text-mute text-[1.1rem] leading-relaxed">
            Most growing businesses combine design, development and ongoing SEO.
            Tell us your goals and we will structure a clear, unified project proposal.
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
