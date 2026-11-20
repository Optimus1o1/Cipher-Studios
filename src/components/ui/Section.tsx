import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div' | 'article';
  container?: boolean;
  veil?: boolean;
  borderTop?: boolean;
}

export function Section({
  as: Component = 'section',
  container = true,
  veil = true,
  borderTop = true,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(
        'relative py-12 sm:py-16 md:py-24',
        veil && 'bg-veil backdrop-blur-[2px]',
        borderTop && 'border-t border-line',
        className
      )}
      {...props}
    >
      {container ? (
        <div className="max-w-content mx-auto px-5 sm:px-6 md:px-8 w-full relative z-10">
          {children}
        </div>
      ) : (
        children
      )}
    </Component>
  );
}
