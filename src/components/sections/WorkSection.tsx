"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  FileCode2,
  ExternalLink,
  Layers,
  Code2,
  TrendingUp,
} from "lucide-react";

interface ProjectItem {
  id: string;
  category: "saas" | "ecommerce" | "landing";
  badgeText: string;
  title: string;
  client: string;
  tagline: string;
  decoded: string;
  built: string;
  evolved: string;
  metrics: { label: string; value: string }[];
  tech: string[];
}

const PORTFOLIO_PROJECTS: ProjectItem[] = [
  {
    id: "zenith-capital",
    category: "saas",
    badgeText: "SaaS MVP & Cockpit",
    title: "Zenith Capital Command",
    client: "Zenith Asset Management (London, UK)",
    tagline: "Ultra-low latency institutional portfolio risk command center",
    decoded:
      "Fund managers relied on fragmented terminals and slow spreadsheets. They required a secure digital cockpit to visualize real-time liquidity exposure across global markets without lag.",
    built:
      "Engineered an App Router Next.js 14 command dashboard with streaming WebSockets, optimistic UI updates, strict RBAC, and sub-150ms TTFB globally.",
    evolved:
      "Average daily trade evaluation time dropped from 18 minutes to 4.2 minutes. Successfully scaled to 500+ institutional desks with zero concurrency bottlenecks.",
    metrics: [
      { label: "TTFB Worldwide", value: "140ms" },
      { label: "Evaluation Time", value: "-76%" },
      { label: "Lighthouse", value: "99/100" },
    ],
    tech: ["Next.js 14", "TypeScript", "PostgreSQL", "Auth.js"],
  },
  {
    id: "aether-labs",
    category: "saas",
    badgeText: "Deep-Tech Web App",
    title: "Aether Genomic Intelligence",
    client: "Aether Biosystems (Zurich, Switzerland)",
    tagline: "Clinical query portal for 10M+ biological sequences and genetic variants",
    decoded:
      "Researchers struggled with traditional bioinformatics tables taking over 20 seconds to filter multi-gigabyte variant matrices.",
    built:
      "Built a client-side Web Worker filtering pipeline alongside a responsive frosted glass UI with Three.js 3D protein coordinate visualizers.",
    evolved:
      "Variant analysis speed accelerated by 320%. The platform secured Series A venture funding with CIPHER's production prototype as core technical proof.",
    metrics: [
      { label: "Filter Speed", value: "<0.3s" },
      { label: "Records", value: "10M+" },
      { label: "Mobile Score", value: "98/100" },
    ],
    tech: ["React", "TypeScript", "Three.js", "FastAPI"],
  },
  {
    id: "lumina-d2c",
    category: "ecommerce",
    badgeText: "Headless E-Commerce",
    title: "Lumina Architectural Flagship",
    client: "Lumina Lighting (Stockholm, Sweden)",
    tagline: "Minimalist direct-to-consumer store with custom 3D fixture configurator",
    decoded:
      "Lumina was losing 70% of mobile ad traffic due to a 4.2s load time on a bloated standard Shopify theme. Buyers couldn't preview fixtures to scale.",
    built:
      "Re-architected the store using Next.js on the frontend connected to Shopify Storefront GraphQL API, instant cart drawer persistence, and WebGL previews.",
    evolved:
      "Mobile conversion rate leaped by 42.4% within 30 days. Average cart abandonment dropped by 28% and checkout time was cut to 1.1s.",
    metrics: [
      { label: "Mobile CVR Lift", value: "+42.4%" },
      { label: "Load Time", value: "0.9s" },
      { label: "Cart Drop", value: "-28%" },
    ],
    tech: ["Next.js", "Shopify GraphQL", "Tailwind CSS"],
  },
  {
    id: "strata-cloud",
    category: "landing",
    badgeText: "High-Conversion Flagship",
    title: "Strata Cloud Intelligence",
    client: "Strata Infrastructure (Singapore)",
    tagline: "Zero-bloat product launch flagship with dynamic cost simulator",
    decoded:
      "Strata needed to convert enterprise CTOs who were skeptical of standard cloud marketing buzzwords. They needed transparent cost proofs and instant interactive telemetry.",
    built:
      "Designed a typographic flagship with a dynamic slider-based infrastructure cost calculator, animated 3D network topology, and instant lead routing.",
    evolved:
      "Generated 240+ qualified enterprise inbound leads in the first 60 days of launch with a 6.2% visitor-to-demo conversion rate.",
    metrics: [
      { label: "Inbound Leads", value: "240+" },
      { label: "CVR", value: "6.2%" },
      { label: "Lighthouse", value: "100/100" },
    ],
    tech: ["Next.js", "TypeScript", "Framer Motion", "Tailwind"],
  },
];

export function WorkSection() {
  const [activeStep, setActiveStep] = useState<"decode" | "build" | "evolve">("build");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "saas" | "ecommerce" | "landing">("all");

  const filteredProjects =
    selectedCategory === "all"
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <section id="work" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-ink/65 backdrop-blur-md">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-copper mb-3">
              <FileCode2 className="size-3.5" />
              <span>Proven Process &amp; Empirical Results</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-medium tracking-tight text-bone">
              How We Work. <br />
              <span className="text-slate-dark">A Documented Build from Discovery to Production.</span>
            </h2>
          </div>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button variant="glass" className="w-full sm:w-auto justify-center" rightIcon={<ArrowRight className="size-4" />}>
              Discuss Your Project
            </Button>
          </Link>
        </div>

        {/* FEATURED CASE STUDY: Apex Orthopedic Clinic */}
        <div className="p-6 sm:p-10 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-copper px-2.5 py-1 rounded bg-copper/10 border border-copper/30">
                FEATURED CASE STUDY IN PRACTICE
              </span>
              <h3 className="mt-3 text-2xl sm:text-3xl font-heading font-semibold text-bone">
                Apex Orthopedic &amp; Sports Medicine Practice
              </h3>
              <p className="mt-1 text-sm text-slate font-sans">
                Replacing an insecure legacy appointment flow with a hardened, sub-second patient booking engine.
              </p>
            </div>

            {/* Interactive Phase Selector */}
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/40 border border-white/10 self-start lg:self-auto">
              {(["decode", "build", "evolve"] as const).map((step) => (
                <button
                  key={step}
                  onClick={() => setActiveStep(step)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                    activeStep === step
                      ? "bg-copper text-ink font-semibold shadow-md shadow-copper/20"
                      : "text-slate hover:text-bone"
                  }`}
                >
                  {step.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Phase Content */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Architectural Narrative */}
            <div className="lg:col-span-7 space-y-4">
              {activeStep === "decode" && (
                <div>
                  <h4 className="text-lg font-heading font-medium text-bone">
                    Phase 01: Audit, Vulnerability Discovery &amp; Journey Mapping
                  </h4>
                  <p className="mt-2 text-sm text-slate leading-relaxed">
                    The practice was losing prospective patients to a 5.2s mobile load time on a bloated WordPress theme. An open appointment intake script lacked basic CSRF tokens and was exposed to automated form spam.
                  </p>
                  <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs font-mono">
                    <div className="text-rose-400 flex items-center gap-2">
                      <span>&bull; Critical:</span> Intake form submitted unencrypted over basic PHP mailer
                    </div>
                    <div className="text-rose-400 flex items-center gap-2">
                      <span>&bull; Performance:</span> Server TTFB: 1,640ms | Mobile FCP: 4.8s
                    </div>
                    <div className="text-slate flex items-center gap-2">
                      <span>&bull; Drop-off:</span> 62% of patients abandoned booking on mobile devices
                    </div>
                  </div>
                </div>
              )}

              {activeStep === "build" && (
                <div>
                  <h4 className="text-lg font-heading font-medium text-bone">
                    Phase 02: Hardened Next.js 14 Intake Pipeline &amp; UI System
                  </h4>
                  <p className="mt-2 text-sm text-slate leading-relaxed">
                    Engineered a bespoke Next.js App Router booking flow. Strict Content Security Policy (CSP), HTTP-only cookies, and encrypted form action handlers. Zero third-party tracker leakage.
                  </p>
                  <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs font-mono">
                    <div className="text-emerald-400 flex items-center gap-2">
                      <span>&bull; Security:</span> In-memory sliding window rate-limiting + XSS sanitization
                    </div>
                    <div className="text-emerald-400 flex items-center gap-2">
                      <span>&bull; Speed:</span> Static pre-rendering with Edge dynamic slots (TTFB: 110ms)
                    </div>
                    <div className="text-emerald-400 flex items-center gap-2">
                      <span>&bull; Accessibility:</span> Full keyboard tab-navigation &amp; WCAG AA contrast
                    </div>
                  </div>
                </div>
              )}

              {activeStep === "evolve" && (
                <div>
                  <h4 className="text-lg font-heading font-medium text-bone">
                    Phase 03: Post-Launch Conversion &amp; Monthly Evolution
                  </h4>
                  <p className="mt-2 text-sm text-slate leading-relaxed">
                    Monitored Core Web Vitals and patient completion funnels in production. Continuous telemetry updates under our monthly retainer.
                  </p>
                  <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs font-mono">
                    <div className="text-emerald-400 flex items-center gap-2">
                      <span>&bull; Conversions:</span> +54% completed patient bookings in first 60 days
                    </div>
                    <div className="text-emerald-400 flex items-center gap-2">
                      <span>&bull; Reliability:</span> Zero spam submissions | 100% uptime
                    </div>
                    <div className="text-copper flex items-center gap-2">
                      <span>&bull; Retainer:</span> Continuous monthly security scans &amp; speed tuning
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 5 Cols: Measured Proof Telemetry */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-ink border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono text-copper uppercase tracking-wider">
                  Verified Audit Delta
                </span>
                <span className="text-xs font-mono text-emerald-400">Production Tested</span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between items-center text-slate">
                  <span>Mobile Lighthouse</span>
                  <span className="text-emerald-400 font-semibold text-sm">99 / 100 (was 34)</span>
                </div>
                <div className="flex justify-between items-center text-slate">
                  <span>Server TTFB</span>
                  <span className="text-emerald-400 font-semibold text-sm">110ms (was 1,640ms)</span>
                </div>
                <div className="flex justify-between items-center text-slate">
                  <span>Largest Contentful Paint</span>
                  <span className="text-emerald-400 font-semibold text-sm">0.68s (was 5.2s)</span>
                </div>
                <div className="flex justify-between items-center text-slate">
                  <span>Security Grade</span>
                  <span className="text-emerald-400 font-semibold text-sm">Grade A+ (was Grade F)</span>
                </div>
                <div className="flex justify-between items-center text-slate">
                  <span>Cumulative Layout Shift</span>
                  <span className="text-emerald-400 font-semibold text-sm">0.000 CLS (Zero Shift)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COMPLETE PORTFOLIO ARCHIVE WITH CATEGORY TABS */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-copper">
                EXPANDED PROJECT ARCHIVE
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-semibold text-bone mt-1">
                Selected Enterprise &amp; Flagship Builds
              </h3>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10 self-start sm:self-auto">
              {(
                [
                  { id: "all", label: "All Works" },
                  { id: "saas", label: "SaaS & Tools" },
                  { id: "ecommerce", label: "E-Commerce" },
                  { id: "landing", label: "Flagships" },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                    selectedCategory === cat.id
                      ? "bg-copper text-ink font-semibold shadow-sm"
                      : "text-slate-dark hover:text-bone"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((item) => (
              <GlassCard
                key={item.id}
                tone="dark"
                className="p-6 sm:p-8 border border-white/10 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-copper px-2.5 py-1 rounded bg-copper/10 border border-copper/30">
                      {item.badgeText}
                    </span>
                    <span className="text-xs font-mono text-slate-dark truncate max-w-[180px]">
                      {item.client.split("(")[0]}
                    </span>
                  </div>

                  <h4 className="text-xl font-heading font-semibold text-bone">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
                    {item.tagline}
                  </p>

                  <div className="p-4 rounded-glass-sm bg-white/5 border border-white/5 space-y-2 text-xs">
                    <div className="text-bone/90">
                      <span className="text-copper font-mono">Decode: </span>
                      {item.decoded}
                    </div>
                    <div className="text-slate-dark pt-1">
                      <span className="text-copper font-mono">Evolve: </span>
                      {item.evolved}
                    </div>
                  </div>

                  {/* Verified Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                    {item.metrics.map((m, idx) => (
                      <div key={idx} className="p-2.5 rounded-glass-sm bg-white/5 border border-white/5">
                        <span className="text-xs font-heading font-semibold text-copper block">
                          {m.value}
                        </span>
                        <span className="text-[10px] font-mono text-slate-dark block truncate">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-dark flex-wrap">
                    {item.tech.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link href="/contact" className="text-copper hover:text-copper-hover flex items-center gap-1 transition-colors">
                    <span>Discuss Similar</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WorkSection;
