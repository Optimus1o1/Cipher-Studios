"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { Button } from "@/components/ui/Button";
import {
  Code2,
  Compass,
  Cpu,
  Globe,
  ShieldCheck,
  Terminal,
  Zap,
  ArrowRight,
} from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-copper mb-3">
              <Compass className="size-3.5" />
              <span>Studio Philosophy &amp; Credentials</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-medium tracking-tight text-bone">
              Decode. Build. Evolve. <br />
              <span className="text-slate-dark">The Name is the Promise.</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate font-sans leading-relaxed">
              CIPHER is a web design and full-stack engineering studio operated by Aniket Nandi from Kolkata, India. We build high-speed websites, SaaS MVPs, and complex web applications for founders and global businesses who care about performance, design rigor, and business outcomes.
            </p>
          </div>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto justify-center" rightIcon={<ArrowRight className="size-4" />}>
              Start a Conversation
            </Button>
          </Link>
        </div>

        {/* The Three Principles */}
        <GlassCard tone="dark" className="p-6 sm:p-10 md:p-12 border border-white/15">
          <div className="flex items-center gap-3 mb-6">
            <Logo size={24} tone="dark" withWordmark={false} />
            <h3 className="text-xl sm:text-2xl font-heading font-semibold text-bone">
              Why We Say <span className="text-copper">Decode. Build. Evolve.</span>
            </h3>
          </div>
          <p className="text-sm sm:text-base text-slate-dark leading-relaxed max-w-3xl">
            Most clients come to us after being burned by traditional agencies—handed bloated WordPress setups packed with 40 plugins, fragile no-code platforms that break on minor updates, or undocumented codebases with massive technical debt. We operate under three non-negotiable principles:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="p-6 rounded-glass-sm bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-copper tracking-wider font-semibold">01</span>
                <Cpu className="size-4 text-copper" />
              </div>
              <h4 className="font-heading font-semibold text-bone text-lg">Decode.</h4>
              <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
                We uncover what your business actually needs before a single line of code is written. We clarify unit economics, conversion journeys, security boundaries, and architectural constraints.
              </p>
            </div>

            <div className="p-6 rounded-glass-sm bg-white/5 border border-copper/30 bg-copper/[0.03] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-copper tracking-wider font-semibold">02</span>
                <Code2 className="size-4 text-copper" />
              </div>
              <h4 className="font-heading font-semibold text-bone text-lg">Build.</h4>
              <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
                We build properly using clean Next.js App Router, strict TypeScript, and modular design tokens. Zero lorem ipsum, sub-second speeds, and WCAG AA contrast standard.
              </p>
            </div>

            <div className="p-6 rounded-glass-sm bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-copper tracking-wider font-semibold">03</span>
                <Zap className="size-4 text-copper" />
              </div>
              <h4 className="font-heading font-semibold text-bone text-lg">Evolve.</h4>
              <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
                Launch day is not the finish line. We monitor real-user telemetry, optimize conversion funnels proactively, and provide continuous engineering support as your product scales.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Engineering Floor Standards */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-copper">
            <ShieldCheck className="size-3.5" />
            <span>Strict Technical Standards</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-heading font-medium tracking-tight text-bone">
            Our Engineering Floor.
          </h3>
          <p className="text-sm sm:text-base text-slate-dark max-w-2xl">
            We don’t treat speed, security, and accessibility as optional add-ons. They are baked into our linting rules, deployment gates, and acceptance criteria.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <GlassCard tone="dark" className="p-6 border border-white/10 space-y-3">
              <div className="p-2.5 w-fit rounded-full bg-copper/10 border border-copper/25 text-copper">
                <Zap className="size-4" />
              </div>
              <h4 className="font-heading font-semibold text-bone text-base">
                Lighthouse &ge; 90 on Mobile
              </h4>
              <p className="text-xs text-slate-dark leading-relaxed">
                Tested under throttled mobile conditions. If a page doesn&apos;t load in sub-second time, it doesn&apos;t ship.
              </p>
            </GlassCard>

            <GlassCard tone="dark" className="p-6 border border-white/10 space-y-3">
              <div className="p-2.5 w-fit rounded-full bg-copper/10 border border-copper/25 text-copper">
                <ShieldCheck className="size-4" />
              </div>
              <h4 className="font-heading font-semibold text-bone text-base">
                WCAG AA Accessibility
              </h4>
              <p className="text-xs text-slate-dark leading-relaxed">
                Visible focus rings, screen reader labels, high contrast ratios, and complete `prefers-reduced-motion` compliance.
              </p>
            </GlassCard>

            <GlassCard tone="dark" className="p-6 border border-white/10 space-y-3">
              <div className="p-2.5 w-fit rounded-full bg-copper/10 border border-copper/25 text-copper">
                <Terminal className="size-4" />
              </div>
              <h4 className="font-heading font-semibold text-bone text-base">
                Strict Type Safety
              </h4>
              <p className="text-xs text-slate-dark leading-relaxed">
                TypeScript with zero `any` shortcuts. Shared Zod validation across frontend and backend boundaries.
              </p>
            </GlassCard>

            <GlassCard tone="dark" className="p-6 border border-white/10 space-y-3">
              <div className="p-2.5 w-fit rounded-full bg-copper/10 border border-copper/25 text-copper">
                <Globe className="size-4" />
              </div>
              <h4 className="font-heading font-semibold text-bone text-base">
                Full Client Ownership
              </h4>
              <p className="text-xs text-slate-dark leading-relaxed">
                No agency proprietary lock-in. You own the repository, domain, hosting, and every line of production code.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* Founder & Lead Engineer Profile Card */}
        <GlassCard tone="accent" className="p-6 sm:p-10 md:p-12 border border-copper/40 shadow-copper-glow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-copper font-semibold">
                FOUNDER &amp; LEAD ENGINEER
              </span>
              <h3 className="text-2xl sm:text-4xl font-heading font-semibold text-bone">
                Aniket Nandi
              </h3>
              <p className="text-xs font-mono text-copper">
                Kolkata, India &middot; IST (UTC+5:30)
              </p>
              <p className="mt-4 text-xs sm:text-sm text-bone/80 max-w-xl leading-relaxed">
                Leading full-stack engineering, 3D spatial interface design, and client engagements at CIPHER. Directly architecting every client system from initial discovery sprint to production hardening and monthly evolution retainers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full sm:w-auto justify-center" rightIcon={<ArrowRight className="size-4" />}>
                  Initiate Direct Inquiry
                </Button>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

export default AboutSection;
