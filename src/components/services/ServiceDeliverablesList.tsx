'use client';

import React from 'react';
import type { ServicePhase } from '@/data/services';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceDeliverablesListProps {
  phasedDeliverables: ServicePhase[];
  className?: string;
}

export const ServiceDeliverablesList: React.FC<ServiceDeliverablesListProps> = ({
  phasedDeliverables,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-8', className)}>
      {phasedDeliverables.map((phaseGroup, idx) => (
        <div
          key={idx}
          className="p-6 md:p-8 rounded-xl bg-bg-surface/60 border border-line/70 backdrop-blur-sm space-y-6"
        >
          {/* Phase Header */}
          <div className="flex items-center justify-between border-b border-line pb-4">
            <span className="font-mono text-xs uppercase tracking-wider text-accent-copper font-medium">
              {phaseGroup.phase}
            </span>
            <span className="font-mono text-[11px] text-mute">
              {phaseGroup.items.length} Scope Items
            </span>
          </div>

          <h3 className="font-serif font-light text-ink text-[1.4rem] md:text-[1.6rem] leading-snug">
            {phaseGroup.title}
          </h3>

          <ul className="space-y-3.5 list-none p-0 m-0">
            {phaseGroup.items.map((item, itemIdx) => (
              <li
                key={itemIdx}
                className="flex items-start gap-3 text-[0.98rem] text-ink leading-relaxed"
              >
                <CheckCircle2 className="size-4 text-accent-copper shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
