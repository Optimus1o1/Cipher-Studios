"use client";

import React, { useState } from "react";
import { useScrollBridge } from "@/hooks/useScrollBridge";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { ArrowRight, CheckCircle2, Cpu, RefreshCw, Layers, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ProcessAct } from "@/types";

interface ActData {
  act: string;
  sloganWord: string;
  title: string;
  shortDesc: string;
  tagline: string;
  bullets: string[];
  icon: React.ReactNode;
}

const ACT_CONTENT: Record<ProcessAct, ActData> = {
  decode: {
    act: "01",
    sloganWord: "Decode.",
    title: "Rigorous Discovery & Architecture",
    shortDesc: "Deconstruct business requirements beneath the client brief before any code.",
    tagline: "Uncovering the business requirement beneath the request",
    bullets: [
      "Deep discovery into unit economics, user funnels, and true business objectives",
      "Deconstructing conversion bottlenecks and mapping friction-free user journeys",
      "Technical architecture audit: schema design, API boundaries, and scalability models",
    ],
    icon: <Cpu className="size-5 text-copper" />,
  },
  build: {
    act: "02",
    sloganWord: "Build.",
    title: "High-Performance Engineering",
    shortDesc: "Bespoke full-stack execution with zero bloat, technical debt, or template baggage.",
    tagline: "Engineered without shortcuts, bloated templates, or technical debt",
    bullets: [
      "Next.js App Router, strict TypeScript, Tailwind design tokens, and modular server actions",
      "Sub-second page speeds with optimal First Contentful Paint and zero layout shifts (CLS)",
      "Lighthouse 95+ score floor on mobile and strict WCAG AA contrast compliance",
    ],
    icon: <CheckCircle2 className="size-5 text-copper" />,
  },
  evolve: {
    act: "03",
    sloganWord: "Evolve.",
    title: "Post-Launch Growth & Tuning",
    shortDesc: "Continuous telemetry, conversion rate optimization, and systematic updates.",
    tagline: "Launch is day zero. We monitor, iterate, and compound revenue",
    bullets: [
      "Automated CI/CD pipelines with zero-downtime releases and regression testing",
      "Real-user analytics tracking (PostHog / GA4) with conversion funnel intelligence",
      "Dedicated evolution retainers: speed tuning, feature iterations, and proactive maintenance",
    ],
    icon: <RefreshCw className="size-5 text-copper" />,
  },
};

const ACT_KEYS: ProcessAct[] = ["decode", "build", "evolve"];

export function ScrollGridSection() {
  const [activeAct, setActiveActLocal] = useState<ProcessAct>("decode");
  const setActiveActBridge = useScrollBridge((state) => state.setActiveAct);

  const handleActSelect = (actKey: ProcessAct) => {
    setActiveActLocal(actKey);
    setActiveActBridge(actKey);
  };

  const handleNextAct = () => {
    const currentIndex = ACT_KEYS.indexOf(activeAct);
    const nextIndex = (currentIndex + 1) % ACT_KEYS.length;
    handleActSelect(ACT_KEYS[nextIndex]);
  };

  const current = ACT_CONTENT[activeAct];

  return (
    <section
      id="process"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-ink/40 backdrop-blur-sm border-t border-white/5"
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start relative z-10">
        {/* Left column: Process narrative & Interactive 3-Phase Stepper */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-copper/10 border border-copper/20 text-xs font-mono text-copper tracking-wide">
            <Layers className="size-3.5 text-copper" />
            <span>Engineering Discipline</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium tracking-tight text-bone">
            The Three Laws of <span className="text-copper">CIPHER</span>.
          </h2>

          <p className="text-sm sm:text-base text-slate-dark leading-relaxed">
            Every product we touch moves through an uncompromising three-phase discipline:{" "}
            <span className="text-bone font-medium">Decode.</span>{" "}
            <span className="text-bone font-medium">Build.</span>{" "}
            <span className="text-bone font-medium">Evolve.</span> We don’t guess, we don’t over-engineer, and we never abandon a launch.
          </p>

          {/* Interactive Stepper Navigation */}
          <div className="space-y-3 pt-2">
            {ACT_KEYS.map((actKey) => {
              const item = ACT_CONTENT[actKey];
              const isActive = activeAct === actKey;

              return (
                <button
                  key={actKey}
                  onClick={() => handleActSelect(actKey)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group ${
                    isActive
                      ? "bg-white/[0.07] border-copper/60 shadow-lg shadow-copper/10 ring-1 ring-copper/30"
                      : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                  aria-pressed={isActive}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      className={`text-xs font-mono font-bold tracking-wider px-2 py-1 rounded transition-colors ${
                        isActive
                          ? "bg-copper text-ink"
                          : "bg-white/5 text-slate-dark group-hover:text-bone"
                      }`}
                    >
                      {item.act}
                    </span>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-heading font-semibold text-base transition-colors ${
                            isActive ? "text-copper" : "text-bone group-hover:text-white"
                          }`}
                        >
                          {item.sloganWord}
                        </span>
                        <span className="text-xs text-slate-dark font-sans hidden sm:inline">
                          — {item.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-dark line-clamp-1 mt-0.5">
                        {item.shortDesc}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`size-4 shrink-0 transition-transform duration-200 ${
                      isActive
                        ? "text-copper translate-x-1"
                        : "text-white/20 group-hover:text-white/50"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Elevated Active Phase Card */}
        <div className="lg:col-span-7">
          <GlassCard
            tone={activeAct === "evolve" ? "accent" : "dark"}
            className="p-8 sm:p-10 border border-white/15 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
          >
            <div
              key={activeAct}
              className="space-y-6 animate-fadeIn"
            >
                {/* Header with Icon, Slogan Word, and Watermark Counter */}
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <div className="flex items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-xl bg-copper/10 border border-copper/30 shadow-inner">
                      {current.icon}
                    </span>
                    <div>
                      <span className="text-xs font-mono text-copper uppercase tracking-widest">
                        Phase {current.act} of 03
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-heading font-semibold text-bone">
                        {current.sloganWord}
                      </h3>
                    </div>
                  </div>
                  <span className="text-4xl sm:text-5xl font-heading font-light text-white/15 select-none">
                    {current.act}/03
                  </span>
                </div>

                {/* Main Slogan Tagline */}
                <div>
                  <h4 className="text-lg sm:text-xl font-heading font-medium text-bone">
                    {current.title}
                  </h4>
                  <p className="mt-1 text-sm sm:text-base text-bone/80 font-sans leading-relaxed">
                    {current.tagline}
                  </p>
                </div>

                {/* Deliverables List */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-dark">
                    What We Deliver in This Phase
                  </span>
                  <ul className="space-y-3">
                    {current.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-dark">
                        <span className="size-2 rounded-full bg-copper mt-1.5 shrink-0 shadow-sm shadow-copper/50" />
                        <span className="text-bone/90 leading-normal">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Bar */}
                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <button
                    onClick={handleNextAct}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-dark hover:text-copper transition-colors py-2"
                  >
                    <span>Next Phase</span>
                    <ChevronRight className="size-3.5 text-copper" />
                  </button>

                  <div className="flex items-center gap-3">
                    <Link href="/contact">
                      <Button size="sm" variant="primary" rightIcon={<ArrowRight className="size-3.5" />}>
                        Start Discovery
                      </Button>
                    </Link>
                  </div>
                </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
export default ScrollGridSection;
