"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BackgroundSceneProps {
  className?: string;
  intensity?: "normal" | "subtle" | "vibrant";
  withVignette?: boolean;
}

export function BackgroundScene({
  className,
  intensity = "normal",
  withVignette = true,
}: BackgroundSceneProps) {
  const opacityClass =
    intensity === "vibrant"
      ? "opacity-60"
      : intensity === "subtle"
      ? "opacity-25"
      : "opacity-40";

  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-ink",
        className
      )}
      aria-hidden="true"
    >
      {/* Dynamic ambient mesh gradients */}
      <div
        className={cn(
          "absolute -top-[25%] -left-[10%] w-[65vw] h-[65vw] rounded-full blur-[120px] bg-gradient-to-br from-copper/25 to-transparent transition-opacity duration-1000",
          opacityClass
        )}
      />
      <div
        className={cn(
          "absolute top-[40%] -right-[15%] w-[55vw] h-[55vw] rounded-full blur-[140px] bg-gradient-to-bl from-copper/15 to-transparent transition-opacity duration-1000",
          opacityClass
        )}
      />
      <div
        className={cn(
          "absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full blur-[130px] bg-gradient-to-t from-white/5 to-transparent transition-opacity duration-1000",
          opacityClass
        )}
      />

      {/* Vignette Layer */}
      {withVignette && (
        <div className="absolute inset-0 bg-radial-vignette opacity-80" />
      )}

      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-repeat bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
}
