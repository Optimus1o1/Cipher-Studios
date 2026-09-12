"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "px-3.5 py-1.5 text-xs min-h-[36px]",
      md: "px-5 py-2.5 text-sm min-h-[44px]",
      lg: "px-7 py-3.5 text-base min-h-[52px]",
    };

    const variantClasses = {
      primary:
        "bg-copper text-ink font-semibold hover:bg-copper-hover active:bg-copper-active shadow-md hover:shadow-copper-glow border border-copper/50",
      secondary:
        "bg-white/10 text-bone hover:bg-white/15 active:bg-white/20 border border-white/15",
      glass:
        "glass-dark text-bone hover:border-copper/40 active:border-copper/60 hover-lift",
      ghost:
        "bg-transparent text-slate-dark hover:text-bone hover:bg-white/5 active:bg-white/10",
      accent:
        "bg-gradient-to-r from-copper to-amber-500 text-ink font-semibold shadow-lg hover:shadow-copper-glow border border-copper/60",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none tracking-wide",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
