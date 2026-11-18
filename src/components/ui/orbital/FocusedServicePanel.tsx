'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, X, Clock, Shield, CheckCircle2 } from 'lucide-react';
import { useOrbital } from '@/context/OrbitalContext';
import { SATELLITE_CONFIGS } from '@/components/three/satellites/types';
import { servicesData } from '@/data/services';

export function FocusedServicePanel() {
  const { selectedSlug, selectService } = useOrbital();

  if (!selectedSlug) return null;

  const config = SATELLITE_CONFIGS.find((s) => s.slug === selectedSlug);
  const serviceDetail = servicesData.find((s) => s.slug === selectedSlug);

  if (!config) return null;

  return (
    <div className="relative z-30 w-full max-w-lg mx-auto md:mx-0 animate-in fade-in zoom-in-95 duration-300 px-2 sm:px-0">
      <div className="bg-[#0b0f19]/95 backdrop-blur-xl border border-white/12 rounded-2xl p-5 sm:p-7 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative overflow-hidden">
        {/* Subtle accent corner glow */}
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none"
          style={{ background: config.accentColor }}
        />

        {/* Top bar with number and close button */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: config.accentColor }}
            />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-mute">
              Orbital Instrument {config.number} / 06
            </span>
          </div>

          <button
            onClick={() => selectService(null)}
            className="p-1.5 rounded-full text-mute hover:text-ink hover:bg-white/10 transition-colors"
            aria-label="Close focused service view"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Title & Tagline */}
        <h2 className="font-serif font-light text-[1.65rem] sm:text-[2rem] md:text-[2.4rem] text-ink leading-tight mb-1.5">
          {config.title}
        </h2>
        <p className="text-accent-copper text-xs sm:text-sm font-medium tracking-wide mb-3.5">
          {serviceDetail?.tagline || config.tagline}
        </p>

        {/* Concise Description */}
        <p className="text-mute text-xs sm:text-sm md:text-[0.95rem] leading-relaxed mb-4">
          {serviceDetail?.intro || config.description}
        </p>

        {/* Key Deliverables Highlights */}
        {serviceDetail?.keyDeliverables && (
          <div className="space-y-1.5 mb-5 py-2.5 px-3 rounded-xl bg-white/[0.02] border border-line/40">
            <span className="font-mono text-[10px] uppercase tracking-wider text-accent-copper font-medium block">
              Core Deliverables Preview
            </span>
            <ul className="space-y-1 text-xs text-ink/90 list-none p-0 m-0">
              {serviceDetail.keyDeliverables.slice(0, 2).map((deliv, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="size-3.5 text-accent-copper shrink-0 mt-0.5" />
                  <span className="truncate">{deliv}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Service Metadata preview */}
        {serviceDetail && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-3 px-3.5 rounded-xl bg-white/5 border border-white/8 mb-5 text-xs text-mute">
            <div className="flex items-center gap-2">
              <Clock className="size-3.5 text-accent-copper shrink-0" />
              <span className="truncate">
                <strong className="text-ink font-normal">Timeline:</strong>{' '}
                {serviceDetail.timeline}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="size-3.5 text-accent-copper shrink-0" />
              <span className="truncate">
                <strong className="text-ink font-normal">Ownership:</strong> Defined in Agreement
              </span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
          <Link
            href={`/services/${config.slug}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-accent-copper text-bg font-medium text-xs sm:text-sm hover:brightness-110 transition-all"
          >
            <span>Explore full scope & FAQs</span>
            <ArrowRight className="size-4" />
          </Link>

          <button
            onClick={() => selectService(null)}
            className="px-4 py-2.5 rounded-full border border-white/15 text-mute hover:text-ink text-xs sm:text-sm font-medium transition-colors text-center"
          >
            Back to orbit overview
          </button>
        </div>
      </div>
    </div>
  );
}
