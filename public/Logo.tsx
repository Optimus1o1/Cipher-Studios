"use client";
import { motion, useReducedMotion } from "framer-motion";

type Props = { size?: number; tone?: "dark" | "light"; withWordmark?: boolean; animate?: boolean; className?: string };

const FILLED = [[0,0],[1,0],[2,0],[0,1],[0,2],[1,2],[2,2]];
const CELL = 24, GAP = 8, RX = 5;

/** CIPHER mark: cells "decode" into the C on mount. Drop in /components/Logo.tsx */
export function Logo({ size = 40, tone = "dark", withWordmark = true, animate = true, className }: Props) {
  const reduce = useReducedMotion();
  const fg = tone === "dark" ? "#F2EFE8" : "#0F1013";
  const s = size / 88;
  const order = [[0,2],[1,2],[2,2],[0,1],[0,0],[1,0],[2,0]]; // bottom-left → around the C
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: size * 0.36 }} aria-label="CIPHER">
      <svg width={size} height={size} viewBox="0 0 88 88" role="img" aria-hidden="true">
        {order.map(([c, r], i) => (
          <motion.rect key={`${c}${r}`} x={c*(CELL+GAP)} y={r*(CELL+GAP)} width={CELL} height={CELL} rx={RX} fill={fg}
            initial={animate && !reduce ? { opacity: 0, scale: 0.6 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: `${c*(CELL+GAP)+12}px ${r*(CELL+GAP)+12}px` }} />
        ))}
        <rect x={1*(CELL+GAP)+0.75} y={1*(CELL+GAP)+0.75} width={CELL-1.5} height={CELL-1.5} rx={RX} fill="none" stroke={fg} strokeOpacity={0.28} strokeWidth={1.5} />
        <motion.rect x={2*(CELL+GAP)} y={1*(CELL+GAP)} width={CELL} height={CELL} rx={RX} fill="#E0A45C"
          initial={animate && !reduce ? { opacity: 0, scale: 0.6 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.08 * order.length + 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: `${2*(CELL+GAP)+12}px ${1*(CELL+GAP)+12}px` }} />
      </svg>
      {withWordmark && (
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: size * 0.75, letterSpacing: "0.1em", color: fg, lineHeight: 1 }}>
          CIPHER
        </span>
      )}
    </span>
  );
}
export default Logo;
