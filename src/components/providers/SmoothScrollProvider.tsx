"use client";

import React, { useEffect } from "react";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Prevent automatic browser scroll restoration to ensure clean entrance state
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Respect prefers-reduced-motion
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    let lenisInstance: any = null;
    let tickerCallback: any = null;

    async function initLenis() {
      try {
        const Lenis = (await import("lenis")).default;
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");

        gsap.registerPlugin(ScrollTrigger);

        lenisInstance = new Lenis({
          duration: 1.15,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 0.9,
          touchMultiplier: 1.5,
        });

        // Sync Lenis scroll events to GSAP ScrollTrigger
        lenisInstance.on("scroll", ScrollTrigger.update);

        // Drive Lenis directly from GSAP Ticker for perfect scrub synchronization
        tickerCallback = (time: number) => {
          lenisInstance.raf(time * 1000);
        };
        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);
      } catch (err) {
        console.warn("Smooth scroll initialization skipped:", err);
      }
    }

    initLenis();

    return () => {
      if (lenisInstance) {
        lenisInstance.destroy();
      }
      if (tickerCallback) {
        import("gsap").then(({ gsap }) => {
          gsap.ticker.remove(tickerCallback);
        });
      }
    };
  }, []);

  return <>{children}</>;
}
