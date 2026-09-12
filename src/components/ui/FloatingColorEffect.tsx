"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDeviceTier } from "@/hooks/useDeviceTier";

interface FloatingRipple {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: string;
}

export function FloatingColorEffect() {
  const tier = useDeviceTier();
  const auraRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<FloatingRipple[]>([]);

  // Physics state for smooth, tight cursor tracking (zero lag)
  const pos = useRef({ x: -400, y: -400 });
  const target = useRef({ x: -400, y: -400 });
  const isVisible = useRef(false);
  const scale = useRef(1);
  const targetScale = useRef(1);
  const lastTargetEl = useRef<EventTarget | null>(null);

  useEffect(() => {
    // Skip entirely for lite/off hardware or reduced motion
    if (tier === "lite" || tier === "off") return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;

      if (!isVisible.current) {
        isVisible.current = true;
        pos.current.x = e.clientX;
        pos.current.y = e.clientY;
      }

      // Check element interactivity only when target element changes to avoid full-DOM queries on every pixel
      if (e.target !== lastTargetEl.current) {
        lastTargetEl.current = e.target;
        const targetEl = e.target as HTMLElement | null;
        if (targetEl) {
          const interactive = targetEl.closest(
            "button, a, input, textarea, select, [role='button'], .glass-dark, .glass-accent, .cursor-pointer"
          );
          targetScale.current = interactive ? 1.35 : 1.0;
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Spawn a floating color ripple on click
      const newRipple: FloatingRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 30 + 80,
        hue: Math.random() > 0.3 ? "rgba(224, 164, 92, 0.45)" : "rgba(242, 239, 232, 0.35)",
      };

      setRipples((prev) => [...prev.slice(-5), newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 1200);
    };

    const handleMouseLeave = () => {
      isVisible.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        target.current.x = t.clientX;
        target.current.y = t.clientY;
        if (!isVisible.current) {
          isVisible.current = true;
          pos.current.x = t.clientX;
          pos.current.y = t.clientY;
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        target.current.x = t.clientX;
        target.current.y = t.clientY;
        pos.current.x = t.clientX;
        pos.current.y = t.clientY;
        isVisible.current = true;

        const newRipple: FloatingRipple = {
          id: Date.now() + Math.random(),
          x: t.clientX,
          y: t.clientY,
          size: Math.random() * 30 + 70,
          hue: Math.random() > 0.3 ? "rgba(224, 164, 92, 0.45)" : "rgba(242, 239, 232, 0.35)",
        };
        setRipples((prev) => [...prev.slice(-5), newRipple]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 1200);
      }
    };

    const handleTouchEnd = () => {
      setTimeout(() => {
        isVisible.current = false;
      }, 600);
    };

    // Smooth animation loop using fast 0.35 spring lerp (tracks directly under cursor with zero lag)
    const loop = () => {
      if (auraRef.current && isVisible.current) {
        pos.current.x += (target.current.x - pos.current.x) * 0.35;
        pos.current.y += (target.current.y - pos.current.y) * 0.35;
        scale.current += (targetScale.current - scale.current) * 0.15;

        auraRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) scale(${scale.current.toFixed(3)})`;
        auraRef.current.style.opacity = "1";
      } else if (auraRef.current && !isVisible.current) {
        auraRef.current.style.opacity = "0";
      }
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [tier]);

  if (tier === "lite" || tier === "off") {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Luminous Floating Ambient Cursor Aura (GPU-accelerated, tracks directly beneath cursor) */}
      <div
        ref={auraRef}
        style={{
          top: 0,
          left: 0,
          opacity: 0,
          width: "360px",
          height: "360px",
          background: "radial-gradient(circle, rgba(224, 164, 92, 0.22) 0%, rgba(224, 164, 92, 0.08) 38%, transparent 70%)",
        }}
        className="fixed rounded-full will-change-transform transition-opacity duration-300 pointer-events-none"
      />

      {/* 2. Floating Color Touch / Click Ripples */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
            background: `radial-gradient(circle, ${ripple.hue} 0%, rgba(224, 164, 92, 0.12) 50%, transparent 75%)`,
          }}
          className="fixed -translate-x-1/2 -translate-y-1/2 rounded-full animate-float-ripple pointer-events-none"
        />
      ))}
    </div>
  );
}
