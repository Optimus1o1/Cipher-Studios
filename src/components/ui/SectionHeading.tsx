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
        'grid gap-3 sm:gap-4 mb-8 sm:mb-12 md:mb-16',
        align === 'center' && 'text-center justify-items-center',
        className
      )}
    >
      {tag && (
        <span className="text-accent text-[0.78rem] sm:text-[0.85rem] font-mono font-medium tracking-wider uppercase">
          {tag}
        </span>
      )}
      <h2 className="font-serif font-light text-ink text-[1.85rem] sm:text-[2.4rem] md:text-[3.2rem] leading-[1.12] sm:leading-[1.08] tracking-[-0.02em] max-w-[22ch]">
        {title}
      </h2>
      {lead && (
        <p className="text-mute text-[0.94rem] sm:text-[1.02rem] md:text-[1.12rem] leading-relaxed max-w-[54ch]">
          {lead}
        </p>
      )}
    </div>
  );
}
