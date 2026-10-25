import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps {
  tag?: string;
  title: string;
  lead?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({
  tag,
  title,
  lead,
  className,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'grid gap-4 mb-12 md:mb-16',
        align === 'center' && 'text-center justify-items-center',
        className
      )}
    >
      {tag && (
        <span className="text-accent text-[0.92rem] font-medium tracking-wide uppercase">
          {tag}
        </span>
      )}
      <h2 className="font-serif font-light text-ink text-[2.2rem] md:text-[3.2rem] leading-[1.08] tracking-[-0.025em] max-w-[18ch]">
        {title}
      </h2>
      {lead && (
        <p className="text-mute text-[1.05rem] md:text-[1.12rem] leading-relaxed max-w-[50ch]">
          {lead}
        </p>
      )}
    </div>
  );
}
