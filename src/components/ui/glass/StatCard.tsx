"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dots, Ring, MiniBars } from "./ProgressIndicators";
import { useTilt } from "@/hooks/useTilt";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  status?: "ok" | "warn" | "pulse";
  dots?: { filled: number; total: number };
  ring?: number;
  bars?: number[];
  href?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  unit,
  icon,
  status = "ok",
  dots,
  ring,
  bars,
  href,
  className,
}: StatCardProps) {
  const { ref, style, handleMouseMove, handleMouseLeave } = useTilt<HTMLDivElement>(6);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const onMouseMoveCombined = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMouseMove(e);
    if (spotlightRef.current && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlightRef.current.style.opacity = "1";
      spotlightRef.current.style.background = `radial-gradient(320px circle at ${x}px ${y}px, rgba(224, 164, 92, 0.18), transparent 75%)`;
    }
  };

  const onMouseLeaveCombined = () => {
    handleMouseLeave();
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = "0";
    }
  };

  const cardClassName = cn(
    "glass-dark glass-noise p-6 sm:p-7 block transition-colors duration-300 group relative overflow-hidden rounded-glass border border-white/10 hover:border-copper/40 will-change-transform cursor-pointer",
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
      {/* Dynamic Copper Spotlight */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300"
        aria-hidden="true"
      />

      <div className="flex items-start justify-between relative z-10">
        {/* Icon Chip */}
        <span className="relative grid size-10 place-items-center rounded-full bg-white/10 text-copper border border-white/10 group-hover:border-copper/40 transition-colors">
          {icon}
          {status === "warn" && (
            <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-amber-500 ring-2 ring-ink" />
          )}
          {status === "pulse" && (
            <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-copper ring-2 ring-ink animate-ping" />
          )}
        </span>

        {/* Arrow chip */}
        <span
          className="grid size-9 place-items-center rounded-full bg-white/5 border border-white/10 text-slate-dark transition-all duration-300 group-hover:bg-copper group-hover:text-ink group-hover:border-copper"
          aria-hidden="true"
        >
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>

      {/* Label */}
      <p className="mt-6 text-xs sm:text-sm font-medium tracking-wide uppercase text-slate-dark relative z-10">
        {label}
      </p>

      {/* Value & Indicator */}
      <div className="mt-1.5 flex items-end justify-between relative z-10">
        <p className="flex items-baseline gap-1.5 text-bone font-heading">
          <span className="text-4xl sm:text-5xl font-medium tracking-tight tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="text-sm sm:text-base font-normal text-slate-dark">
              {unit}
            </span>
          )}
        </p>

        {/* Micro Visual */}
        <div className="pb-1">
          {dots && <Dots filled={dots.filled} total={dots.total} />}
          {typeof ring === "number" && <Ring percent={ring} />}
          {bars && <MiniBars values={bars} />}
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
