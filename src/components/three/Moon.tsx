'use client';

import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Starfield } from './Starfield';
import { getLunarPhase, type LunarPhaseData } from '@/lib/lunar';

import { createCubicMoonGeometry } from '@/lib/lunarCubicGeometry';

import { OrbitalSystem } from './satellites/OrbitalSystem';

interface MoonProps {
  isServicePage?: boolean;
  tier?: 'full' | 'lite' | 'off';
}

function SatelliteMoonMesh({
  isMobile,
  lunarData,
  tier,
  scrollRef,
  pointerRef,
  isServicePage,
}: {
  isMobile: boolean;
  lunarData: LunarPhaseData;
  tier: 'full' | 'lite' | 'off';
  scrollRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  isServicePage: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const currentPos = useRef({ x: 0, y: 0, scale: 1 });

  // Load authentic 2K photorealistic cubic projection textures
  const [diffuseMap, bumpMap] = useLoader(THREE.TextureLoader, [
    '/textures/moon/Diffuse_2K.jpg',
    '/textures/moon/Bump_2K.jpg',
  ]);

  useMemo(() => {
    if (diffuseMap) {
      diffuseMap.colorSpace = THREE.SRGBColorSpace;
      diffuseMap.generateMipmaps = true;
      diffuseMap.minFilter = THREE.LinearMipmapLinearFilter;
      diffuseMap.magFilter = THREE.LinearFilter;
    }
    if (bumpMap) {
      bumpMap.generateMipmaps = true;
      bumpMap.minFilter = THREE.LinearMipmapLinearFilter;
      bumpMap.magFilter = THREE.LinearFilter;
    }
  }, [diffuseMap, bumpMap]);

  // Spherified cubic geometry with uniform texel density and zero pole distortion
  const cubicGeometry = useMemo(() => {
    return createCubicMoonGeometry(1.7, isMobile ? 3 : 4);
  }, [isMobile]);

  useFrame((state, delta) => {
    const sc = scrollRef.current;
    const mx = pointerRef.current.x;
    const my = pointerRef.current.y;
    const elapsedTime = state.clock.getElapsedTime();

    // Target position calculation based on mobile & route state
    let targetX = 0;
    let targetY = 0;
    let targetScale = 1;

    if (isMobile) {
      targetX = 0;
      targetY = isServicePage && sc < 0.1 ? 0.3 : 1.3 - sc * 1.1;
      targetScale = isServicePage && sc < 0.1 ? 1.05 : 0.85;
    } else {
      if (isServicePage) {
        // Center Moon at top of services page for the 3D orbital fleet (matching reference art)
        if (sc < 0.12) {
          targetX = 0;
          targetY = 0;
          targetScale = 1.25;
        } else {
          // Smoothly glide aside when scrolling to service cards
          targetX = 2.4;
          targetY = 0.1;
          targetScale = 1.05;
        }
      } else {
        // Natural lunar orbital trajectory across home page sections
        targetX = 2.2 * Math.cos(sc * Math.PI * 1.8);
        targetY = 0.05 + Math.sin(sc * Math.PI * 1.6) * 0.35;
        targetScale = 1.12;
      }
    }

    // Damp position coordinates smoothly
    const dampFactor = Math.min(1, delta * 3.5);
    currentPos.current.x += (targetX - currentPos.current.x) * dampFactor;
    currentPos.current.y += (targetY - currentPos.current.y) * dampFactor;
    currentPos.current.scale += (targetScale - currentPos.current.scale) * dampFactor;

    if (groupRef.current) {
      groupRef.current.position.set(currentPos.current.x, currentPos.current.y, 0);
      groupRef.current.scale.setScalar(currentPos.current.scale);
    }

    if (moonRef.current) {
      // 1. Lunar obliquity / axial tilt: ~1.54° (0.0269 rad) + real-time latitude libration
      moonRef.current.rotation.x = 0.0269 + lunarData.libration.lat;

      // 2. Near-side is aligned canonically to +Z. Add longitude libration + progression + scroll
      const orbitalProgression = tier === 'full' ? elapsedTime * 0.012 : 0;
      const scrollRotation = sc * 1.65;
      moonRef.current.rotation.y = lunarData.libration.lon + orbitalProgression + scrollRotation;

      // Subtle orbital precession
      moonRef.current.rotation.z = -0.018;
    }

    // Camera pointer parallax
    if (tier === 'full') {
      const camTargetX = mx * 0.45;
      const camTargetY = -my * 0.35;
      camera.position.x += (camTargetX - camera.position.x) * Math.min(1, delta * 2.5);
      camera.position.y += (camTargetY - camera.position.y) * Math.min(1, delta * 2.5);
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={moonRef} geometry={cubicGeometry}>
        <meshStandardMaterial
          map={diffuseMap}
          bumpMap={bumpMap}
          bumpScale={0.065}
          roughness={0.93}
          metalness={0.02}
        />
      </mesh>
    </group>
  );
}

export function MoonSceneContent({ isServicePage = false, tier = 'full' }: MoonProps) {
  const { size } = useThree();
  const isMobile = size.width < 860;

  // Refs for high-performance input reading inside useFrame without React re-render loops
  const pointerRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  // Real-time astronomical lunar calculations
  const [lunarData, setLunarData] = useState<LunarPhaseData>(() => getLunarPhase());

  useEffect(() => {
    // Refresh astronomical phase calculation periodically (every 5 minutes)
    const interval = setInterval(() => {
      setLunarData(getLunarPhase());
    }, 300000);

    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) - 0.5;
      pointerRef.current.y = (e.clientY / window.innerHeight) - 0.5;
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Compute real-time solar directional lighting vector:
  // Phase 0.0 (New) -> Sun is behind (-Z)
  // Phase 0.25 (First Quarter) -> Sun is at +X (right limb lit)
  // Phase 0.5 (Full) -> Sun is in front (+Z)
  // Phase 0.75 (Last Quarter) -> Sun is at -X (left limb lit)
  const sunPosition = useMemo(() => {
    const sunDist = 32;
    const angle = (0.5 - lunarData.phase) * Math.PI * 2;
    const x = Math.sin(angle) * sunDist;
    const z = Math.cos(angle) * sunDist;
    const y = 3.5;
    return new THREE.Vector3(x, y, z);
  }, [lunarData.phase]);

  return (
    <>
      {/* Deep space cosmic background glow */}
      <ambientLight color="#0a0e1c" intensity={0.25} />

      {/* Earthshine: Authentic faint blue-gray reflection from Earth illuminating unlit maria */}
      <directionalLight
        position={[0, 0, 16]}
        color="#151e33"
        intensity={0.42}
        castShadow={false}
      />

      {/* Primary Solar Vector: Angles in physical real-time to match today's lunar phase */}
      <directionalLight
        position={sunPosition}
        color="#fff4e6"
        intensity={3.8}
        castShadow={false}
      />

      {/* Starfield in deep background */}
      <Starfield isMobile={isMobile} />

      {/* Interactive 3D Orbital Satellites Fleet */}
      <OrbitalSystem tier={tier} isMobile={isMobile} />

      {/* Satellite Moon mesh */}
      <Suspense fallback={null}>
        <SatelliteMoonMesh
          isMobile={isMobile}
          lunarData={lunarData}
          tier={tier}
          scrollRef={scrollRef}
          pointerRef={pointerRef}
          isServicePage={isServicePage}
        />
      </Suspense>
    </>
  );
}
