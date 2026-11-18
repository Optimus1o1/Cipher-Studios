import React from 'react';
import type { ProjectMetric } from '@/data/projects';
import { cn } from '@/lib/utils';

interface ProjectMetricHUDProps {
  metrics: ProjectMetric[];
  className?: string;
}

export const ProjectMetricHUD: React.FC<ProjectMetricHUDProps> = ({
  metrics,
  className,
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-black/40 border border-line/60 backdrop-blur-sm',
        className
      )}
    >
      {metrics.map((metric, idx) => {
        let valueColor = 'text-ink';
        if (metric.variant === 'emerald') valueColor = 'text-emerald-400';
        else if (metric.variant === 'copper') valueColor = 'text-accent-copper';
        else if (metric.variant === 'cyan') valueColor = 'text-sky-400';

        return (
          <div
            key={idx}
            className="flex flex-col justify-center px-3 py-2 rounded-lg bg-white/[0.02] border border-line/30"
          >
            <span
              className="font-mono text-[0.66rem] uppercase tracking-wider text-mute truncate"
              title={metric.label}
              aria-label={metric.label}
            >
              {metric.label}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={cn('font-mono font-semibold text-[0.95rem] tracking-tight', valueColor)}>
                {metric.value}
              </span>
              {metric.unit && (
                <span className="font-mono text-[0.62rem] text-mute/80 uppercase">
                  {metric.unit}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
