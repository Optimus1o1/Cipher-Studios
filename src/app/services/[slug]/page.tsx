import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Shield, Terminal, Sparkles } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/glass/GlassCard';
import { servicesData } from '@/data/services';
import { processSteps } from '@/data/process';
import { SATELLITE_CONFIGS } from '@/data/satellites';
import { ServiceSpecHUD } from '@/components/services/ServiceSpecHUD';
import { ServiceDeliverablesList } from '@/components/services/ServiceDeliverablesList';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);
  if (!service) {
    return {
      title: 'Service Not Found | Moon Sanctum Labs',
    };
  }

  return {
    title: `${service.title} | Moon Sanctum Labs`,
    description: service.intro,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title: `${service.title} — Moon Sanctum Labs`,
      description: service.intro,
      url: `/services/${slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const serviceIndex = servicesData.findIndex((s) => s.slug === slug);
  if (serviceIndex === -1) {
    notFound();
  }

  const service = servicesData[serviceIndex];
  const nextService = servicesData[(serviceIndex + 1) % servicesData.length];
  const satellite = SATELLITE_CONFIGS.find((s) => s.slug === slug);

  return (
    <div className="relative z-20 w-full pt-28 pb-20 pointer-events-auto">
      {/* Top Breadcrumb & Hero */}
      <div className="max-w-content mx-auto px-6 md:px-8 pt-6 pb-16">
        <Link
          href="/services"
          className="relative z-30 inline-flex items-center gap-2 text-mute hover:text-ink text-[0.92rem] mb-6 sm:mb-10 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-copper rounded-sm"
        >
          <ArrowLeft className="size-4" />
          <span>All services</span>
        </Link>

        {/* Dedicated mobile satellite viewing window (above text block) */}
        <div className="h-44 md:hidden pointer-events-none" aria-hidden="true" />

        <div className="max-w-[820px] space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-accent-copper text-[0.92rem] uppercase tracking-wider font-medium">
              Service Discipline {service.number} / 06
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
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: satellite.accentColor }}
                />
                <span>Orbital Instrument {satellite.number} Active</span>
              </span>
            )}
          </div>

          <h1 className="font-serif font-light text-ink text-[2.8rem] sm:text-[3.8rem] md:text-[5rem] leading-[1.04] tracking-[-0.025em]">
            {service.title}
          </h1>

          <p className="font-mono text-sm sm:text-base text-accent-copper/90 uppercase tracking-wide">
            {service.tagline}
          </p>

          <p className="text-mute text-[1.12rem] md:text-[1.22rem] leading-relaxed max-w-[56ch]">
            {service.intro}
          </p>

          {/* Technical Specifications HUD Bar */}
          <div className="pt-2">
            <ServiceSpecHUD
              technicalSpec={service.technicalSpec}
              timeline={service.timeline}
            />
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Button
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              size="lg"
              variant="primary"
            >
              Discuss this service
            </Button>
            <Button href="#deliverables" size="lg" variant="secondary">
              Review deliverables
            </Button>
          </div>
        </div>
      </div>

      {/* Phased Deliverables Section */}
      <Section id="deliverables" borderTop={true} className="py-16">
        <div className="space-y-10">
          <SectionHeading
            tag="Engineering Deliverables"
            title="Scope, architecture & production handover."
            lead={`Structured deliverables engineered for ${service.title.toLowerCase()}, from initial architecture to verified production sign-off.`}
          />

          <ServiceDeliverablesList
            phasedDeliverables={service.phasedDeliverables}
          />
        </div>
      </Section>

      {/* Technical Specifications & Standards Grid */}
      <Section id="specs" borderTop={true} className="py-16">
        <div className="space-y-10">
          <SectionHeading
            tag="Engineering Standards"
            title="Tooling, quality targets & asset ownership."
            lead="How we structure our development environment, maintainable dependencies, and client handover terms."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tooling Card */}
            <GlassCard tone="dark" className="space-y-4 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-accent-copper">
                <Terminal className="size-5" />
                <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                  Tooling & Frameworks
                </span>
              </div>
              <p className="text-mute text-xs sm:text-sm leading-relaxed">
                Capabilities and modern engineering frameworks selected according to project scope:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {service.technicalSpec.frameworks.map((fw, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded text-xs font-mono bg-white/[0.04] border border-line text-ink"
                  >
                    {fw}
                  </span>
                ))}
              </div>
            </GlassCard>

            {/* Quality Standards Card */}
            <GlassCard tone="dark" className="space-y-4 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-accent-copper">
                <Sparkles className="size-5" />
                <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                  Target Standards
                </span>
              </div>
              <p className="text-mute text-xs sm:text-sm leading-relaxed">
                Measurable engineering and accessibility benchmarks targeted for client engagements:
              </p>
              <ul className="space-y-2 pt-2 text-xs font-mono text-[#F2EFE8] list-none p-0 m-0">
                {service.technicalSpec.standards.map((std, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{std}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Ownership & Handover Card */}
            <GlassCard tone="dark" className="space-y-4 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-accent-copper">
                <Shield className="size-5" />
                <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                  Client Ownership
                </span>
              </div>
              <p className="text-mute text-xs sm:text-sm leading-relaxed">
                {service.technicalSpec.ownership}
              </p>
              <div className="pt-2 border-t border-line/50 text-[11px] font-mono text-mute">
                Deployment: {service.technicalSpec.deployment}
              </div>
            </GlassCard>
          </div>
        </div>
      </Section>

      {/* Business Value / Outcomes Section */}
      <Section id="outcomes" borderTop={true} className="py-16">
        <div className="space-y-10">
          <SectionHeading
            tag="Business Value"
            title="Measurable outcomes, zero hand-waving."
            lead="What changes for your business when this discipline is engineered properly."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.outcomes.map((outcome, i) => (
              <GlassCard key={i} tone="dark" className="space-y-3 p-6 sm:p-8">
                <span className="text-accent-copper font-mono text-xs uppercase tracking-wider">
                  Outcome 0{i + 1}
                </span>
                <p className="text-ink text-[1.05rem] font-light leading-relaxed">
                  {outcome}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>

      {/* Methodology / Working Process */}
      <Section id="process" borderTop={true} className="py-16">
        <div className="space-y-10">
          <SectionHeading
            tag="Methodology"
            title="How every engagement operates."
            lead="A disciplined four-stage engineering sequence ensuring complete alignment and transparency."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div
                key={step.number}
                className="border-t border-line pt-6 space-y-3"
              >
                <span className="text-accent-copper font-mono text-xs uppercase tracking-wider font-medium">
                  0{step.number}
                </span>
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

      {/* Frequently Asked Questions */}
      <Section id="faq" borderTop={true} className="py-16">
        <div className="max-w-[850px] space-y-10">
          <SectionHeading
            tag="Transparent Answers"
            title="Frequently asked questions."
            lead="Common inquiries regarding scope, revisions, performance targets, and handover."
          />

          <div className="divide-y divide-line border-y border-line">
            {service.faqs.map((faq, i) => (
              <details
                key={i}
                className="group py-6 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-copper rounded-sm"
              >
                <summary className="list-none flex items-center justify-between gap-4 font-serif text-[1.25rem] md:text-[1.4rem] font-light text-ink hover:text-accent-copper transition-colors">
                  <span>{faq.question}</span>
                  <span className="text-accent-copper font-sans text-xl transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-mute text-[0.98rem] leading-relaxed max-w-[65ch]">
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
              Not sure which service scope you need?
            </h3>
            <p className="text-mute text-[0.98rem] leading-relaxed max-w-[52ch]">
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

      {/* Next Service & Bottom CTA Navigation */}
      <Section borderTop={true} className="bg-veil-deep py-12">
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
            className="group flex items-center gap-3 text-left sm:text-right focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-copper rounded-sm"
          >
            <div>
              <span className="block text-xs font-mono uppercase tracking-wider text-mute">
                Next Service {nextService.number} / 06
              </span>
              <span className="font-serif text-[1.4rem] md:text-[1.6rem] font-light text-ink group-hover:text-accent-copper transition-colors">
                {nextService.title}
              </span>
            </div>
            <div className="size-10 rounded-full border border-line flex items-center justify-center text-mute group-hover:text-ink group-hover:border-accent-copper transition-colors">
              <ArrowRight className="size-4" />
            </div>
          </Link>
        </div>
      </Section>
    </div>
  );
}
