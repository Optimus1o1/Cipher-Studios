import React, { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  external?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', href, external, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans font-medium rounded-pill transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-ink text-[#07080f] hover:bg-transparent hover:text-ink border border-ink shadow-sm',
      secondary:
        'bg-transparent text-ink border border-line hover:border-ink hover:text-ink',
      ghost:
        'bg-transparent text-mute hover:text-ink hover:bg-white/5 border border-transparent',
      glass:
        'glass text-ink hover:border-accent/40 hover:bg-white/10 shadow-glass',
    };

    const sizes = {
      sm: 'text-[0.88rem] px-4 py-2 min-h-[36px]',
      md: 'text-[0.95rem] px-6 py-3 min-h-[44px]',
      lg: 'text-[1.05rem] px-8 py-4 min-h-[52px]',
    };

    const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);

    if (href) {
      if (external) {
        return (
          <a
            href={href}
            className={combinedClassName}
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={combinedClassName}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
