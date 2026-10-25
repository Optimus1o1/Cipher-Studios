'use client';

import React, { useEffect, useState } from 'react';
import { getLunarPhase, type LunarPhaseData } from '@/lib/lunar';

export function LunarTelemetryBadge() {
  const [lunar, setLunar] = useState<LunarPhaseData | null>(null);

  useEffect(() => {
    setLunar(getLunarPhase());
    const timer = setInterval(() => {
      setLunar(getLunarPhase());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!lunar) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-veil/60 border border-line/60 text-xs text-mute/80 font-mono">
        <span className="size-1.5 rounded-full bg-accent/60 animate-pulse" />
        <span>CALIBRATING LUNAR TELEMETRY...</span>
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-pill bg-veil/80 border border-line/80 backdrop-blur-md shadow-sm text-xs font-mono tracking-wide text-mute hover:border-accent/40 transition-colors"
      title={`Live NASA orbital coordinates: Day ${lunar.ageDays} of 29.53d synodic cycle`}
    >
      <span className="relative flex size-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
      </span>
      <span className="text-ink font-medium flex items-center gap-1.5">
        <span>{lunar.phaseSymbol}</span>
        <span>{lunar.phaseName.toUpperCase()}</span>
      </span>
      <span className="text-line">|</span>
      <span>{lunar.illumination}% ILLUMINATED</span>
      <span className="hidden sm:inline text-line">|</span>
      <span className="hidden sm:inline text-accent">DAY {lunar.ageDays}</span>
    </div>
  );
}
