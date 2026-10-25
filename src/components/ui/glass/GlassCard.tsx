import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'light' | 'dark';
  noise?: boolean;
  interactive?: boolean;
}

export function GlassCard({
  tone = 'dark',
  noise = true,
  interactive = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        tone === 'light' ? 'glass' : 'glass-dark',
        noise && 'glass-noise',
        'p-6 md:p-8 rounded-card transition-all duration-300',
        interactive && 'hover:-translate-y-1 hover:border-accent/40 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
