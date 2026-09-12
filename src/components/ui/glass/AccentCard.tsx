"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dots, Ring } from "./ProgressIndicators";
import { useTilt } from "@/hooks/useTilt";

interface AccentCardProps {
  label: string;
  badge?: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  icon: React.ReactNode;
  dots?: { filled: number; total: number };
  ring?: number;
  href?: string;
  className?: string;
}

export function AccentCard({
  label,
  badge = "FLAGSHIP",
  value,
  unit,
  subtext,
  icon,
  dots,
  ring,
  href,
  className,
}: AccentCardProps) {
  const { ref, style, handleMouseMove, handleMouseLeave } = useTilt<HTMLDivElement>(6);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const onMouseMoveCombined = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMouseMove(e);
    if (spotlightRef.current && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlightRef.current.style.opacity = "1";
      spotlightRef.current.style.background = `radial-gradient(350px circle at ${x}px ${y}px, rgba(224, 164, 92, 0.25), transparent 75%)`;
    }
  };

  const onMouseLeaveCombined = () => {
    handleMouseLeave();
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = "0";
    }
  };

  const cardClassName = cn(
    "glass-accent glass-noise p-6 sm:p-7 block transition-colors duration-300 group relative overflow-hidden rounded-glass border border-copper/40 will-change-transform cursor-pointer",
    className
  );

  const card = (
    <div
      ref={ref}
      style={style}
      onMouseMove={onMouseMoveCombined}
      onMouseLeave={onMouseLeaveCombined}
      className={cardClassName}
    >
      {/* Dynamic Radiant Copper Spotlight */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300"
        aria-hidden="true"
      />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="relative grid size-10 place-items-center rounded-full bg-copper/20 text-copper border border-copper/40">
            {icon}
          </span>
          {badge && (
            <span className="text-[10px] font-mono font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-copper/25 text-copper border border-copper/30">
              {badge}
            </span>
          )}
        </div>

        <span
          className="grid size-9 place-items-center rounded-full bg-copper/20 border border-copper/40 text-copper transition-all duration-300 group-hover:bg-copper group-hover:text-ink"
          aria-hidden="true"
        >
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>

      <p className="mt-6 text-xs sm:text-sm font-semibold tracking-wide uppercase text-copper relative z-10">
        {label}
      </p>

      <div className="mt-1 flex items-end justify-between relative z-10">
        <div>
          <p className="flex items-baseline gap-1.5 text-bone font-heading">
            <span className="text-4xl sm:text-5xl font-medium tracking-tight tabular-nums">
              {value}
            </span>
            {unit && (
              <span className="text-sm sm:text-base font-normal text-copper/80">
                {unit}
              </span>
            )}
          </p>
          {subtext && (
            <p className="mt-2 text-xs text-bone/70 max-w-[280px] leading-relaxed">
              {subtext}
            </p>
          )}
        </div>

        <div className="pb-1">
          {dots && <Dots filled={dots.filled} total={dots.total} />}
          {typeof ring === "number" && <Ring percent={ring} />}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block outline-none">
        {card}
      </Link>
    );
  }

  return card;
}
