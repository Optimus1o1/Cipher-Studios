'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarfieldProps {
  isMobile?: boolean;
}

export function Starfield({ isMobile = false }: StarfieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = isMobile ? 500 : 1300;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2;
      const w = Math.acos(2 * Math.random() - 1);
      const q = 30 + Math.random() * 50;

      arr[i * 3] = q * Math.sin(w) * Math.cos(u);
      arr[i * 3 + 1] = q * Math.sin(w) * Math.sin(u);
      arr[i * 3 + 2] = q * Math.cos(w);
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.005;
      pointsRef.current.rotation.x += delta * 0.002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#dfe5f5"
        size={0.12}
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </points>
  );
}
