'use client';

import React from 'react';
import type { EngineeringPrinciple } from '@/data/founder';
import { cn } from '@/lib/utils';
import { Compass, Layers, ShieldCheck, KeyRound } from 'lucide-react';

interface PrinciplesGridProps {
  principles: EngineeringPrinciple[];
  className?: string;
}

const principleIcons = {
  Compass,
  Layers,
  ShieldCheck,
  KeyRound,
};

export const PrinciplesGrid: React.FC<PrinciplesGridProps> = ({
  principles,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5', className)}>
      {principles.map((principle) => {
        const Icon = principleIcons[principle.iconName] || Compass;

        return (
          <div
            key={principle.number}
            className="group relative flex flex-col justify-between rounded-xl border border-line/50 bg-[#0B0D18]/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-accent-copper/40 hover:bg-[#0E1120]"
          >
            <div>
              {/* Header: Icon + Number */}
              <div className="flex items-center justify-between mb-3">
                <div className="size-8 rounded-lg bg-accent-copper/10 border border-accent-copper/20 flex items-center justify-center text-accent-copper">
                  <Icon className="size-4" />
                </div>
                <span className="font-mono text-[0.70rem] text-mute font-medium">
                  PRINCIPLE — {principle.number}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h4 className="font-serif text-[1.22rem] font-light text-ink tracking-tight mb-1 group-hover:text-accent-copper transition-colors">
                {principle.title}
              </h4>
              <p className="font-mono text-[0.72rem] text-accent-copper/85 tracking-wide mb-2.5">
                {principle.subtitle}
              </p>

              {/* Description */}
              <p className="text-[0.85rem] leading-relaxed text-mute">
                {principle.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
