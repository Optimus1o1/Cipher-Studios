'use client';

import React from 'react';
import Image from 'next/image';
import type { FounderData } from '@/data/founder';
import { cn } from '@/lib/utils';

interface FounderPortraitProps {
  portrait: FounderData['portrait'];
  name: string;
  role: string;
  studio: string;
  location: string;
  timezone: string;
  className?: string;
}

export const FounderPortrait: React.FC<FounderPortraitProps> = ({
  portrait,
  name,
  role,
  studio,
  location,
  timezone,
  className,
}) => {
  return (
    <div className={cn('relative flex flex-col', className)}>
      {/* Outer Studio Instrument Container */}
      <div className="group relative rounded-xl border border-line/60 bg-[#0B0D18]/80 p-2 sm:p-2.5 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-accent-copper/40">
        {/* Inner Framing with strict 3:4 aspect ratio */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#05060D]">
          {/* Authentic High-Res Portrait Asset */}
          <Image
            src={portrait.src}
            alt={portrait.alt}
            width={600}
            height={800}
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02] contrast-[1.04] brightness-[0.97]"
          />

          {/* Restrained dark vignette overlay for palette integration */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05060D] via-transparent to-black/20 opacity-80"
            aria-hidden="true"
          />

          {/* Subtle copper corner reticles */}
          <div
            className="pointer-events-none absolute top-2.5 left-2.5 size-3 border-t-2 border-l-2 border-accent-copper/80"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-2.5 right-2.5 size-3 border-t-2 border-r-2 border-accent-copper/80"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-12 left-2.5 size-3 border-b-2 border-l-2 border-accent-copper/80"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-12 right-2.5 size-3 border-b-2 border-r-2 border-accent-copper/80"
            aria-hidden="true"
          />

          {/* Lower Telemetry Strip */}
          <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between rounded bg-[#05060D]/85 px-3 py-1.5 backdrop-blur-md border border-line/40 text-[0.66rem] font-mono tracking-wider">
            <div className="flex items-center gap-1.5 text-mute min-w-0">
              <span className="text-accent-copper font-semibold shrink-0">{portrait.recordId}</span>
              <span className="shrink-0">·</span>
              <span className="text-ink truncate">{name.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium shrink-0 ml-2">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-emerald-400" />
              </span>
              <span className="text-[0.62rem]">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Caption & Location Card Below Frame */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 rounded-lg border border-line/40 bg-white/[0.015] px-3.5 sm:px-4 py-2.5 sm:py-3 font-mono text-[0.72rem] sm:text-[0.75rem] text-mute">
        <div className="min-w-0 truncate">
          <span className="text-ink font-medium">{name}</span>
          <span className="mx-1.5 text-line">/</span>
          <span>{role}</span>
        </div>
        <div className="text-left sm:text-right text-[0.68rem] sm:text-[0.70rem] text-mute shrink-0">
          <span>{location}</span>
          <span className="mx-1 text-accent-copper">·</span>
          <span>{timezone}</span>
        </div>
      </div>
    </div>
  );
};
