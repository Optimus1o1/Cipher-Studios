"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { StarfieldLayer } from "./StarfieldLayer";
import { BoxesHoverField } from "./BoxesHoverField";
import { DeviceTier } from "@/types";

export interface HeroCanvasProps {
  tier?: DeviceTier;
}

/**
 * HeroCanvas: Dedicated R3F WebGL canvas for the CIPHER brand-reveal sequence.
 * Composes StarfieldLayer (Bone #F2EFE8 point cloud) and BoxesHoverField (3x3 mark + wave physics).
 * Clamps DPR to 1.5 and unmounts cleanly when the sequence docks into GlassNav.
 */
export function HeroCanvas({ tier = "full" }: HeroCanvasProps) {
  if (tier === "off") return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 48 }}
      frameloop={tier === "lite" ? "demand" : "always"}
      dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.5) : 1}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: true,
      }}
      className="w-full h-full"
    >
      <ambientLight intensity={0.85} />
      {/* Front direct light for crisp Bone and Copper highlights */}
      <directionalLight position={[0, 2, 10]} intensity={1.6} color="#FFFFFF" />
      {/* Soft cool directional light */}
      <directionalLight position={[-10, 12, 6]} intensity={1.3} color="#CED5E3" />
      {/* Warm key light */}
      <directionalLight position={[10, -8, 8]} intensity={1.5} color="#FFE6C2" />
      {/* Dedicated point lights on the CIPHER 3D matrix */}
      <pointLight position={[0, 0, 4.5]} intensity={3.0} color="#FFE6C2" distance={16} />
      <pointLight position={[2.4, 0, 3.2]} intensity={2.8} color="#E0A45C" distance={10} />

      <Suspense fallback={null}>
        <StarfieldLayer tier={tier} />
        <BoxesHoverField tier={tier} />
      </Suspense>
    </Canvas>
  );
}

export default HeroCanvas;
