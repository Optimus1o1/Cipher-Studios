'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import {
  Monitor,
  Code2,
  Search,
  Megaphone,
  PenTool,
  ShieldCheck,
} from 'lucide-react';
import { useOrbital } from '@/context/OrbitalContext';
import { SATELLITE_CONFIGS, SatelliteConfig } from '@/components/three/satellites/types';
import { FocusedServicePanel } from './FocusedServicePanel';
import { FloatingServiceLabels } from './FloatingServiceLabels';

// Icon map for the 6 services
const ICON_MAP: Record<SatelliteConfig['iconType'], React.ElementType> = {
  design: Monitor,
  dev: Code2,
  seo: Search,
  marketing: Megaphone,
  branding: PenTool,
  care: ShieldCheck,
};

export function OrbitalServicesHero() {
  const { selectedSlug, selectService } = useOrbital();
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={heroRef}
      className="relative w-full min-h-[580px] md:min-h-[680px] flex items-center justify-center overflow-hidden py-8 select-none pointer-events-none"
    >
      {/* Centered stage backdrop */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Subtle center ambient ring */}
        <div className="w-[340px] h-[340px] md:w-[480px] md:h-[480px] rounded-full border border-white/[0.04] animate-pulse duration-1000" />
      </div>

      {/* When a service is selected, display the Focused Details Panel */}
      {selectedSlug ? (
        <div className="relative z-20 w-full max-w-content mx-auto px-4 md:px-8 py-4 md:py-8 flex items-center justify-start pointer-events-auto">
          <FocusedServicePanel />
        </div>
      ) : (
        <>
          {/* Dynamic 60fps Floating Satellite Labels Anchor Engine */}
          <FloatingServiceLabels heroRef={heroRef} />

          {/* MOBILE & TABLET OVERVIEW MODE (<860px): Clear Stage + Touch Selector */}
          <div className="flex md:hidden flex-col w-full relative z-20 px-4 pt-4 pb-2 pointer-events-none">
            {/* Open stage height for 3D Moon and orbiting fleet */}
            <div className="h-[280px] sm:h-[340px] w-full" aria-hidden="true" />

            {/* Touch Orbital Fleet Control Deck (>=44x44px touch targets) */}
            <div className="pointer-events-auto w-full max-w-md mx-auto space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-mute">
                  Orbital Fleet (6 Services)
                </span>
                <span className="font-mono text-[10px] text-accent/80">
                  Tap to inspect
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SATELLITE_CONFIGS.map((config) => {
                  const Icon = ICON_MAP[config.iconType];
                  return (
                    <Link
                      key={config.slug}
                      href={config.route}
                      data-service-label={config.slug}
                      onClick={() => selectService(config.slug, true)}
                      className="flex items-center gap-2 p-2.5 min-h-[48px] rounded-xl bg-[#0b0f19]/85 backdrop-blur-md border border-white/10 hover:border-white/25 active:scale-[0.98] transition-all text-left group"
                      aria-label={`Inspect ${config.title} service`}
                    >
                      <span
                        className="p-1.5 rounded-lg border bg-white/5 border-white/10 text-mute shrink-0 group-hover:bg-white/10 transition-colors"
                        style={{ borderColor: `${config.accentColor}50` }}
                      >
                        <Icon className="size-3.5" style={{ color: config.accentColor }} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-mute">
                            {config.number}
                          </span>
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: config.accentColor }}
                          />
                        </div>
                        <p className="font-mono text-[11px] font-medium uppercase tracking-tight text-ink/90 group-hover:text-ink truncate mt-0.5">
                          {config.title}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Hint Indicator (Desktop only) */}
      {!selectedSlug && (
        <div className="hidden md:block absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none text-center">
          <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-mute/60">
            Click any satellite or label to view service details
          </p>
        </div>
      )}
    </div>
  );
}
