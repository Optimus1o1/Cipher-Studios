"use client";

import React from "react";
import { motion } from "framer-motion";
import { DeviceTier } from "@/types";

const ORDER = [
  [0, 2],
  [1, 2],
  [2, 2],
  [0, 1],
  [0, 0],
  [1, 0],
  [2, 0],
];

export function FallbackGrid({ tier = "lite" }: { tier?: DeviceTier }) {
  const isOff = tier === "off";

  return (
    <div
      className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div className="relative w-72 h-72 sm:w-96 sm:h-96 grid grid-cols-3 grid-rows-3 gap-3 p-4 opacity-40">
        {/* 7 bone cells */}
        {ORDER.map(([c, r], i) => (
          <motion.div
            key={`${c}-${r}`}
            style={{ gridColumn: c + 1, gridRow: r + 1 }}
            className="rounded-glass-sm bg-bone/70 shadow-lg border border-white/20 backdrop-blur-sm"
            initial={!isOff ? { opacity: 0, scale: 0.8 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={
              !isOff
                ? { duration: 0.6, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }
                : undefined
            }
          />
        ))}

        {/* Central hollow cell */}
        <div
          style={{ gridColumn: 2, gridRow: 2 }}
          className="rounded-glass-sm border border-bone/25 bg-transparent"
        />

        {/* Copper cell */}
        <motion.div
          style={{ gridColumn: 3, gridRow: 2 }}
          className="rounded-glass-sm bg-copper shadow-copper-glow border border-copper/60"
          initial={!isOff ? { opacity: 0, scale: 0.8 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={
            !isOff
              ? { duration: 0.6, delay: 0.08 * ORDER.length + 0.1, ease: [0.16, 1, 0.3, 1] }
              : undefined
          }
        />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
    </div>
  );
}
