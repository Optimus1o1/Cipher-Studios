'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Shield, Zap, BarChart3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassCard } from '@/components/ui/glass/GlassCard';
import { StatCard } from '@/components/ui/glass/StatCard';
import { LunarTelemetryBadge } from '@/components/ui/LunarTelemetryBadge';
import { SelectedBuildsSection } from '@/components/portfolio/SelectedBuildsSection';
import { FounderSection } from '@/components/studio/FounderSection';
import { servicesData } from '@/data/services';
import { processSteps } from '@/data/process';
import { principlesData } from '@/data/principles';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-[100svh] flex items-center pt-24 sm:pt-28 pb-16 sm:pb-20 relative pointer-events-none"
      >
        <div className="max-w-content mx-auto px-5 sm:px-6 md:px-8 w-full pointer-events-none">
          <div className="max-w-[760px] space-y-5 sm:space-y-6 pointer-events-auto relative">
            {/* Mobile readability scrim to ensure high text contrast against background canvas */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 sm:-inset-6 rounded-3xl bg-bg/65 md:bg-transparent backdrop-blur-[3px] md:backdrop-blur-0 -z-10 pointer-events-none"
            />

            <div className="pb-1">
              <LunarTelemetryBadge />
            </div>

            <span className="inline-block text-accent text-[0.88rem] sm:text-[0.95rem] font-medium tracking-wide">
              Web design, development, SEO and marketing
            </span>

            <h1 className="font-serif font-light text-ink text-[2.4rem] sm:text-[3.6rem] md:text-[5.2rem] leading-[1.05] tracking-[-0.03em]">
              Websites that make your business easy to find and hard to forget.
            </h1>

            <p className="text-[#C0C6D8] md:text-mute text-[1.02rem] sm:text-[1.12rem] md:text-[1.22rem] leading-relaxed max-w-[54ch]">
              Moon Sanctum Labs is an independent engineering studio in Kolkata. We design and
              build fast, beautiful websites for business owners and startups,
              then bring in the search traffic and customers to fill them.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <Button href="/contact" size="lg" variant="primary">
                Start a project
              </Button>
              <Button
                href="/website-review?utm_source=msl-site&utm_medium=internal&utm_campaign=hero-button"
                size="lg"
                variant="secondary"
              >
                Free website review
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility & Glass UI Stat Highlights */}
      <section className="relative z-10 py-10 sm:py-12 border-t border-line bg-bg-surface/50 backdrop-blur-md pointer-events-auto">
        <div className="max-w-content mx-auto px-5 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              icon={<Zap className="size-5" />}
              label="Core Web Vitals"
              value="100"
              unit="Score"
              dots={{ filled: 5, total: 5 }}
            />
            <StatCard
              icon={<Shield className="size-5" />}
              label="Ownership Guarantee"
              value="100"
              unit="%"
              dots={{ filled: 5, total: 5 }}
            />
            <StatCard
              icon={<Sparkles className="size-5" />}
              label="Design & Build"
              value="2–4"
              unit="Weeks"
              dots={{ filled: 4, total: 5 }}
            />
            <StatCard
              icon={<BarChart3 className="size-5" />}
              label="Core Disciplines"
              value="6"
              unit="Services"
              dots={{ filled: 5, total: 5 }}
              href="/services"
            />
          </div>
        </div>
      </section>

      {/* Selected Studio Builds Band */}
      <SelectedBuildsSection />

      {/* Services Band */}
      <Section id="services" borderTop={true} className="pointer-events-auto">
        <SectionHeading
          tag="Our Services"
          title="Six services, one team, one standard."
          lead="Choose a single service or let us run the whole launch. Each one has its own page with scope, timeline and answers."
        />

        <div className="divide-y divide-line border-y border-line">
          {servicesData.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group grid grid-cols-1 md:grid-cols-[1fr_1.4fr_120px] gap-4 md:gap-8 items-center py-6 sm:py-8 transition-all duration-300 hover:pl-4 hover:bg-white/[0.02]"
            >
              <h3 className="font-serif text-ink text-[1.4rem] sm:text-[1.5rem] md:text-[2rem] font-light group-hover:text-accent transition-colors">
                {service.title}
              </h3>
              <p className="text-mute text-[0.92rem] sm:text-[0.98rem] leading-relaxed">
                {service.intro}
              </p>
              <div className="flex items-center gap-1.5 md:justify-end text-[0.88rem] sm:text-[0.92rem] text-mute group-hover:text-accent transition-colors">
                <span>View service</span>
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Founder & Studio Practice */}
      <FounderSection />

      {/* Process Section */}
      <Section id="process" borderTop={true} className="pointer-events-auto">
        <SectionHeading
          tag="How We Work"
          title="A calm, clear path from first call to launch."
          lead="We decode what your business actually needs, build it properly, and keep it evolving after launch."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {processSteps.map((step) => (
            <div
              key={step.number}
              className="border-t border-line pt-6 space-y-3"
            >
              <span className="text-accent text-[0.88rem] font-mono font-medium">
                0{step.number}
              </span>
              <h3 className="font-serif text-ink text-[1.35rem] sm:text-[1.5rem] font-light">
                {step.title}
              </h3>
              <p className="text-mute text-[0.92rem] sm:text-[0.96rem] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Principles Section */}
      <Section id="principles" borderTop={true} className="pointer-events-auto">
        <SectionHeading
          tag="Our Commitments"
          title="How we work, in three promises."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {principlesData.map((principle, index) => (
            <GlassCard
              key={index}
              tone="dark"
              interactive={true}
              className="space-y-4 p-6 sm:p-7"
            >
              <div className="size-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <CheckCircle2 className="size-5" />
              </div>
              <h3 className="font-serif text-ink text-[1.35rem] sm:text-[1.45rem] font-light">
                {principle.title}
              </h3>
              <p className="text-mute text-[0.92rem] sm:text-[0.96rem] leading-relaxed">
                {principle.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* CTA Band */}
      <Section id="contact-banner" borderTop={true} className="bg-veil-deep pointer-events-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div className="space-y-4">
            <span className="text-accent text-[0.88rem] sm:text-[0.92rem] uppercase tracking-wider font-medium">
              Start Your Project
            </span>
            <h2 className="font-serif font-light text-ink text-[2.1rem] sm:text-[2.4rem] md:text-[3.2rem] leading-tight max-w-[15ch]">
              Tell us about your project.
            </h2>
            <p className="text-mute text-[0.98rem] sm:text-[1.05rem] leading-relaxed max-w-[45ch]">
              Share a few details and we will reply within one working day with a
              clear review, transparent timeline, and next steps.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:justify-end">
            <Button href="/contact" size="lg" variant="primary">
              Send project details
            </Button>
            <Button href="/services" size="lg" variant="secondary">
              Browse services
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
