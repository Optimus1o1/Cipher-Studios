"use client";

import React, { ElementType, forwardRef, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "dark" | "light" | "accent";
  noise?: boolean;
  interactive?: boolean;
  withSpotlight?: boolean;
  tilt?: boolean;
  maxTilt?: number;
  as?: ElementType;
  children: React.ReactNode;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      tone = "dark",
      noise = true,
      interactive = false,
      withSpotlight = true,
      tilt,
      maxTilt = 6,
      as: Component = "div",
      className,
      children,
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const spotlightRef = useRef<HTMLDivElement | null>(null);

    // Default tilt to true if card is interactive or explicitly set
    const shouldTilt = tilt !== undefined ? tilt : interactive;

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (cardRef.current) {
          const rect = cardRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          // 1. Direct GPU Spotlight position update (zero React state overhead)
          if (withSpotlight && spotlightRef.current) {
            spotlightRef.current.style.opacity = "1";
            spotlightRef.current.style.background = `radial-gradient(380px circle at ${x}px ${y}px, rgba(224, 164, 92, 0.2), transparent 75%)`;
          }

          // 2. Direct 3D Parallax Tilt update
          if (shouldTilt) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -maxTilt;
            const rotateY = ((x - centerX) / centerX) * maxTilt;
            cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
            cardRef.current.style.transition = "transform 0.1s ease-out";
          }
        }
        onMouseMove?.(e);
      },
      [withSpotlight, shouldTilt, maxTilt, onMouseMove]
    );

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (spotlightRef.current) {
          spotlightRef.current.style.opacity = "1";
        }
        onMouseEnter?.(e);
      },
      [onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (spotlightRef.current) {
          spotlightRef.current.style.opacity = "0";
        }
        if (shouldTilt && cardRef.current) {
          cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
          cardRef.current.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
        }
        onMouseLeave?.(e);
      },
      [shouldTilt, onMouseLeave]
    );

    const toneClass =
      tone === "accent"
        ? "glass-accent"
        : tone === "light"
        ? "glass text-ink"
        : "glass-dark";

    return (
      <Component
        ref={(el: HTMLDivElement | null) => {
          cardRef.current = el;
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          toneClass,
          noise && "glass-noise",
          interactive && "hover-lift cursor-pointer",
          "p-6 sm:p-7 relative overflow-hidden will-change-transform",
          className
        )}
        {...props}
      >
        {/* Floating Radial Color Spotlight beneath the frosted glass */}
        {withSpotlight && (
          <div
            ref={spotlightRef}
            className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300"
            aria-hidden="true"
          />
        )}
        {children}
      </Component>
    );
  }
);

GlassCard.displayName = "GlassCard";
