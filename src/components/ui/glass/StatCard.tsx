import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon?: React.ReactNode;
  dots?: { filled: number; total: number };
  href?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  unit,
  icon,
  dots,
  href,
  className,
}: StatCardProps) {
  const CardContent = (
    <div
      className={cn(
        'glass-dark glass-noise p-6 md:p-7 rounded-card border border-line relative overflow-hidden transition-all duration-300 hover:border-accent/40 group',
        className
      )}
    >
      <div className="flex items-start justify-between">
        {icon && (
          <span className="relative grid size-10 place-items-center rounded-full bg-white/5 border border-white/10 text-accent">
            {icon}
          </span>
        )}
        {href && (
          <span className="grid size-9 place-items-center rounded-full bg-white/5 border border-white/10 text-mute transition-colors group-hover:text-ink group-hover:bg-white/10">
            <ArrowUpRight className="size-4" />
          </span>
        )}
      </div>

      <p className="mt-6 text-sm text-mute">{label}</p>

      <div className="mt-2 flex items-end justify-between gap-4">
        <p className="flex items-baseline gap-1.5">
          <span className="text-4xl md:text-5xl font-normal tracking-tight tabular-nums text-ink font-serif">
            {value}
          </span>
          {unit && <span className="text-sm text-mute font-sans">{unit}</span>}
        </p>

        {dots && (
          <div className="flex gap-1.5 items-center pb-1" aria-hidden="true">
            {Array.from({ length: dots.total }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  i < dots.filled ? 'bg-accent' : 'bg-white/10'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
