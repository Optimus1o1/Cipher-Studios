'use client';

import React from 'react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { founderData } from '@/data/founder';
import { FounderPortrait } from './FounderPortrait';
import { PhilosophyGrid } from './PhilosophyGrid';
import { PrinciplesGrid } from './PrinciplesGrid';
import { Sparkles, Terminal, ArrowRight } from 'lucide-react';

export const FounderSection: React.FC = () => {
  return (
    <Section id="studio" borderTop={true} className="pointer-events-auto">
      {/* Primary Section Heading */}
      <SectionHeading
        tag="Founder & Studio Practice"
        title="Engineering discipline with a human face."
        lead="Independent product development, systems-level problem decomposition, and architectural rigor led by Aniket Nandi."
      />

      {/* Main Two-Column Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-20">
        {/* Left Column: Portrait & Telemetry (5 cols on lg) */}
        <div className="lg:col-span-5 w-full max-w-[440px] mx-auto lg:mx-0">
          <FounderPortrait
            portrait={founderData.portrait}
            name={founderData.name}
            role={founderData.role}
            studio={founderData.studio}
            location={founderData.location}
            timezone={founderData.timezone}
          />
        </div>

        {/* Right Column: Founder Narrative & Studio Lifecycle (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
          {/* Editorial Narrative */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-copper/30 bg-accent-copper/10 px-3 py-1 text-[0.72rem] font-mono tracking-wider text-accent-copper">
              <Terminal className="size-3.5" />
              <span>THE FOUNDER&apos;S NOTE</span>
            </div>

            <h3 className="font-serif text-[1.85rem] sm:text-[2.2rem] font-light leading-[1.15] text-ink tracking-tight">
              {founderData.headline}
            </h3>

            <p className="text-[1.02rem] leading-relaxed text-mute">
              {founderData.leadParagraph}
            </p>

            <p className="text-[0.98rem] leading-relaxed text-mute/90">
              {founderData.secondaryParagraph}
            </p>

            {/* Slogan Identity Callout */}
            <div className="pt-2">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-lg border border-line/60 bg-white/[0.02] px-4 py-2.5 font-mono text-[0.80rem]">
                <span className="text-ink font-medium">Moon Sanctum Labs</span>
                <span className="text-line">—</span>
                <span className="text-accent-copper italic font-normal tracking-wide">
                  {founderData.slogan}
                </span>
              </div>
            </div>
          </div>

          {/* 4-Stage Studio Lifecycle Compact Flow */}
          <div className="rounded-xl border border-line/50 bg-[#0B0D18]/40 p-5 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.70rem] uppercase tracking-wider text-mute">
                Studio Approach — The 4-Stage Lifecycle
              </span>
              <span className="font-mono text-[0.70rem] text-accent-copper">
                From Research to Handover
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {founderData.lifecycle.map((stage, idx) => (
                <div
                  key={stage.number}
                  className="rounded-lg border border-line/30 bg-white/[0.015] p-3 space-y-1.5 transition-colors hover:border-line/70"
                >
                  <div className="flex items-center justify-between text-[0.68rem] font-mono">
                    <span className="text-accent-copper font-medium">{stage.number}</span>
                    <span className="text-mute">{stage.timeframe}</span>
                  </div>
                  <h4 className="font-serif text-[0.95rem] font-light text-ink leading-snug">
                    {stage.title}
                  </h4>
                  <p className="text-[0.75rem] text-mute leading-normal">
                    {stage.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Section 1: Studio Philosophy (Decode. Build. Evolve.) */}
      <div className="mb-20 pt-8 border-t border-line/40">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="font-mono text-[0.72rem] tracking-wider text-accent-copper uppercase">
              01 — Core Philosophy
            </span>
            <h3 className="font-serif text-[1.8rem] sm:text-[2.2rem] font-light text-ink tracking-tight mt-1">
              Decode. Build. Evolve.
            </h3>
          </div>
          <p className="text-[0.90rem] text-mute max-w-[42ch]">
            How we think, evaluate decisions, and build durable software that outlasts design fads.
          </p>
        </div>

        <PhilosophyGrid pillars={founderData.philosophy} />
      </div>

      {/* Sub-Section 2: Four Engineering Principles */}
      <div className="pt-8 border-t border-line/40">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="font-mono text-[0.72rem] tracking-wider text-accent-copper uppercase">
              02 — Operating Standards
            </span>
            <h3 className="font-serif text-[1.8rem] sm:text-[2.2rem] font-light text-ink tracking-tight mt-1">
              Engineering principles & contractual transparency.
            </h3>
          </div>
          <p className="text-[0.90rem] text-mute max-w-[44ch]">
            Measurable engineering targets, accessible interfaces, and zero proprietary lock-in.
          </p>
        </div>

        <PrinciplesGrid principles={founderData.principles} />
      </div>
    </Section>
  );
};
