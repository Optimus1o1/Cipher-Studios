"use client";

import React, { useState } from "react";
import { BackgroundScene } from "@/components/ui/glass/BackgroundScene";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { StatCard } from "@/components/ui/glass/StatCard";
import { AccentCard } from "@/components/ui/glass/AccentCard";
import { ScoreHero } from "@/components/ui/glass/ScoreHero";
import { PillTabs } from "@/components/ui/glass/PillTabs";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
} from "lucide-react";

export default function StyleguidePage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <BackgroundScene intensity="normal" />

      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-copper">
            <Terminal className="size-3.5" />
            <span>DESIGN SYSTEM CATALOG &middot; CIPHER</span>
          </div>
          <h1 className="mt-3 text-4xl sm:text-5xl font-heading font-semibold text-bone">
            Tokens &amp; Component Primitives
          </h1>
          <p className="mt-2 text-sm text-slate-dark max-w-xl">
            Strict token definitions adhering to the Ink &middot; Bone &middot; Copper palette, Space Grotesk &amp; Manrope typography, and Glass UI specification.
          </p>
        </div>

        {/* Brand Lockups */}
        <section className="space-y-6">
          <h2 className="text-xl font-heading font-semibold text-bone border-b border-white/10 pb-3">
            01. Brand Mark &amp; Lockups
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <GlassCard tone="dark" className="p-6 flex flex-col items-center justify-center gap-4">
              <Logo size={44} tone="dark" withWordmark={true} />
              <span className="text-xs font-mono text-slate-dark">Primary Dark Lockup</span>
            </GlassCard>

            <GlassCard tone="dark" className="p-6 flex flex-col items-center justify-center gap-4">
              <Logo size={44} tone="dark" withWordmark={false} />
              <span className="text-xs font-mono text-slate-dark">Mark Only (3&times;3 Matrix C)</span>
            </GlassCard>

            <GlassCard tone="light" className="p-6 flex flex-col items-center justify-center gap-4">
              <Logo size={44} tone="light" withWordmark={true} />
              <span className="text-xs font-mono text-ink/70">Light Surface Lockup</span>
            </GlassCard>
          </div>
        </section>

        {/* Color Palette Tokens */}
        <section className="space-y-6">
          <h2 className="text-xl font-heading font-semibold text-bone border-b border-white/10 pb-3">
            02. Palette Tokens
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-dark p-5 rounded-glass-sm border border-white/10 space-y-3">
              <div className="h-16 rounded-md bg-[#0F1013] border border-white/20" />
              <div>
                <strong className="text-bone text-sm block">Ink (Base)</strong>
                <span className="text-xs font-mono text-slate-dark">#0F1013</span>
              </div>
            </div>

            <div className="glass-dark p-5 rounded-glass-sm border border-white/10 space-y-3">
              <div className="h-16 rounded-md bg-[#F2EFE8]" />
              <div>
                <strong className="text-bone text-sm block">Bone (Text)</strong>
                <span className="text-xs font-mono text-slate-dark">#F2EFE8</span>
              </div>
            </div>

            <div className="glass-dark p-5 rounded-glass-sm border border-white/10 space-y-3">
              <div className="h-16 rounded-md bg-[#E0A45C]" />
              <div>
                <strong className="text-bone text-sm block">Copper (Accent)</strong>
                <span className="text-xs font-mono text-slate-dark">#E0A45C</span>
              </div>
            </div>

            <div className="glass-dark p-5 rounded-glass-sm border border-white/10 space-y-3">
              <div className="h-16 rounded-md bg-[#8B9099]" />
              <div>
                <strong className="text-bone text-sm block">Slate (Secondary)</strong>
                <span className="text-xs font-mono text-slate-dark">#8B9099</span>
              </div>
            </div>
          </div>
        </section>

        {/* Glass Cards */}
        <section className="space-y-6">
          <h2 className="text-xl font-heading font-semibold text-bone border-b border-white/10 pb-3">
            03. Glass Cards &amp; Anatomy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="Standard StatCard"
              value="99.4"
              unit="%"
              icon={<Activity className="size-5" />}
              status="ok"
              dots={{ filled: 4, total: 5 }}
            />

            <AccentCard
              label="Flagship AccentCard"
              badge="ACCENT"
              value="01"
              unit="Accent Only"
              subtext="Saturated copper gradient highlight card."
              icon={<Sparkles className="size-5 text-copper" />}
              ring={95}
            />

            <GlassCard tone="dark" className="p-7 space-y-3">
              <span className="text-xs font-mono text-copper uppercase">Standard GlassCard</span>
              <h4 className="text-xl font-heading font-semibold text-bone">
                Specular Highlights
              </h4>
              <p className="text-xs text-slate-dark leading-relaxed">
                Layered frosted glass with `backdrop-filter: blur(18px)` and inner specular highlight `inset 0 1px 0 rgba(255,255,255,0.12)`.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* ScoreHero & Gauge */}
        <section className="space-y-6">
          <h2 className="text-xl font-heading font-semibold text-bone border-b border-white/10 pb-3">
            04. ScoreHero Gauge
          </h2>
          <ScoreHero
            score={98}
            maxScore={100}
            label="LIGHTHOUSE BENCHMARK"
            delta="+3.8% delta"
            subtext="Production grade performance threshold with smooth CSS range gauge."
          />
        </section>

        {/* Buttons & Controls */}
        <section className="space-y-6">
          <h2 className="text-xl font-heading font-semibold text-bone border-b border-white/10 pb-3">
            05. Interactive Controls &amp; Buttons
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary" rightIcon={<ArrowRight className="size-4" />}>
              Primary Copper
            </Button>
            <Button variant="glass">
              Glass Card
            </Button>
            <Button variant="secondary">
              Secondary Surface
            </Button>
            <Button variant="ghost">
              Ghost Button
            </Button>
            <Button variant="accent">
              Accent Gradient
            </Button>
            <Button variant="primary" isLoading={true}>
              Loading State
            </Button>
          </div>

          <div className="pt-4">
            <PillTabs
              tabs={[
                { id: "all", label: "All Items" },
                { id: "saas", label: "SaaS MVPs", badge: 3 },
                { id: "web", label: "Web Apps" },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
