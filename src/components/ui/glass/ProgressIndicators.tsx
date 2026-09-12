"use client";

import React from "react";

export function Dots({ filled = 4, total = 5 }: { filled?: number; total?: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`${filled} of ${total} rating`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full transition-colors ${
            i < filled ? "bg-copper" : "bg-white/15"
          }`}
        />
      ))}
    </div>
  );
}

export function Ring({ percent = 85, size = 38 }: { percent?: number; size?: number }) {
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E0A45C"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-[10px] font-mono text-bone/80">{percent}%</span>
    </div>
  );
}

export function MiniBars({ values = [40, 65, 80, 55, 90, 100] }: { values?: number[] }) {
  return (
    <div className="flex items-end gap-1 h-5" aria-hidden="true">
      {values.map((v, i) => (
        <span
          key={i}
          style={{ height: `${Math.max(15, Math.min(100, v))}%` }}
          className={`w-1 rounded-sm transition-all duration-300 ${
            i === values.length - 1 ? "bg-copper" : "bg-bone/30"
          }`}
        />
      ))}
    </div>
  );
}
