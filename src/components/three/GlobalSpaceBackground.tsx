"use client";

import React, { useMemo, useRef, useEffect, useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { heroProgressRef } from "@/hooks/useScrollBridge";
import { DeviceTier } from "@/types";

// Palette colors for cosmic floating blocks
const COLOR_INK_GLASS = new THREE.Color("#13141B");
const COLOR_BONE_MARK = new THREE.Color("#F2EFE8");
const COLOR_SLATE_BLOCK = new THREE.Color("#20232E");
const COLOR_COPPER_ACCENT = new THREE.Color("#E0A45C");
const COLOR_COPPER_GLOW = new THREE.Color("#FFC88A");

// Process formation target coordinates (3 rows: Decode, Build, Evolve)
const PROCESS_FORMATION_COORDS: { x: number; y: number; z: number }[] = [
  // Row 1 (Decode - active when p >= 0)
  { x: -1.5, y: 1.35, z: -4.5 },
  { x: 0.0,  y: 1.35, z: -4.5 },
  { x: 1.5,  y: 1.35, z: -4.5 },
  // Row 2 (Build - active when p >= 0.33)
  { x: -1.5, y: 0.0,  z: -4.5 },
  { x: 0.0,  y: 0.0,  z: -4.5 },
  { x: 1.5,  y: 0.0,  z: -4.5 },
  // Row 3 (Evolve - active when p >= 0.66)
  { x: -1.5, y: -1.35, z: -4.5 },
  { x: 0.0,  y: -1.35, z: -4.5 },
  { x: 1.5,  y: -1.35, z: -4.5 },
];

interface BlockItemData {
  id: string;
  gridX: number;
  gridY: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  scatterX: number;
  scatterY: number;
  scatterZ: number;
  scatterRotX: number;
  scatterRotY: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  baseRotX: number;
  baseRotY: number;
  baseRotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  floatSpeed: number;
  floatAmp: number;
  floatPhase: number;
  isCipherC: boolean;
  isCipherCopper: boolean;
  isCipherHollow: boolean;
  color: THREE.Color;
}

// 1. Instanced Floating Geometric Blocks Field (Single WebGL Draw Call for 60fps)
function FloatingBlocksField({ tier = "full" }: { tier: DeviceTier }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const scrollYRef = useRef(0);
  const smoothedScrollY = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const entranceRef = useRef(tier === "off" ? 0 : 1.0);

  // Track global page scroll and mouse coordinates
  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    const handlePointer = (e: MouseEvent) => {
      pointerRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handlePointer, { passive: true });
    scrollYRef.current = window.scrollY;

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handlePointer);
    };
  }, []);

  const SPACING = 1.38;

  // Pre-compute deterministic 8x6 grid with exact CIPHER brand coordinates
  const blocks = useMemo(() => {
    const list: BlockItemData[] = [];

    // Columns: c from -3.5 to +3.5 (8 cols: -3.5, -2.5, -1, 0, 1, 2.5, 3.5, 4.5)
    // Central columns for CIPHER mark: col = -1, 0, 1 (i.e. x = -1.38, 0, 1.38)
    const colCoords = [-4.6, -3.2, -1.38, 0, 1.38, 3.2, 4.6, 6.0];
    // Rows: 6 rows (y = 3.6, 2.4, 1.38, 0, -1.38, -2.8)
    // Central rows for CIPHER mark: row = 1.38 (top), 0 (mid), -1.38 (bottom)
    const rowCoords = [3.2, 1.38, 0, -1.38, -2.8, -4.2];

    for (let r = 0; r < rowCoords.length; r++) {
      for (let c = 0; c < colCoords.length; c++) {
        const id = `grid-${c}-${r}`;
        const baseX = colCoords[c];
        const baseY = rowCoords[r];

        // Central 3x3 CIPHER Matrix mapping:
        // c = 2 -> innerCol = 0 (left)
        // c = 3 -> innerCol = 1 (mid)
        // c = 4 -> innerCol = 2 (right)
        // r = 1 -> innerRow = 2 (top, y = 1.38)
        // r = 2 -> innerRow = 1 (mid, y = 0)
        // r = 3 -> innerRow = 0 (bottom, y = -1.38)
        const isCenterCol = c >= 2 && c <= 4;
        const isCenterRow = r >= 1 && r <= 3;
        const isWithinCenter = isCenterCol && isCenterRow;

        let isCipherC = false;
        let isCipherCopper = false;
        let isCipherHollow = false;

        if (isWithinCenter) {
          const innerCol = c - 2; // 0, 1, 2
          const innerRow = 3 - r; // 2 (top when r=1), 1 (mid when r=2), 0 (bottom when r=3)

          if (innerCol === 1 && innerRow === 1) {
            isCipherHollow = true; // Central hollow cell
          } else if (innerCol === 2 && innerRow === 1) {
            isCipherCopper = true; // Solitary copper accent cell at (2,1)
          } else {
            isCipherC = true; // 7 Bone cells forming the "C"
          }
        }

        // Pre-compute deterministic scatter trajectory for uncover animation
        const angle = c * 1.4 + r * 2.1;
        const radius = 2.4 + ((c + r) % 4) * 0.9;
        const scatterX = Math.cos(angle) * radius * 2.4;
        const scatterY = Math.sin(angle) * radius * 2.0;
        const scatterZ = Math.sin(angle * 1.5) * 3.5 - 2.0;
        const scatterRotX = Math.sin(angle) * 1.2;
        const scatterRotY = Math.cos(angle) * 1.2;

        let scale = 1.0;
        let color = COLOR_INK_GLASS;

        if (isCipherCopper) {
          color = COLOR_COPPER_ACCENT;
          scale = 1.06;
        } else if (isCipherC) {
          color = COLOR_BONE_MARK;
          scale = 1.0;
        } else if (isCipherHollow) {
          scale = 0.0; // Clean hollow space
        } else if ((c + r) % 2 === 0) {
          color = COLOR_SLATE_BLOCK;
          scale = 0.92;
        } else {
          color = COLOR_INK_GLASS;
          scale = 0.88;
        }

        list.push({
          id,
          gridX: c,
          gridY: r,
          baseX,
          baseY,
          baseZ: 0,
          scatterX,
          scatterY,
          scatterZ,
          scatterRotX,
          scatterRotY,
          scaleX: scale * 1.1,
          scaleY: scale * 1.1,
          scaleZ: scale * 0.48,
          baseRotX: ((c * 0.4 + r * 0.7) % Math.PI) * 0.25,
          baseRotY: ((c * 0.6 + r * 0.3) % Math.PI) * 0.25,
          baseRotZ: 0,
          rotSpeedX: (((c % 3) - 1) * 0.04),
          rotSpeedY: (((r % 3) - 1) * 0.05),
          rotSpeedZ: 0.02,
          floatSpeed: 0.25 + ((c + r) % 5) * 0.06,
          floatAmp: 0.35 + ((c * r) % 4) * 0.08,
          floatPhase: (c * 1.3 + r * 1.7) % (Math.PI * 2),
          isCipherC,
          isCipherCopper,
          isCipherHollow,
          color,
        });
      }
    }

    // Periphery ambient background blocks in "full" tier
    if (tier === "full") {
      for (let i = 0; i < 16; i++) {
        const id = `extra-${i}`;
        const xSign = i % 2 === 0 ? 1 : -1;
        const x = xSign * (7.5 + ((i * 1.8) % 12));
        const y = ((i / 16) - 0.5) * 36;
        const z = -12 - ((i * 2.5) % 18);

        const angle = i * 1.8;
        const scatterX = Math.cos(angle) * 4.5;
        const scatterY = Math.sin(angle) * 3.5;
        const scatterZ = -4;

        list.push({
          id,
          gridX: -1,
          gridY: -1,
          baseX: x,
          baseY: y,
          baseZ: z,
          scatterX,
          scatterY,
          scatterZ,
          scatterRotX: i * 0.5,
          scatterRotY: i * 0.7,
          scaleX: 1.15,
          scaleY: 1.15,
          scaleZ: 0.45,
          baseRotX: i * 0.4,
          baseRotY: i * 0.6,
          baseRotZ: 0,
          rotSpeedX: 0.03,
          rotSpeedY: 0.04,
          rotSpeedZ: 0.02,
          floatSpeed: 0.3 + (i % 4) * 0.05,
          floatAmp: 0.45 + (i % 3) * 0.1,
          floatPhase: (i * 1.4) % (Math.PI * 2),
          isCipherC: false,
          isCipherCopper: i === 7,
          isCipherHollow: false,
          color: i === 7 ? COLOR_COPPER_ACCENT : (i % 2 === 0 ? COLOR_SLATE_BLOCK : COLOR_INK_GLASS),
        });
      }
    }

    return list;
  }, [tier]);

  const blockCount = blocks.length;

  const animStates = useMemo(
    () =>
      blocks.map((b) => ({
        currentX: b.baseX,
        currentY: b.baseY,
        currentZ: b.baseZ,
        currentRotX: b.baseRotX,
        currentRotY: b.baseRotY,
        currentRotZ: b.baseRotZ,
        dx: 0,
        dy: 0,
      })),
    [blocks]
  );

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < blocks.length; i++) {
      meshRef.current.setColorAt(i, blocks[i].color);
      dummy.position.set(blocks[i].baseX, blocks[i].baseY, blocks[i].baseZ);
      dummy.scale.set(blocks[i].scaleX, blocks[i].scaleY, blocks[i].scaleZ);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [blocks, dummy]);

  // High-performance 60FPS Three.js render loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.033);
    const time = state.clock.elapsedTime;

    // Entrance convergence (smoothly damps from 1.0 down to 0.0 in ~1.2s on page load)
    entranceRef.current = THREE.MathUtils.damp(entranceRef.current, 0, 2.2, dt);
    const entrance = entranceRef.current;

    // Smooth scroll interpolation
    smoothedScrollY.current = THREE.MathUtils.damp(
      smoothedScrollY.current,
      scrollYRef.current,
      4.5,
      dt
    );
    const scrollVal = smoothedScrollY.current;

    // Smooth pointer tracking
    pointerRef.current.x = THREE.MathUtils.damp(
      pointerRef.current.x,
      pointerRef.current.targetX,
      4.5,
      dt
    );
    pointerRef.current.y = THREE.MathUtils.damp(
      pointerRef.current.y,
      pointerRef.current.targetY,
      4.5,
      dt
    );

    const mouseWorldX = pointerRef.current.x * (state.viewport.width * 0.55);
    const mouseWorldY = pointerRef.current.y * (state.viewport.height * 0.55);

    // Hero progress (0.0 to 1.0 from GSAP pinned timeline)
    const heroP = THREE.MathUtils.clamp(heroProgressRef.current, 0, 1);

    // Phase 1: Uncover scatter factor (0 -> 0.35)
    const uncoverFactor = heroP < 0.35
      ? Math.sin((heroP / 0.35) * Math.PI * 0.5) * 2.8
      : Math.min(4.5, 2.8 + (heroP - 0.35) * 4.0);

    // Phase 2: Right shift factor for CIPHER mark (0.35 -> 0.70)
    const rightShiftProgress = THREE.MathUtils.clamp((heroP - 0.35) / 0.35, 0, 1);
    const rightShift = Math.sin(rightShiftProgress * Math.PI * 0.5) * 3.4;

    // Phase 3: Transition to background drift (0.70 -> 1.0)
    const exitProgress = THREE.MathUtils.clamp((heroP - 0.70) / 0.30, 0, 1);

    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      const st = animStates[i];

      // Hollow cell remains invisible
      if (b.isCipherHollow) {
        dummy.position.set(0, -999, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        continue;
      }

      // Ambient Zero-G harmonic float & depth factor
      const floatY = Math.sin(time * b.floatSpeed + b.floatPhase) * b.floatAmp;
      const floatX = Math.cos(time * b.floatSpeed * 0.7 + b.floatPhase) * (b.floatAmp * 0.4);
      const depthFactor = 1 + (b.baseZ + 15) * 0.035;

      // Cosmic drift during entrance (first ~1.2s on page load)
      const cosmicDriftX = Math.sin(time * 0.8 + b.scatterRotX * 3) * 0.4 * entrance;
      const cosmicDriftY = Math.cos(time * 0.8 + b.scatterRotY * 3) * 0.4 * entrance;
      const cosmicDriftZ = Math.sin(time * 0.6 + b.scatterZ * 2) * 0.6 * entrance;

      const isCipher = b.isCipherC || b.isCipherCopper;

      // --- 1. HERO PINNED STAGE TARGETS ---
      let heroTargetX: number;
      let heroTargetY: number;
      let heroTargetZ: number;
      let heroRotX = 0;
      let heroRotY = 0;
      let heroRotZ = 0;
      let heroScale = 1.0;

      if (isCipher) {
        // CIPHER mark: assembled, uncovers, then shifts right next to wordmark
        heroTargetX = b.baseX + rightShift + b.scatterX * entrance * 1.5 + cosmicDriftX;
        heroTargetY = b.baseY + b.scatterY * entrance * 1.5 + cosmicDriftY + floatY * (1 - rightShiftProgress * 0.5);
        heroTargetZ = b.baseZ + b.scatterZ * entrance * 2.0 + cosmicDriftZ;
        if (b.isCipherCopper) {
          heroTargetZ += 0.2;
        }
        heroRotX = Math.sin(time * 1.2 + i * 0.3) * 0.05 * (1 - entrance);
        heroRotY = Math.cos(time * 1.2 + i * 0.3) * 0.05 * (1 - entrance);
      } else {
        // Non-CIPHER blocks: scatter outward during Phase 1 to uncover the mark
        heroTargetX = b.baseX + b.scatterX * (uncoverFactor + entrance * 1.5) + cosmicDriftX + floatX;
        heroTargetY = b.baseY + b.scatterY * (uncoverFactor + entrance * 1.5) + cosmicDriftY + floatY;
        heroTargetZ = b.baseZ + b.scatterZ * (uncoverFactor + entrance * 2.0) + cosmicDriftZ;
        heroRotX = b.scatterRotX * (uncoverFactor + entrance);
        heroRotY = b.scatterRotY * (uncoverFactor + entrance);
        heroScale = Math.max(0.3, 1.0 - (uncoverFactor / 3.5) * 0.4);
      }

      // Pointer Proximity Wave Effector when in hero (exitProgress < 0.7)
      if (exitProgress < 0.7) {
        const dx = mouseWorldX - heroTargetX;
        const dy = mouseWorldY - heroTargetY;
        const dist = Math.hypot(dx, dy);
        const EFFECTOR_RADIUS = 3.6;

        if (dist < EFFECTOR_RADIUS) {
          const influence = Math.max(0, 1 - dist / EFFECTOR_RADIUS);
          const waveLift = Math.pow(influence, 1.8) * (1 - exitProgress);
          heroTargetZ += waveLift * 1.7;
          heroRotX += -dy * waveLift * 0.16;
          heroRotY += dx * waveLift * 0.16;
        }
      }

      // --- 2. CONTINUOUS ZERO-G BACKGROUND FLOATING TARGETS ---
      // Spread across the full viewport so blocks drift behind all website sections
      const bgBaseX = isCipher
        ? b.baseX * 1.35 + b.scatterX * 0.45 + floatX
        : b.baseX * 1.3 + b.scatterX * 0.85 + floatX;

      // Viewport height in Three.js units is ~14.0 at z ~ -4.5
      const VIEWPORT_SPAN_Y = 13.5;
      const baseSpreadY = b.baseY * 1.35;
      // Upward parallax as page scrolls down
      const scrollDrift = -(scrollVal * 0.0016 * depthFactor);
      const rawY = baseSpreadY + scrollDrift + floatY;
      // Seamless toroidal modulo wrap within [-VIEWPORT_SPAN_Y / 2, +VIEWPORT_SPAN_Y / 2]
      const wrappedY = (((rawY + VIEWPORT_SPAN_Y * 100) % VIEWPORT_SPAN_Y) - (VIEWPORT_SPAN_Y * 0.5));

      const bgTargetX = bgBaseX;
      const bgTargetY = wrappedY;
      const bgTargetZ = -4.5 + (b.baseZ ? b.baseZ * 0.2 : 0) - Math.abs(b.floatPhase) * 0.6;

      const bgRotX = b.baseRotX + time * b.rotSpeedX;
      const bgRotY = b.baseRotY + time * b.rotSpeedY;
      const bgRotZ = b.baseRotZ + time * b.rotSpeedZ;
      const bgScale = 0.95;

      // --- 3. SEAMLESS INTERPOLATION HERO -> BACKGROUND ---
      let targetX = heroTargetX;
      let targetY = heroTargetY;
      let targetZ = heroTargetZ;
      let targetRotX = heroRotX;
      let targetRotY = heroRotY;
      let targetRotZ = heroRotZ;
      let currentScaleMult = heroScale;

      if (exitProgress > 0) {
        targetX = THREE.MathUtils.lerp(heroTargetX, bgTargetX, exitProgress);
        targetY = THREE.MathUtils.lerp(heroTargetY, bgTargetY, exitProgress);
        targetZ = THREE.MathUtils.lerp(heroTargetZ, bgTargetZ, exitProgress);
        targetRotX = THREE.MathUtils.lerp(heroRotX, bgRotX, exitProgress);
        targetRotY = THREE.MathUtils.lerp(heroRotY, bgRotY, exitProgress);
        targetRotZ = THREE.MathUtils.lerp(heroRotZ, bgRotZ, exitProgress);
        currentScaleMult = THREE.MathUtils.lerp(heroScale, bgScale, exitProgress);
      }

      // Boundary wrap compensation so blocks don't streak across screen when wrapping
      if (exitProgress > 0.5 && Math.abs(targetY - st.currentY) > VIEWPORT_SPAN_Y * 0.5) {
        st.currentY += targetY > st.currentY ? VIEWPORT_SPAN_Y : -VIEWPORT_SPAN_Y;
      }

      // Background mouse repulsion & deflection
      if (exitProgress > 0.3) {
        const distToMouse = Math.hypot(targetX - mouseWorldX, targetY - mouseWorldY);
        const repulsionRadius = 6.2;
        if (distToMouse < repulsionRadius && distToMouse > 0.1) {
          const force = Math.pow(1 - distToMouse / repulsionRadius, 2) * 1.5;
          const angle = Math.atan2(targetY - mouseWorldY, targetX - mouseWorldX);
          st.dx = THREE.MathUtils.damp(st.dx, Math.cos(angle) * force, 4.0, dt);
          st.dy = THREE.MathUtils.damp(st.dy, Math.sin(angle) * force, 4.0, dt);
        } else {
          st.dx = THREE.MathUtils.damp(st.dx, 0, 2.5, dt);
          st.dy = THREE.MathUtils.damp(st.dy, 0, 2.5, dt);
        }
        targetX += st.dx;
        targetY += st.dy;
      }

      // Physics Damping
      const dampSpeed = isCipher ? 5.5 : 4.0;
      st.currentX = THREE.MathUtils.damp(st.currentX, targetX, dampSpeed, dt);
      st.currentY = THREE.MathUtils.damp(st.currentY, targetY, dampSpeed, dt);
      st.currentZ = THREE.MathUtils.damp(st.currentZ, targetZ, dampSpeed, dt);
      st.currentRotX = THREE.MathUtils.damp(st.currentRotX, targetRotX, dampSpeed, dt);
      st.currentRotY = THREE.MathUtils.damp(st.currentRotY, targetRotY, dampSpeed, dt);
      st.currentRotZ = THREE.MathUtils.damp(st.currentRotZ, targetRotZ, dampSpeed, dt);

      // Copper Accent Breathing Pulse
      let copperScale = 1.0;
      if (b.isCipherCopper) {
        const copperPulse = 1.0 + Math.sin(time * 3.0) * 0.08;
        copperScale = copperPulse;

        if (meshRef.current && meshRef.current.instanceColor) {
          const glowFactor = 0.5 + 0.5 * Math.sin(time * 3.0);
          const cColor = COLOR_COPPER_ACCENT.clone().lerp(COLOR_COPPER_GLOW, glowFactor * 0.45);
          meshRef.current.setColorAt(i, cColor);
          meshRef.current.instanceColor.needsUpdate = true;
        }
      }

      dummy.position.set(st.currentX, st.currentY, st.currentZ);
      dummy.rotation.set(st.currentRotX, st.currentRotY, st.currentRotZ);
      dummy.scale.set(
        b.scaleX * currentScaleMult * copperScale,
        b.scaleY * currentScaleMult * copperScale,
        b.scaleZ * currentScaleMult * copperScale
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, blockCount]}
      frustumCulled={false}
    >
      <boxGeometry args={[1.1, 1.1, 0.46]} />
      <meshStandardMaterial
        roughness={0.25}
        metalness={0.38}
        envMapIntensity={0.9}
      />
    </instancedMesh>
  );
}

// 2. Camera Rig with Subtle Pointer Parallax & Multi-Axis Sway
function CameraRig({ tier }: { tier: DeviceTier }) {
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handlePointer = (e: MouseEvent) => {
      pointerRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handlePointer, { passive: true });
    return () => window.removeEventListener("mousemove", handlePointer);
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.033);
    const time = state.clock.elapsedTime;

    pointerRef.current.x = THREE.MathUtils.damp(
      pointerRef.current.x,
      pointerRef.current.targetX,
      3.2,
      dt
    );
    pointerRef.current.y = THREE.MathUtils.damp(
      pointerRef.current.y,
      pointerRef.current.targetY,
      3.2,
      dt
    );

    const breathingX = Math.sin(time * 0.32) * 0.18;
    const breathingY = Math.cos(time * 0.26) * 0.15;

    const swayMultiplier = tier === "full" ? 1.2 : 0.6;
    const targetCamX = pointerRef.current.x * swayMultiplier + breathingX;
    const targetCamY = pointerRef.current.y * (swayMultiplier * 0.7) + breathingY;

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetCamX, 2.8, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetCamY, 2.8, dt);
    state.camera.lookAt(0, 0, -4);
  });

  return null;
}

// 3. Deep Cosmic Starfield Cloud
function GlobalStarfield({ tier = "full" }: { tier: DeviceTier }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = tier === "lite" ? 350 : 1000;

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 58;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 68;
      pos[i * 3 + 2] = -38 + Math.random() * 32;
    }
    return [pos];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const dt = Math.min(delta, 0.033);
    pointsRef.current.rotation.y += dt * 0.008;
    pointsRef.current.rotation.x += dt * 0.004;
  });

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

const EXCLUDED_PAGE_PREFIXES = ["/admin"];

/**
 * GlobalSpaceBackground: Unified 3D WebGL Canvas for the entire website.
 * Contains:
 * - 8x6 interactive grid with pointer wave effector.
 * - Central 3x3 CIPHER representation (7 Bone C cells, 1 hollow cell, 1 Copper accent cell).
 * - Scroll uncover -> right-shift -> background downward drift into persistent zero-G float.
 * - Single draw call, zero duplicate canvases.
 */
export function GlobalSpaceBackground() {
  const pathname = usePathname();
  const tier = useDeviceTier();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isExcluded = pathname
    ? EXCLUDED_PAGE_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
      )
    : false;

  if (tier === "off" || !mounted || isExcluded) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-ink"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(224,164,92,0.06)_0%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#F2EFE8_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-ink select-none"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 48 }}
        frameloop="always"
        dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.5) : 1}
        gl={{
          antialias: true,
          powerPreference: "default",
          alpha: true,
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            "webglcontextlost",
            (event) => {
              event.preventDefault();
            },
            false
          );
        }}
        className="w-full h-full"
      >
        <CameraRig tier={tier} />
        <ambientLight intensity={0.85} />
        {/* Front direct light for crisp Bone and Copper highlights */}
        <directionalLight position={[0, 2, 10]} intensity={1.6} color="#FFFFFF" />
        {/* Soft cool directional light */}
        <directionalLight position={[-10, 12, 6]} intensity={1.3} color="#CED5E3" />
        {/* Warm key light */}
        <directionalLight position={[10, -8, 8]} intensity={1.5} color="#FFE6C2" />
        {/* Dedicated key lights on the CIPHER 3D matrix */}
        <pointLight position={[0, 0, 4.5]} intensity={3.0} color="#FFE6C2" distance={16} />
        <pointLight position={[2.4, 0, 3.2]} intensity={2.8} color="#E0A45C" distance={10} />

        <Suspense fallback={null}>
          <GlobalStarfield tier={tier} />
          <FloatingBlocksField tier={tier} />
        </Suspense>
      </Canvas>

      {/* Center Readability Vignette */}
      <div className="absolute inset-0 bg-radial-vignette opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-ink/60 pointer-events-none" />
    </div>
  );
}

export default GlobalSpaceBackground;
