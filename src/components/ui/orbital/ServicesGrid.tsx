'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock, UserCheck, ArrowRight, Eye } from 'lucide-react';
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
              'flex flex-col justify-between p-6 sm:p-8 md:p-10 transition-all duration-300',
              isSelected
                ? 'border-accent/70 shadow-[0_0_32px_rgba(216,195,160,0.18)] bg-[#121626]/90'
                : 'hover:border-white/20'
            )}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-accent font-mono text-sm font-semibold">
                    0{index + 1}
                  </span>
                  {isSelected && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-accent/20 text-accent border border-accent/30 animate-pulse">
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
                      'p-2 rounded-full border text-xs transition-colors',
                      isSelected
                        ? 'bg-accent text-bg border-accent font-medium'
                        : 'bg-white/5 border-line text-mute hover:text-ink hover:bg-white/10'
                    )}
                    title={isSelected ? 'Reset orbit view' : 'Magnify 3D satellite'}
                    aria-label={`Magnify 3D satellite for ${service.title}`}
                  >
                    <Eye className="size-4" />
                  </button>

                  <Link
                    href={`/services/${service.slug}`}
                    className="p-2 rounded-full bg-white/5 border border-line text-mute hover:text-ink hover:bg-white/10 transition-colors"
                    aria-label={`View details for ${service.title}`}
                  >
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-[1.85rem] md:text-[2.2rem] font-light text-ink mb-3">
                  <Link
                    href={`/services/${service.slug}`}
                    className="hover:text-accent transition-colors"
                  >
                    {service.title}
                  </Link>
                </h2>
                <p className="text-mute text-[1rem] leading-relaxed">
                  {service.intro}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-line text-[0.92rem]">
                <div className="flex items-start gap-2.5 text-mute">
                  <UserCheck className="size-4 text-accent shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-ink font-medium">Best for:</strong>{' '}
                    {service.bestFor}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-mute">
                  <Clock className="size-4 text-accent shrink-0" />
                  <span>
                    <strong className="text-ink font-medium">Typical timeline:</strong>{' '}
                    {service.timeline}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-line/60 flex items-center justify-between">
              <Link
                href={`/services/${service.slug}`}
                className="inline-flex items-center gap-2 text-sm text-accent hover:text-ink font-medium transition-colors"
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
