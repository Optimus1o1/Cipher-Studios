"use client";

import React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { Button } from "@/components/ui/Button";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  FolderGit2,
  FileText,
  Lock,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";

export function ClientPortalSection() {
  const PORTAL_FEATURES = [
    {
      icon: <Activity className="size-5 text-copper" />,
      title: "Live Sprint Burndown & Velocity",
      description:
        "Inspect commit-by-commit milestone progression, Sprint Health Index (SHI), and test suite pass rates in real time.",
    },
    {
      icon: <Terminal className="size-5 text-copper" />,
      title: "Isolated Staging Previews",
      description:
        "Direct access to daily branch deployments on isolated preview environments to review responsive features before production.",
    },
    {
      icon: <FileText className="size-5 text-copper" />,
      title: "Verified Deliverables & Escrow Invoices",
      description:
        "One-click downloads of technical architectural documentation, OpenAPI schemas, typed design tokens, and escrow invoices.",
    },
  ];

  return (
    <section id="portal" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-ink/60 backdrop-blur-md border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-copper">
            <Lock className="size-3.5" />
            <span>ENGINEERING TELEMETRY &amp; TRANSPARENCY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-semibold tracking-tight text-bone">
            Real-Time Client Cockpit.
          </h2>
          <p className="text-sm sm:text-base text-slate-dark leading-relaxed">
            Every active sprint is fully transparent. We replace slow agency bureaucracy with live engineering telemetry — inspect code velocity, preview staging builds, and manage milestone invoices in one place.
          </p>
        </div>

        {/* Central Glass Teaser Card */}
        <div className="mt-12">
          <GlassCard
            tone="dark"
            tilt={true}
            maxTilt={3}
            className="p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden"
          >
            {/* Top decorative badge row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-copper">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CLIENT WORKSPACE · SECURE ACCESS</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-semibold text-bone">
                  Sprint Telemetry, Deliverables &amp; Invoices
                </h3>
              </div>

              <Link href="/portal">
                <Button size="md" variant="primary" rightIcon={<ArrowRight className="size-4" />}>
                  Access Client Portal
                </Button>
              </Link>
            </div>

            {/* 3 Core Capability Bullets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {PORTAL_FEATURES.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 hover:border-copper/30 transition-colors"
                >
                  <div className="p-2.5 rounded-full bg-white/5 border border-white/10 w-fit">
                    {feature.icon}
                  </div>
                  <h4 className="text-base font-heading font-semibold text-bone">
                    {feature.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Telemetry Strip */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-slate-dark">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-copper shrink-0" />
                <span>98.4% On-Time Milestones</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-copper shrink-0" />
                <span>Real-Time WebSocket Stream</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-copper shrink-0" />
                <span>Strict PHI &amp; Data Hygiene</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-emerald-400 shrink-0" />
                <span>&lt; 2h Direct Engineer SLA</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

export default ClientPortalSection;
