'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock, CheckCircle2, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass/GlassCard';
import { Button } from '@/components/ui/Button';
import { servicesData } from '@/data/services';
import { useOrbital } from '@/context/OrbitalContext';
import { cn } from '@/lib/utils';

export function ServicesGrid() {
  const { selectedSlug, selectService } = useOrbital();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {servicesData.map((service, index) => {
        const isSelected = selectedSlug === service.slug;

        return (
          <GlassCard
            key={service.slug}
            tone="dark"
            interactive={true}
            className={cn(
              'flex flex-col justify-between p-6 sm:p-8 md:p-10 transition-all duration-300 relative',
              isSelected
                ? 'border-accent-copper/70 shadow-[0_0_32px_rgba(224,164,92,0.18)] bg-[#121626]/90'
                : 'hover:border-white/20'
            )}
          >
            <div className="space-y-6">
              {/* Card Header: Number, Tag, and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-accent-copper font-mono text-sm font-semibold">
                    0{index + 1}
                  </span>
                  {isSelected && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-accent-copper/20 text-accent-copper border border-accent-copper/30 animate-pulse">
                      Magnified in Orbit
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      selectService(isSelected ? null : service.slug);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper',
                      isSelected
                        ? 'bg-accent-copper text-bg border-accent-copper font-medium'
                        : 'bg-white/5 border-line text-mute hover:text-ink hover:bg-white/10'
                    )}
                    title={isSelected ? 'Reset orbit view' : 'Magnify 3D satellite'}
                    aria-label={`Magnify 3D satellite for ${service.title}`}
                  >
                    <Eye className="size-3.5" />
                    <span className="hidden sm:inline">
                      {isSelected ? 'Reset Orbit' : 'Inspect in Orbit'}
                    </span>
                  </button>

                  <Link
                    href={`/services/${service.slug}`}
                    className="p-2 rounded-full bg-white/5 border border-line text-mute hover:text-ink hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper"
                    aria-label={`View full details for ${service.title}`}
                  >
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </div>

              {/* Title & Tagline */}
              <div>
                <h2 className="font-serif text-[1.85rem] md:text-[2.2rem] font-light text-ink mb-1.5">
                  <Link
                    href={`/services/${service.slug}`}
                    className="hover:text-accent-copper transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-copper rounded-sm"
                  >
                    {service.title}
                  </Link>
                </h2>
                <p className="font-mono text-xs text-accent-copper/90 uppercase tracking-wider mb-3">
                  {service.tagline}
                </p>
                <p className="text-mute text-[0.98rem] leading-relaxed">
                  {service.intro}
                </p>
              </div>

              {/* Key Deliverables Preview */}
              <div className="space-y-2 pt-4 border-t border-line/50">
                <span className="font-mono text-[11px] uppercase tracking-wider text-accent-copper font-medium block">
                  Key Standard Deliverables
                </span>
                <ul className="space-y-1.5 list-none p-0 m-0">
                  {service.keyDeliverables.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="flex items-start gap-2.5 text-xs sm:text-[0.88rem] text-ink/90 leading-snug"
                    >
                      <CheckCircle2 className="size-3.5 text-accent-copper shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conditional Capabilities / Stacks */}
              <div className="pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {service.technicalSpec.frameworks.map((tech, techIdx) => (
                    <span
                      key={techIdx}
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/[0.03] border border-line/60 text-[#F2EFE8]/80"
                    >
                      {tech}
                    </span>
                  ))}
                  {service.technicalSpec.standards[0] && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-accent-copper/10 border border-accent-copper/30 text-accent-copper">
                      {service.technicalSpec.standards[0]}
                    </span>
                  )}
                </div>
              </div>

              {/* Engagement Timeline & Target Standards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4 border-t border-line text-xs text-mute">
                <div className="flex items-center gap-2">
                  <Clock className="size-3.5 text-accent-copper shrink-0" />
                  <span className="truncate">
                    <strong className="text-ink font-medium">Timeline:</strong>{' '}
                    {service.timeline}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3.5 text-accent-copper shrink-0" />
                  <span className="truncate">
                    <strong className="text-ink font-medium">Ownership:</strong> Agreement Defined
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-6 mt-6 border-t border-line/60 flex items-center justify-between">
              <Link
                href={`/services/${service.slug}`}
                className="inline-flex items-center gap-2 text-sm text-accent-copper hover:text-ink font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-copper rounded-sm"
              >
                <span>Explore full scope & FAQs</span>
                <ArrowRight className="size-4" />
              </Link>
              <Button
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                size="sm"
                variant="secondary"
              >
                Enquire
              </Button>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
