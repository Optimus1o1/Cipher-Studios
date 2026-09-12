"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollProgressRef } from "@/hooks/useScrollBridge";
import { DeviceTier } from "@/types";

// Palette colors for cosmic floating blocks
const COLOR_INK_GLASS = new THREE.Color("#13141B");
const COLOR_BONE_MARK = new THREE.Color("#F2EFE8");
const COLOR_SLATE_BLOCK = new THREE.Color("#20232E");
const COLOR_COPPER_ACCENT = new THREE.Color("#E0A45C");
const COLOR_COPPER_GLOW = new THREE.Color("#FFC88A");

export interface BoxesHoverFieldProps {
  tier?: DeviceTier;
}

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

/**
 * BoxesHoverField: Interactive 3D box field for the CIPHER brand-reveal sequence.
 * On page load, plays entrance assembly from starfield drift into the centered 3x3 mark.
 * Driven by scrollProgressRef, scatters surrounding blocks and shifts the mark to the right.
 */
export function BoxesHoverField({ tier = "full" }: BoxesHoverFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const entranceFactorRef = useRef(tier === "off" ? 0 : 1.0); // 1.0 (drifting) -> 0.0 (assembled)

  // Track pointer coordinates for proximity wave
  useEffect(() => {
    const handlePointer = (e: MouseEvent) => {
      pointerRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handlePointer, { passive: true });
    return () => window.removeEventListener("mousemove", handlePointer);
  }, []);

  const blocks = useMemo(() => {
    const list: BlockItemData[] = [];
    const colCoords = [-4.6, -3.2, -1.38, 0, 1.38, 3.2, 4.6, 6.0];
    const rowCoords = [3.2, 1.38, 0, -1.38, -2.8, -4.2];

    for (let r = 0; r < rowCoords.length; r++) {
      for (let c = 0; c < colCoords.length; c++) {
        const id = `hero-${c}-${r}`;
        const baseX = colCoords[c];
        const baseY = rowCoords[r];

        const isCenterCol = c >= 2 && c <= 4;
        const isCenterRow = r >= 1 && r <= 3;
        const isWithinCenter = isCenterCol && isCenterRow;

        let isCipherC = false;
        let isCipherCopper = false;
        let isCipherHollow = false;

        if (isWithinCenter) {
          const innerCol = c - 2; // 0, 1, 2
          const innerRow = 3 - r; // 2 (top), 1 (mid), 0 (bottom)

          if (innerCol === 1 && innerRow === 1) {
            isCipherHollow = true; // Central hollow cell
          } else if (innerCol === 2 && innerRow === 1) {
            isCipherCopper = true; // Solitary copper accent cell at (2,1)
          } else {
            isCipherC = true; // 7 Bone cells forming the "C"
          }
        }

        const angle = c * 1.4 + r * 2.1;
        const radius = 1.4 + ((c + r) % 3) * 0.7;
        const scatterX = Math.cos(angle) * radius * 1.2;
        const scatterY = Math.sin(angle) * radius * 1.0;
        const scatterZ = Math.sin(angle * 1.5) * 1.2 - 0.2;
        const scatterRotX = Math.sin(angle) * 0.8;
        const scatterRotY = Math.cos(angle) * 0.8;

        let scale = 1.0;
        let color = COLOR_INK_GLASS;

        if (isCipherCopper) {
          color = COLOR_COPPER_ACCENT;
          scale = 1.08;
        } else if (isCipherC) {
          color = COLOR_BONE_MARK;
          scale = 1.0;
        } else if (isCipherHollow) {
          scale = 0.0;
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
    return list;
  }, []);

  const blockCount = blocks.length;

  const animStates = useMemo(
    () =>
      blocks.map((b) => ({
        currentX: b.baseX + b.scatterX * 1.2,
        currentY: b.baseY + b.scatterY * 1.2,
        currentZ: b.baseZ + b.scatterZ * 1.4,
        currentRotX: b.scatterRotX,
        currentRotY: b.scatterRotY,
        currentRotZ: 0,
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

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.033);
    const time = state.clock.elapsedTime;

    // 1. Entrance convergence from starfield drift into 3x3 mark
    if (entranceFactorRef.current > 0.001) {
      entranceFactorRef.current = THREE.MathUtils.damp(entranceFactorRef.current, 0, 4.2, dt);
    }
    const entrance = entranceFactorRef.current;

    // 2. Read scroll progress directly from mutable ref (zero React re-renders)
    const p = THREE.MathUtils.clamp(scrollProgressRef.current, 0, 1);

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

    // Phase 1: Uncover scatter factor for surrounding blocks (0 -> 0.30)
    const uncoverFactor = p < 0.30
      ? Math.sin((p / 0.30) * Math.PI * 0.5) * 3.2
      : Math.min(4.8, 3.2 + (p - 0.30) * 4.0);

    // Dynamic measurement of the exact DOM mark position and scale
    const pxToWorld = state.viewport.width / (typeof window !== "undefined" ? window.innerWidth : 1440);
    const domMark = typeof document !== "undefined" ? document.getElementById("hero-overlay-mark") : null;
    let targetShiftX = -3.85;
    let targetMarkScale = 0.53;

    if (domMark) {
      const rect = domMark.getBoundingClientRect();
      const markCenterX = rect.left + rect.width / 2;
      const screenCenterX = window.innerWidth / 2;
      const deltaPx = markCenterX - screenCenterX;
      targetShiftX = deltaPx * pxToWorld;

      // Native 3D mark width is 3.86 world units
      const targetWorldWidth = rect.width * pxToWorld;
      targetMarkScale = targetWorldWidth / 3.86;
    }

    // Smooth horizontal shift for 3D mark so it glides directly into the 2D mark position
    const markShiftX = p < 0.30
      ? Math.sin((p / 0.30) * Math.PI * 0.5) * targetShiftX
      : targetShiftX;

    // Smooth scale adjustment to match the 2D mark size exactly
    const cipherMarkScale = p < 0.30
      ? 1.0 - Math.sin((p / 0.30) * Math.PI * 0.5) * (1.0 - targetMarkScale)
      : targetMarkScale;

    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      const st = animStates[i];

      if (b.isCipherHollow) {
        dummy.position.set(0, -999, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
        continue;
      }

      // Starfield cosmic drift during entrance
      const cosmicDriftX = Math.sin(time * 0.8 + b.scatterRotX * 3) * 0.4 * entrance;
      const cosmicDriftY = Math.cos(time * 0.8 + b.scatterRotY * 3) * 0.4 * entrance;
      const cosmicDriftZ = Math.sin(time * 0.6 + b.scatterZ * 2) * 0.6 * entrance;

      const isCipher = b.isCipherC || b.isCipherCopper;

      let targetX = b.baseX + b.scatterX * entrance * 1.5 + cosmicDriftX;
      let targetY = b.baseY + b.scatterY * entrance * 1.5 + cosmicDriftY;
      let targetZ = b.baseZ + b.scatterZ * entrance * 2.0 + cosmicDriftZ;
      let targetRotX = b.scatterRotX * entrance;
      let targetRotY = b.scatterRotY * entrance;
      let targetRotZ = 0;
      let currentScaleMult = 1.0;

      if (isCipher) {
        // CIPHER mark stays assembled, shifts left, and calibrates scale to form lockup beside wordmark
        targetX = b.baseX * cipherMarkScale + markShiftX + b.scatterX * entrance * 1.5 + cosmicDriftX;
        targetY = b.baseY * cipherMarkScale + b.scatterY * entrance * 1.5 + cosmicDriftY;
        targetZ = b.baseZ + b.scatterZ * entrance * 2.0 + cosmicDriftZ;
        currentScaleMult = cipherMarkScale;

        if (b.isCipherCopper) {
          targetZ += 0.15;
        }

        targetRotX = Math.sin(time * 1.2 + i * 0.3) * 0.04 * (1 - entrance);
        targetRotY = Math.cos(time * 1.2 + i * 0.3) * 0.04 * (1 - entrance);
      } else {
        // Non-CIPHER blocks scatter outward into deep space to uncover CIPHER
        targetX = b.baseX + b.scatterX * (uncoverFactor + entrance * 1.5) + cosmicDriftX;
        targetY = b.baseY + b.scatterY * (uncoverFactor + entrance * 1.5) + cosmicDriftY;
        targetZ = b.baseZ + b.scatterZ * (uncoverFactor + entrance * 2.0) + cosmicDriftZ;
        targetRotX = b.scatterRotX * (uncoverFactor + entrance);
        targetRotY = b.scatterRotY * (uncoverFactor + entrance);

        currentScaleMult = Math.max(0.3, 1.0 - (uncoverFactor / 3.5) * 0.4);
      }

      // Pointer Proximity Wave Effector
      const dx = mouseWorldX - targetX;
      const dy = mouseWorldY - targetY;
      const dist = Math.hypot(dx, dy);
      const EFFECTOR_RADIUS = 3.6;

      if (dist < EFFECTOR_RADIUS) {
        const influence = Math.max(0, 1 - dist / EFFECTOR_RADIUS);
        const waveLift = Math.pow(influence, 1.8);
        targetZ += waveLift * 1.65;
        targetRotX += -dy * waveLift * 0.16;
        targetRotY += dx * waveLift * 0.16;
      }

      const dampSpeed = isCipher ? 5.5 : 4.0;
      st.currentX = THREE.MathUtils.damp(st.currentX, targetX, dampSpeed, dt);
      st.currentY = THREE.MathUtils.damp(st.currentY, targetY, dampSpeed, dt);
      st.currentZ = THREE.MathUtils.damp(st.currentZ, targetZ, dampSpeed, dt);
      st.currentRotX = THREE.MathUtils.damp(st.currentRotX, targetRotX, dampSpeed, dt);
      st.currentRotY = THREE.MathUtils.damp(st.currentRotY, targetRotY, dampSpeed, dt);
      st.currentRotZ = THREE.MathUtils.damp(st.currentRotZ, targetRotZ, dampSpeed, dt);

      let copperScale = 1.0;
      if (b.isCipherCopper) {
        const copperPulse = 1.0 + Math.sin(time * 3.2) * 0.08;
        copperScale = copperPulse;

        if (meshRef.current && meshRef.current.instanceColor) {
          const glowFactor = 0.5 + 0.5 * Math.sin(time * 3.2);
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

export default BoxesHoverField;
