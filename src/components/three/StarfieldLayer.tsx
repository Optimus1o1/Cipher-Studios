"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { DeviceTier } from "@/types";

export interface StarfieldLayerProps {
  tier?: DeviceTier;
}

/**
 * StarfieldLayer: Restrained cosmic starfield backdrop.
 * Renders a THREE.Points cloud of 2000-4000 bone (#F2EFE8) points across depth range z: -20 to -2.
 * Extremely slow constant rotation gives a subtle sense of floating without distraction.
 */
export function StarfieldLayer({ tier = "full" }: StarfieldLayerProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // 3000 points on full tier, 800 on lite tier, 0 on off tier
  const count = tier === "lite" ? 800 : 3000;

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 56;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 56;
      // Distributed through large depth range z: -20 to -2
      pos[i * 3 + 2] = -20 + Math.random() * 18;
    }
    return [pos];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const dt = Math.min(delta, 0.033);
    // Extremely slow constant rotation
    pointsRef.current.rotation.y += dt * 0.006;
    pointsRef.current.rotation.x += dt * 0.003;
  });

  if (tier === "off") return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#F2EFE8"
        transparent
        opacity={0.32}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

export default StarfieldLayer;
