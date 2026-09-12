"use client";

import { useRef, useCallback } from "react";

/**
 * useTilt: Zero-state, direct-DOM 3D mouse parallax tilt.
 * 100% GPU-accelerated with zero virtual DOM re-renders.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(maxTilt = 6) {
  const ref = useRef<T>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      ref.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      ref.current.style.transition = "transform 0.1s ease-out";
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    ref.current.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
  }, []);

  return {
    ref,
    style: { willChange: "transform" as const },
    handleMouseMove,
    handleMouseLeave,
  };
}
