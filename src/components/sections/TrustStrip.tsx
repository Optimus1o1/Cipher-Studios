"use client";

import React from "react";
import { Zap, ShieldCheck, Clock, Award, Terminal } from "lucide-react";

const STATS = [
  {
    icon: <Zap className="size-4 text-copper" />,
    value: "<800ms",
    label: "Average TTFB Worldwide",
  },
  {
    icon: <Award className="size-4 text-copper" />,
    value: "100%",
    label: "On-Time Milestone Delivery",
  },
  {
    icon: <ShieldCheck className="size-4 text-copper" />,
    value: "95+",
    label: "Lighthouse Mobile Standard",
  },
  {
    icon: <Terminal className="size-4 text-copper" />,
    value: "Zero",
    label: "Vendor / Platform Lock-In",
  },
];

export function TrustStrip() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 border-y border-white/5 bg-ink/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="glass-dark p-3.5 sm:p-5 rounded-glass-sm flex flex-col items-start justify-center border border-white/10 hover-lift"
            >
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <span className="p-1 sm:p-1.5 rounded-full bg-white/5 border border-white/10 shrink-0">
                  {stat.icon}
                </span>
                <span className="text-lg sm:text-2xl font-heading font-semibold text-bone tabular-nums">
                  {stat.value}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-mono text-slate-dark tracking-wide leading-tight">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
