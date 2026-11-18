'use client';

import React from 'react';
import type { ServiceTechnicalSpec } from '@/data/services';
import { cn } from '@/lib/utils';
import { Shield, Sparkles, Terminal, Clock } from 'lucide-react';

interface ServiceSpecHUDProps {
  technicalSpec: ServiceTechnicalSpec;
  timeline: string;
  className?: string;
}

export const ServiceSpecHUD: React.FC<ServiceSpecHUDProps> = ({
  technicalSpec,
  timeline,
  className,
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl bg-black/40 border border-line/60 backdrop-blur-md',
        className
      )}
    >
      {/* Spec 1: Engagement Timeline */}
      <div className="flex flex-col justify-between p-3 rounded-lg bg-white/[0.02] border border-line/30">
        <div className="flex items-center gap-1.5 text-mute mb-1">
          <Clock className="size-3.5 text-accent-copper shrink-0" />
          <span className="font-mono text-[0.66rem] uppercase tracking-wider">
            Typical Timeline
          </span>
        </div>
        <span className="font-mono text-[0.88rem] font-medium text-ink">
          {timeline}
        </span>
      </div>

      {/* Spec 2: Standards Target */}
      <div className="flex flex-col justify-between p-3 rounded-lg bg-white/[0.02] border border-line/30">
        <div className="flex items-center gap-1.5 text-mute mb-1">
          <Sparkles className="size-3.5 text-accent-copper shrink-0" />
          <span className="font-mono text-[0.66rem] uppercase tracking-wider">
            Target Standards
          </span>
        </div>
        {(() => {
          const rawStandard = technicalSpec.standards[0] || 'Modern Engineering';
          const displayStandard = rawStandard.replace(/Core Web Vitals Targets?/i, 'CWV Target');
          return (
            <span
              className="font-mono text-[0.88rem] font-medium text-emerald-400 truncate"
              title={rawStandard}
              aria-label={rawStandard}
            >
              {displayStandard}
            </span>
          );
        })()}
      </div>

      {/* Spec 3: Primary Tooling / Stacks */}
      <div className="flex flex-col justify-between p-3 rounded-lg bg-white/[0.02] border border-line/30">
        <div className="flex items-center gap-1.5 text-mute mb-1">
          <Terminal className="size-3.5 text-accent-copper shrink-0" />
          <span className="font-mono text-[0.66rem] uppercase tracking-wider">
            Core Tooling
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-0.5">
          {technicalSpec.frameworks.slice(0, 2).map((fw, idx) => (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded text-[0.66rem] font-mono bg-white/5 border border-line/50 text-[#F2EFE8]"
            >
              {fw}
            </span>
          ))}
          {technicalSpec.frameworks.length > 2 && (
            <span className="px-1 py-0.5 text-[0.66rem] font-mono text-mute">
              +{technicalSpec.frameworks.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Spec 4: Client Ownership */}
      <div className="flex flex-col justify-between p-3 rounded-lg bg-white/[0.02] border border-line/30">
        <div className="flex items-center gap-1.5 text-mute mb-1">
          <Shield className="size-3.5 text-accent-copper shrink-0" />
          <span className="font-mono text-[0.66rem] uppercase tracking-wider">
            Asset Ownership
          </span>
        </div>
        <span className="font-mono text-[0.82rem] font-medium text-[#F2EFE8] leading-tight">
          Client Agreement Defined
        </span>
      </div>
    </div>
  );
};
