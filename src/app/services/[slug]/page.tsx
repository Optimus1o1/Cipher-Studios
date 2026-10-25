import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, UserCheck } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/glass/GlassCard';
import { servicesData, ServiceItem } from '@/data/services';
import { processSteps } from '@/data/process';
import { SATELLITE_CONFIGS } from '@/data/satellites';

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const service = servicesData.find((s) => s.slug === params.slug);
  if (!service) {
    return {
      title: 'Service Not Found | Moon Sanctum Labs',
    };
  }

  return {
    title: `${service.title} | Moon Sanctum Labs`,
    description: service.intro,
    openGraph: {
      title: `${service.title} — Moon Sanctum Labs`,
      description: service.intro,
    },
  };
}

export default function ServiceDetailPage({ params }: Props) {
  const serviceIndex = servicesData.findIndex((s) => s.slug === params.slug);
  if (serviceIndex === -1) {
    notFound();
  }

  const service = servicesData[serviceIndex];
  const nextService = servicesData[(serviceIndex + 1) % servicesData.length];
  const satellite = SATELLITE_CONFIGS.find((s) => s.slug === params.slug);

  return (
    <div className="relative z-20 w-full pt-28 pb-20 pointer-events-auto">
      {/* Top Breadcrumb & Hero */}
      <div className="max-w-content mx-auto px-6 md:px-8 pt-6 pb-20">
        <Link
          href="/services"
          className="relative z-30 inline-flex items-center gap-2 text-mute hover:text-ink text-[0.92rem] mb-6 sm:mb-10 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          <ArrowLeft className="size-4" />
          <span>All services</span>
        </Link>

        {/* Dedicated mobile satellite viewing window (above text block) */}
        <div className="h-44 md:hidden pointer-events-none" aria-hidden="true" />

        <div className="max-w-[760px] space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-accent text-[0.92rem] uppercase tracking-wider font-medium">
              Service Scope
            </span>
            {satellite && (
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-white/10 text-[#F2EFE8] shadow-sm"
                style={{
                  backgroundColor: 'rgba(5, 6, 13, 0.7)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: satellite.accentColor }} />
                <span>Orbital Instrument {satellite.number} / 06 • Active</span>
              </span>
            )}
          </div>

          <h1 className="font-serif font-light text-ink text-[2.8rem] sm:text-[3.8rem] md:text-[5rem] leading-[1.04] tracking-[-0.025em]">
            {service.title}
          </h1>

          <p className="text-mute text-[1.12rem] md:text-[1.25rem] leading-relaxed max-w-[50ch]">
            {service.intro}
          </p>

          <div className="pt-4 flex flex-wrap gap-8 text-[0.94rem] border-t border-line">
            <div>
              <span className="block font-medium text-accent text-xs uppercase tracking-wider mb-1">
                Best For
              </span>
              <span className="text-ink">{service.bestFor}</span>
            </div>
            <div>
              <span className="block font-medium text-accent text-xs uppercase tracking-wider mb-1">
                Typical Timeline
              </span>
              <span className="text-ink">{service.timeline}</span>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap items-center gap-4">
            <Button
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              size="lg"
              variant="primary"
            >
              Discuss this service
            </Button>
            <Button href="#included" size="lg" variant="secondary">
              What&apos;s included
            </Button>
          </div>
        </div>
      </div>

      {/* What is Included */}
      <Section id="included" borderTop={true}>
        <div className="space-y-10">
          <div className="space-y-2">
            <span className="text-accent text-sm uppercase tracking-wider font-medium">
              Deliverables
            </span>
            <h2 className="font-serif text-ink text-[2.2rem] md:text-[2.8rem] font-light">
              What is included
            </h2>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 list-none p-0 m-0">
            {service.included.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3.5 py-4 border-t border-line text-[1.05rem] text-ink"
              >
                <CheckCircle2 className="size-5 text-accent shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* What You Get / Outcomes */}
      <Section id="outcomes" borderTop={true}>
        <div className="space-y-10">
          <div className="space-y-2">
            <span className="text-accent text-sm uppercase tracking-wider font-medium">
              Business Value
            </span>
            <h2 className="font-serif text-ink text-[2.2rem] md:text-[2.8rem] font-light">
              What you get
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.outcomes.map((outcome, i) => (
              <GlassCard key={i} tone="dark" className="space-y-3">
                <span className="text-accent font-mono text-sm">Outcome 0{i + 1}</span>
                <p className="text-ink text-[1.08rem] font-light leading-relaxed">
                  {outcome}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>

      {/* How it works */}
      <Section id="process" borderTop={true}>
        <div className="space-y-10">
          <div className="space-y-2">
            <span className="text-accent text-sm uppercase tracking-wider font-medium">
              Workflow
            </span>
            <h2 className="font-serif text-ink text-[2.2rem] md:text-[2.8rem] font-light">
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div key={step.number} className="border-t border-line pt-6 space-y-3">
                <span className="text-accent font-mono text-sm">0{step.number}</span>
                <h3 className="font-serif text-ink text-[1.4rem] font-light">
                  {step.title}
                </h3>
                <p className="text-mute text-[0.95rem] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Questions / FAQs */}
      <Section id="faq" borderTop={true}>
        <div className="max-w-[850px] space-y-10">
          <div className="space-y-2">
            <span className="text-accent text-sm uppercase tracking-wider font-medium">
              Common Inquiries
            </span>
            <h2 className="font-serif text-ink text-[2.2rem] md:text-[2.8rem] font-light">
              Frequently asked questions
            </h2>
          </div>

          <div className="divide-y divide-line border-y border-line">
            {service.faqs.map((faq, i) => (
              <details
                key={i}
                className="group py-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              >
                <summary className="list-none flex items-center justify-between gap-4 font-serif text-[1.3rem] md:text-[1.45rem] font-light text-ink hover:text-accent transition-colors">
                  <span>{faq.question}</span>
                  <span className="text-accent font-sans text-2xl transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-mute text-[1rem] leading-relaxed max-w-[65ch]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* Free Website Review Callout */}
      <div className="max-w-content mx-auto px-6 md:px-8 py-8">
        <div className="p-6 md:p-8 rounded-card bg-bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-serif font-light text-ink text-[1.35rem] md:text-[1.5rem]">
              Not sure what you need?
            </h3>
            <p className="text-mute text-[0.98rem] leading-relaxed max-w-[50ch]">
              Send us your website address. We&apos;ll review its speed, search ranking, and conversion flow with three clear fixes.
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

      {/* Next Service & Bottom CTA Navigation */}
      <Section borderTop={true} className="bg-veil-deep">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <Button
            href={`/contact?service=${encodeURIComponent(service.title)}`}
            size="lg"
            variant="primary"
          >
            Start a {service.title.toLowerCase()} project
          </Button>

          <Link
            href={`/services/${nextService.slug}`}
            className="group flex items-center gap-3 text-right"
          >
            <div className="text-left sm:text-right">
              <span className="block text-xs uppercase tracking-wider text-mute">
                Next Service
              </span>
              <span className="font-serif text-[1.4rem] md:text-[1.6rem] font-light text-ink group-hover:text-accent transition-colors">
                {nextService.title}
              </span>
            </div>
            <div className="size-10 rounded-full border border-line flex items-center justify-center text-mute group-hover:text-ink group-hover:border-accent transition-colors">
              <ArrowRight className="size-4" />
            </div>
          </Link>
        </div>
      </Section>
    </div>
  );
}
