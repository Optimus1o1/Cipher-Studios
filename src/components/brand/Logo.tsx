"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  size?: number;
  tone?: "dark" | "light";
  withWordmark?: boolean;
  animate?: boolean;
  className?: string;
};

const CELL = 24, GAP = 8, RX = 5;

// The exact cell order forming the "C" around the 3x3 matrix:
// Bottom-left [0,2] → Bottom-mid [1,2] → Bottom-right [2,2] → Mid-left [0,1] → Top-left [0,0] → Top-mid [1,0] → Top-right [2,0]
const CELL_ORDER = [
  [0, 2],
  [1, 2],
  [2, 2],
  [0, 1],
  [0, 0],
  [1, 0],
  [2, 0],
];

/**
 * CIPHER Matrix Logo Mark & Wordmark
 *
 * Implements the official 3x3 matrix C mark (seven bone cells forming a C,
 * one hollow cell, one copper cell).
 *
 * - Instant First Paint: Fully visible with opacity: 1 and scale: 1 as soon
 *   as the page loads (zero mount delay, zero blank flash).
 * - High-Velocity Hover Choreography:
 *   - Sequential decode cascade ripple across all 7 C-cells
 *   - Radiant blooming pulse on signature Copper cell [2, 1]
 *   - Luminous glowing accent stroke on central hollow cell [1, 1]
 *   - Space Grotesk wordmark tracking expansion & copper sheen
 *   - Ambient radial copper halo blooming behind mark
 */
export function Logo({
  size = 40,
  tone = "dark",
  withWordmark = true,
  className = "",
}: Props) {
  const reduce = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const fg = tone === "dark" ? "#F2EFE8" : "#0F1013";

  return (
    <motion.span
      className={`group relative inline-flex items-center cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-copper/60 rounded-md transition-colors ${className}`}
      style={{
        gap: size * 0.38,
      }}
      tabIndex={0}
      aria-label="CIPHER Logo — Decode. Build. Evolve."
      initial="initial"
      animate={isHovered ? "hover" : "initial"}
      whileHover={reduce ? undefined : "hover"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => {
        setTimeout(() => setIsHovered(false), 600);
      }}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {/* Ambient Copper Radial Halo (Blooms beneath the mark on hover) */}
      <motion.div
        variants={{
          initial: { opacity: 0, scale: 0.8 },
          hover: {
            opacity: 0.65,
            scale: 1.35,
            transition: { duration: 0.3, ease: "easeOut" },
          },
        }}
        className="absolute -left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-copper/25 blur-md pointer-events-none -z-10"
        style={{
          width: size * 1.15,
          height: size * 1.15,
        }}
      />

      {/* 3x3 Matrix SVG Mark — fully visible immediately on initial render */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 88 88"
        role="img"
        aria-hidden="true"
        className="relative z-10 shrink-0 overflow-visible opacity-100"
        variants={{
          initial: { scale: 1, rotate: 0 },
          hover: {
            scale: 1.06,
            rotate: [0, -1.5, 1.5, 0],
            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
          },
        }}
      >
        {/* 7 Bone cells forming the "C" — instantly 100% visible on page load */}
        {CELL_ORDER.map(([c, r], i) => (
          <motion.rect
            key={`${c}-${r}`}
            x={c * (CELL + GAP)}
            y={r * (CELL + GAP)}
            width={CELL}
            height={CELL}
            rx={RX}
            fill={fg}
            variants={{
              initial: {
                scale: 1,
                opacity: 1,
                fill: fg,
                filter: "drop-shadow(0 0 0px transparent)",
              },
              hover: {
                scale: [1, 1.2, 0.96, 1],
                fill: [fg, "#FAF7F2", fg],
                filter: [
                  "drop-shadow(0 0 0px transparent)",
                  "drop-shadow(0 0 5px rgba(242, 239, 232, 0.5))",
                  "drop-shadow(0 0 0px transparent)",
                ],
                transition: {
                  duration: 0.45,
                  delay: i * 0.04,
                  repeat: Infinity,
                  repeatDelay: 1.4,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            style={{
              transformOrigin: `${c * (CELL + GAP) + 12}px ${r * (CELL + GAP) + 12}px`,
            }}
          />
        ))}

        {/* Central hollow cell — instantly visible, illuminates in Copper on hover */}
        <motion.rect
          x={1 * (CELL + GAP) + 0.75}
          y={1 * (CELL + GAP) + 0.75}
          width={CELL - 1.5}
          height={CELL - 1.5}
          rx={RX}
          fill="none"
          stroke={fg}
          strokeWidth={1.5}
          strokeOpacity={0.28}
          variants={{
            initial: {
              scale: 1,
              stroke: fg,
              strokeOpacity: 0.28,
              filter: "drop-shadow(0 0 0px transparent)",
            },
            hover: {
              scale: [1, 1.15, 1],
              stroke: "#E0A45C",
              strokeOpacity: [0.35, 1, 0.65],
              strokeWidth: [1.5, 2, 1.5],
              filter: [
                "drop-shadow(0 0 0px transparent)",
                "drop-shadow(0 0 6px rgba(224, 164, 92, 0.8))",
                "drop-shadow(0 0 2px rgba(224, 164, 92, 0.4))",
              ],
              transition: {
                duration: 0.65,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            },
          }}
          style={{
            transformOrigin: `${1 * (CELL + GAP) + 12}px ${1 * (CELL + GAP) + 12}px`,
          }}
        />

        {/* Copper signature cell [col 2, row 1] — instantly visible, radiant on hover */}
        <motion.rect
          x={2 * (CELL + GAP)}
          y={1 * (CELL + GAP)}
          width={CELL}
          height={CELL}
          rx={RX}
          fill="#E0A45C"
          variants={{
            initial: {
              scale: 1,
              opacity: 1,
              filter: "drop-shadow(0 0 0px #E0A45C)",
            },
            hover: {
              scale: [1, 1.3, 1.12],
              filter: [
                "drop-shadow(0 0 2px rgba(224, 164, 92, 0.5))",
                "drop-shadow(0 0 14px rgba(224, 164, 92, 0.95))",
                "drop-shadow(0 0 4px rgba(224, 164, 92, 0.6))",
              ],
              transition: {
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: [0.16, 1, 0.3, 1],
              },
            },
          }}
          style={{
            transformOrigin: `${2 * (CELL + GAP) + 12}px ${1 * (CELL + GAP) + 12}px`,
          }}
        />
      </motion.svg>

      {/* Wordmark — instantly 100% visible on page load */}
      {withWordmark && (
        <motion.span
          variants={{
            initial: {
              letterSpacing: "0.1em",
              color: fg,
            },
            hover: {
              letterSpacing: "0.18em",
              color: "#E0A45C",
              textShadow: "0 0 12px rgba(224, 164, 92, 0.4)",
              transition: {
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              },
            },
          }}
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontWeight: 600,
            fontSize: size * 0.75,
            lineHeight: 1,
          }}
          className="relative inline-block opacity-100 transition-colors"
        >
          CIPHER
        </motion.span>
      )}
    </motion.span>
  );
}

export default Logo;
