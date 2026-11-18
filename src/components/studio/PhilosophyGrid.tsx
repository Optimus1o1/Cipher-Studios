'use client';

import React from 'react';
import type { PhilosophyPillar } from '@/data/founder';
import { cn } from '@/lib/utils';
import { Search, Hammer, Activity } from 'lucide-react';

interface PhilosophyGridProps {
  pillars: PhilosophyPillar[];
  className?: string;
}

const pillarIcons = {
  '01': Search,
  '02': Hammer,
  '03': Activity,
};

export const PhilosophyGrid: React.FC<PhilosophyGridProps> = ({
  pillars,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5', className)}>
      {pillars.map((pillar) => {
        const Icon = pillarIcons[pillar.number as keyof typeof pillarIcons] || Activity;

        return (
          <div
            key={pillar.number}
            className="group relative flex flex-col justify-between rounded-xl border border-line/60 bg-[#0B0D18]/60 p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent-copper/50 hover:bg-[#0E1120]"
          >
            {/* Header: Phase badge & Icon */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[0.72rem] tracking-wider text-accent-copper font-semibold px-2 py-0.5 rounded bg-accent-copper/10 border border-accent-copper/20">
                  {pillar.number} · {pillar.phase}
                </span>
                <div className="size-8 rounded-lg bg-white/[0.03] border border-line/40 flex items-center justify-center text-mute group-hover:text-accent-copper group-hover:border-accent-copper/40 transition-colors">
                  <Icon className="size-4" />
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="font-serif text-[1.35rem] font-light text-ink tracking-tight mb-1 group-hover:text-ink transition-colors">
                {pillar.title}
              </h3>
              <p className="font-mono text-[0.74rem] text-accent-copper/90 mb-3 tracking-wide">
                {pillar.tagline}
              </p>

              {/* Description */}
              <p className="text-[0.88rem] leading-relaxed text-mute mb-4">
                {pillar.description}
              </p>
            </div>

            {/* Deliverables summary footer */}
            <div className="pt-3 border-t border-line/30 font-mono text-[0.70rem] text-mute flex items-start gap-1.5">
              <span className="text-accent-copper shrink-0 font-medium">Focus:</span>
              <span className="text-ink/80 leading-snug">{pillar.deliverablesSummary}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
