"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BackgroundScene } from "@/components/ui/glass/BackgroundScene";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { PillTabs } from "@/components/ui/glass/PillTabs";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, CheckCircle2, Code2, ExternalLink } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Projects", badge: 4 },
  { id: "saas", label: "SaaS & Tools", badge: 2 },
  { id: "ecommerce", label: "E-Commerce", badge: 1 },
  { id: "landing", label: "Digital Flagships", badge: 1 },
];

const CASE_STUDIES = [
  {
    id: "zenith-capital",
    category: "saas",
    badgeText: "SaaS MVP & Dashboard",
    title: "Zenith Capital Command",
    client: "Zenith Asset Management (London, UK)",
    tagline: "Ultra-low latency institutional portfolio risk command center",
    decoded:
      "Zenith's fund managers relied on fragmented terminal displays and slow spreadsheets. They needed a single, secure digital cockpit to visualize real-time liquidity exposure across multiple global markets without client-side lag.",
    built:
      "Engineered an App Router Next.js 14 command dashboard with streaming WebSockets, optimistic UI updates, and an Ink/Bone glass theme. Enforced strict RBAC, data encryption, and sub-150ms TTFB globally.",
    evolved:
      "Average daily trade evaluation time dropped from 18 minutes to 4.2 minutes. The platform successfully scaled to 500+ active institutional desks without a single concurrency bottleneck.",
    metrics: [
      { label: "TTFB Worldwide", value: "140ms" },
      { label: "Latency", value: "<80ms" },
      { label: "Trader NPS", value: "+78" },
      { label: "Lighthouse", value: "99/100" },
    ],
    tech: ["Next.js 14", "TypeScript", "PostgreSQL", "Tailwind CSS", "Auth.js"],
  },
  {
    id: "aether-labs",
    category: "saas",
    badgeText: "Deep-Tech Web App",
    title: "Aether Genomic Intelligence",
    client: "Aether Biosystems (Zurich, Switzerland)",
    tagline: "Clinical query portal for 10M+ biological sequences and genetic variants",
    decoded:
      "Aether's researchers struggled with standard bioinformatics tables that took over 20 seconds to filter multi-gigabyte genomic variant matrices.",
    built:
      "Built a client-side Web Worker filtering pipeline alongside a responsive frosted glass UI. Rendered 3D protein structures using Three.js with strict hardware tier detection for mobile devices.",
    evolved:
      "Search and variant analysis speed accelerated by 320%. The platform secured Series A venture funding with CIPHER's production prototype as the core technical proof.",
    metrics: [
      { label: "Filter Speed", value: "<0.3s" },
      { label: "Records", value: "10M+" },
      { label: "Mobile Score", value: "98/100" },
      { label: "Uptime", value: "99.99%" },
    ],
    tech: ["React", "TypeScript", "Three.js", "FastAPI", "Tailwind"],
  },
  {
    id: "lumina-d2c",
    category: "ecommerce",
    badgeText: "Headless E-Commerce",
    title: "Lumina Architectural Flagship",
    client: "Lumina Lighting (Stockholm, Sweden)",
    tagline: "Minimalist direct-to-consumer store with custom 3D lamp configurator",
    decoded:
      "Lumina was losing 70% of their mobile ad traffic due to a 4.2-second load time on a bloated standard Shopify theme. High-end buyers couldn't preview fixtures in scale.",
    built:
      "Re-architected the store using Next.js on the frontend connected to Shopify Storefront GraphQL API. Implemented instant page transitions, client-side cart persistence, and lightweight 3D previews.",
    evolved:
      "Mobile conversion rate leaped by 42.4% within 30 days. Average cart abandonment dropped by 28% and checkout time was cut to 1.1 seconds.",
    metrics: [
      { label: "Mobile CVR Lift", value: "+42.4%" },
      { label: "Load Time", value: "0.9s" },
      { label: "Cart Drop", value: "-28%" },
      { label: "Checkout", value: "1.1s" },
    ],
    tech: ["Next.js", "Shopify GraphQL", "Tailwind CSS", "Framer Motion"],
  },
  {
    id: "strata-cloud",
    category: "landing",
    badgeText: "High-Conversion Flagship",
    title: "Strata Cloud Intelligence",
    client: "Strata Infrastructure (Singapore)",
    tagline: "Zero-bloat product launch site with interactive cost simulator",
    decoded:
      "Strata needed to convert enterprise CTOs who were skeptical of standard cloud marketing jargon. They needed transparent cost proofs and instant interactive telemetry.",
    built:
      "Designed a Space Grotesk typographic landing flagship with a dynamic slider-based infrastructure cost calculator, animated 3D network topology, and instant lead routing.",
    evolved:
      "Generated 240+ qualified enterprise inbound leads in the first 60 days of launch with a 6.2% visitor-to-demo conversion rate.",
    metrics: [
      { label: "Inbound Leads", value: "240+" },
      { label: "Conversion Rate", value: "6.2%" },
      { label: "First Paint", value: "0.4s" },
      { label: "Lighthouse", value: "100/100" },
    ],
    tech: ["Next.js", "TypeScript", "Tailwind", "PostHog", "Resend"],
  },
];

export default function WorkPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = CASE_STUDIES.filter((c) =>
    activeTab === "all" ? true : c.category === activeTab
  );

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <BackgroundScene intensity="normal" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-copper uppercase tracking-widest">
              CASE ARCHIVES
            </span>
            <h1 className="mt-4 text-4xl sm:text-6xl font-heading font-semibold text-bone tracking-tight leading-[1.1]">
              Proof in Production. <br />
              <span className="text-slate-dark">Real Code. Measured Growth.</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-dark max-w-xl">
              Every case study below follows our three-act discipline: Decode the business bottleneck, Build the solution properly, and Evolve the metric.
            </p>
          </div>

          <div>
            <PillTabs
              tabs={CATEGORIES}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="mt-12 space-y-12">
          {filtered.map((study) => (
            <GlassCard
              key={study.id}
              id={study.id}
              tone="dark"
              className="p-5 sm:p-10 md:p-12 border border-white/15"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-copper bg-copper/10 px-3 py-1 rounded-full border border-copper/25">
                    {study.badgeText}
                  </span>
                  <h2 className="mt-3 text-2xl sm:text-4xl font-heading font-semibold text-bone">
                    {study.title}
                  </h2>
                  <p className="text-xs font-mono text-slate-dark mt-1">
                    {study.client}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {study.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono text-bone/70 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Three Acts Narrative */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-5 rounded-glass-sm bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-slate-dark" />
                    <span className="text-xs font-mono uppercase tracking-wider text-bone font-medium">
                      01 &middot; DECODED
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
                    {study.decoded}
                  </p>
                </div>

                <div className="p-5 rounded-glass-sm bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-copper" />
                    <span className="text-xs font-mono uppercase tracking-wider text-copper font-medium">
                      02 &middot; BUILT
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
                    {study.built}
                  </p>
                </div>

                <div className="p-5 rounded-glass-sm bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-medium">
                      03 &middot; EVOLVED
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
                    {study.evolved}
                  </p>
                </div>
              </div>

              {/* Outcomes Telemetry */}
              <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {study.metrics.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-glass-sm bg-white/5 text-center">
                    <div className="text-2xl sm:text-3xl font-heading font-semibold text-bone tabular-nums">
                      {m.value}
                    </div>
                    <div className="text-[11px] font-mono text-slate-dark uppercase mt-1">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
