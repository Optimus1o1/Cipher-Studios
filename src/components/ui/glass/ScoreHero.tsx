"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, CheckCircle2 } from "lucide-react";

interface ScoreHeroProps {
  score: number;
  maxScore?: number;
  label: string;
  delta?: string;
  subtext?: string;
  className?: string;
}

export function ScoreHero({
  score,
  maxScore = 100,
  label,
  delta = "+4.2% this sprint",
  subtext = "Architecture benchmark exceeding standard web performance thresholds",
  className,
}: ScoreHeroProps) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

  return (
    <div
      className={cn(
        "glass-dark glass-noise p-6 sm:p-8 rounded-glass border border-glass-border relative overflow-hidden",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono tracking-wider uppercase text-slate-dark">
              {label}
            </span>
            {delta && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="size-3" />
                {delta}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2 font-heading">
            <span className="text-6xl sm:text-7xl font-semibold tracking-tight text-bone tabular-nums">
              {score}
            </span>
            <span className="text-lg font-normal text-slate-dark">
              / {maxScore}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-bone/80 bg-white/5 border border-white/10 px-3.5 py-2 rounded-full">
          <CheckCircle2 className="size-4 text-copper" />
          <span>Lighthouse & Core Web Vitals Pass</span>
        </div>
      </div>

      {/* Range Gauge */}
      <div className="mt-6">
        <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-copper/70 to-copper transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] font-mono text-slate-dark">
          <span>0 (Baseline)</span>
          <span>Target: 90+</span>
          <span className="text-bone">{maxScore} (Max)</span>
        </div>
      </div>

      {subtext && (
        <p className="mt-4 text-xs text-slate-dark leading-relaxed">
          {subtext}
        </p>
      )}
    </div>
  );
}
