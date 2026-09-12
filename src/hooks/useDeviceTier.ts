"use client";

import { useEffect, useState } from "react";
import { DeviceTier } from "@/types";

/**
 * useDeviceTier: Hardware capability and accessibility gate
 * Returns 'full' (live WebGL R3F canvas) or 'off' (reduced motion / no WebGL)
 */
let cachedTier: DeviceTier | null = null;

export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>(cachedTier || "full");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (cachedTier !== null) {
      setTier(cachedTier);
      return;
    }

    // 1. Accessibility guard: bail if reduced motion is requested
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      cachedTier = "off";
      setTier("off");
      return;
    }

    // Modern feature detection: WebGLRenderingContext presence without throwaway contexts
    const hasWebGL = typeof window.WebGLRenderingContext !== "undefined";
    cachedTier = hasWebGL ? "full" : "off";
    setTier(cachedTier);
  }, []);

  return tier;
}
