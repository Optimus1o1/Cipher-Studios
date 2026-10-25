'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SATELLITE_CONFIGS, SatelliteConfig } from './types';
import { SatelliteModel } from './SatelliteModels';
import { useOrbital } from '@/context/OrbitalContext';
import { getLunarPhase } from '@/lib/lunar';
import { orbitalCoordsBridge } from '@/lib/orbitalCoords';

interface OrbitalSystemProps {
  tier?: 'full' | 'lite' | 'off';
  isMobile: boolean;
}

interface LabelRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

export interface DomLimits {
  navBottom: number;
  webDesignLabelTop: number;
  webDesignLabelPaddedTop: number;
  detailTextRight: number;
  detailTextTop: number;
}

export interface SatelliteTelemetry {
  id: number;
  slug: string;
  name: string;
  worldPos: { x: number; y: number; z: number };
  screenPos: { x: number; y: number };
  insideFrustum: boolean;
  visible: boolean;
  opacity: number;
  scale: number;
  behindMoon: boolean;
  behindHeader: boolean;
  offScreen: boolean;
  culled: boolean;
  phaseRad: number;
  phaseDeg: number;
  orbitPlane: number;
  orbitRadius: number;
  baseAngle: number;
  orbitSpeed: number;
  gapToMoonDisc: number;
  marginToHeader: number;
  appliedOffsetWorldY: number;
  appliedOffsetPx: number;
  clearanceBelowNav: number;
  clearanceAboveLabel?: number;
}

// Single Satellite Controller managing orbital path vs magnification focus
function SatelliteItem({
  config,
  tier,
  isMobile,
  isSelected,
  isAnySelected,
  isHovered,
  labelRectsRef,
  domLimitsRef,
  onSelect,
  onHover,
}: {
  config: SatelliteConfig;
  tier: 'full' | 'lite' | 'off';
  isMobile: boolean;
  isSelected: boolean;
  isAnySelected: boolean;
  isHovered: boolean;
  labelRectsRef: React.MutableRefObject<LabelRect[]>;
  domLimitsRef: React.MutableRefObject<DomLimits>;
  onSelect: (slug: string) => void;
  onHover: (slug: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const scratchOrbitVec = useRef(new THREE.Vector3());
  const scratchProj = useRef(new THREE.Vector3());
  const { camera, size } = useThree();

  // Internal smooth animation state
  const currentPos = useRef(new THREE.Vector3());
  const currentRot = useRef(new THREE.Euler());
  const currentScale = useRef(1);
  const initialized = useRef(false);

  // 600ms pointer guard after mount
  const isReadyRef = useRef(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      isReadyRef.current = true;
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Per-satellite offset easing state (~500ms smooth response)
  const currentOffsetRef = useRef(0);

  // Orbital parameters calculation
  const planeRotation = useMemo(() => {
    // Two complementary balanced orbital planes
    if (config.orbitPlane === 0) {
      return new THREE.Euler(0.12, -0.14, 0.08);
    } else {
      return new THREE.Euler(-0.12, 0.16, -0.06);
    }
  }, [config.orbitPlane]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();
    const effectiveDelta = Math.min(0.1, delta);

    // Target satellites identification
    const isTopCentre = config.slug === 'web-development';
    const isTopRight = config.slug === 'web-design';
    const isTarget = isTopCentre || isTopRight;

    // Viewport projection metrics
    const visibleHalfHeight = Math.tan(THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov * 0.5)) * camera.position.z;
    const visibleHalfWidth = visibleHalfHeight * (size.width / size.height);
    const pixelsPerWorldUnit = (size.height * 0.5) / visibleHalfHeight;

    // Compute standard orbital position in 3D
    const angle = config.baseAngle + (tier === 'off' ? 0 : tier === 'lite' ? t * config.orbitSpeed * 0.4 : t * config.orbitSpeed);
    const r = config.orbitRadius;

    // Responsive orbital configuration:
    // On desktop, keep natural wide orbit (xMult = 1.05).
    // On mobile (narrow aspect ratio), adapt horizontal radius (xMult = 0.20) and scale (0.35) so satellites stay comfortably inside the 390px viewport.
    const xMult = isMobile ? 0.20 : 1.05;
    const yMult = 0.38;
    const localX = Math.cos(angle) * (r * xMult);
    const localY = Math.sin(angle) * (r * yMult);
    const localZ = Math.cos(angle * 2) * 0.45;

    scratchOrbitVec.current.set(localX, localY, localZ);
    scratchOrbitVec.current.applyEuler(planeRotation);

    // Target spatial coordinates
    let targetX = scratchOrbitVec.current.x;
    let targetY = scratchOrbitVec.current.y;
    let targetZ = scratchOrbitVec.current.z;

    // Responsive on-screen size (Mobile kept >= 0.6 of desktop scale 0.62)
    const ORBIT_BASE_SCALE = isMobile ? 0.40 : 0.62;
    let targetScale = ORBIT_BASE_SCALE;
    let targetRotX = 0;
    let targetRotY = 0;
    let targetRotZ = 0;

    if (isSelected) {
      // MAGNIFIED FOCUS STATE: Shifted right and scaled to never overlap text blocks
      if (isMobile) {
        targetX = 0;
        targetY = 0.62;
        targetZ = 2.4;
        targetScale = 0.65;

        // Runtime check: Ensure sat sits strictly above text block and below All services link
        const { detailTextTop } = domLimitsRef.current;
        if (detailTextTop < 9000) {
          const depthFactor = (camera.position.z - targetZ) / camera.position.z;
          const satHalfH = Math.max(40, 0.28 * targetScale * (pixelsPerWorldUnit / depthFactor));
          const projY = (-targetY / visibleHalfHeight * 0.5 + 0.5) * size.height;
          const bottomEdge = projY + satHalfH;
          if (bottomEdge > detailTextTop - 16) {
            const pushUpPx = bottomEdge - (detailTextTop - 16);
            targetY += (pushUpPx / pixelsPerWorldUnit) * depthFactor;
          }
        }
      } else {
        targetX = 1.82;
        targetY = -0.08;
        targetZ = 2.75;
        targetScale = 1.05;

        // Runtime check: Ensure sat left edge sits right of text block exclusion zone
        const { detailTextRight } = domLimitsRef.current;
        if (detailTextRight > 0) {
          const depthFactor = (camera.position.z - targetZ) / camera.position.z;
          const satHalfW = Math.max(160, 0.72 * targetScale * (pixelsPerWorldUnit / depthFactor));
          const projX = (targetX / visibleHalfWidth * 0.5 + 0.5) * size.width;
          const leftEdge = projX - satHalfW;
          if (leftEdge < detailTextRight + 44) {
            const pushRightPx = (detailTextRight + 44) - leftEdge;
            targetX += (pushRightPx / pixelsPerWorldUnit) * depthFactor;
          }
        }
      }

      targetRotX = -0.12 + Math.sin(t * 0.6) * 0.035;
      targetRotY = 0.38 + Math.cos(t * 0.5) * 0.045;
      targetRotZ = 0.03;
    } else {
      // NORMAL ORBITAL STATE
      // Project tentative position to screen
      scratchProj.current.set(targetX, targetY, targetZ).project(camera);
      let screenX = (scratchProj.current.x * 0.5 + 0.5) * size.width;
      let screenY = (-scratchProj.current.y * 0.5 + 0.5) * size.height;

      // 1. DYNAMIC PER-SATELLITE CLEARANCE LIMITS
      // Applied ONLY to the top satellites if they approach the navigation bar:
      let targetOffsetWorldY = 0;

      if (isTarget) {
        const { navBottom } = domLimitsRef.current;
        const navLimit = navBottom + 44; // minimum 40px (+4px buffer) below navigation bar's bottom edge

        const depthFactor = (camera.position.z - targetZ) / camera.position.z;
        const satHalfH = Math.max(40, 0.22 * (pixelsPerWorldUnit / depthFactor));

        if (isTopCentre || isTopRight) {
          // Highest projected point must sit at least 40px below navigation bar's bottom edge
          const topScreenY = screenY - satHalfH;
          if (topScreenY < navLimit) {
            const deficitPx = navLimit - topScreenY;
            targetOffsetWorldY = -(deficitPx / pixelsPerWorldUnit) * depthFactor;
          }
        }
      }

      // Smooth per-satellite offset easing over ~500ms (tau = 0.16s reaches ~95% in 0.48s)
      if (!initialized.current) {
        currentOffsetRef.current = targetOffsetWorldY;
      } else {
        const offsetDamp = 1.0 - Math.exp(-effectiveDelta / 0.16);
        currentOffsetRef.current += (targetOffsetWorldY - currentOffsetRef.current) * offsetDamp;
      }
      targetY += currentOffsetRef.current;

      // 2. MOON DISC SEPARATION (When Z >= 0 in front of Moon on desktop, keep projected bounding box >= 20px from Moon disc edge)
      if (!isMobile && targetZ >= 0) {
        scratchProj.current.set(targetX, targetY, targetZ).project(camera);
        screenX = (scratchProj.current.x * 0.5 + 0.5) * size.width;
        screenY = (-scratchProj.current.y * 0.5 + 0.5) * size.height;

        const moonCenterX = size.width * 0.5;
        const moonCenterY = size.height * 0.5;
        const moonScreenR = 2.125 * pixelsPerWorldUnit; // Moon 3D radius 1.7 * scale 1.25
        const satRadiusPx = 46;
        const minMoonClearancePx = moonScreenR + satRadiusPx + 20; // 20px clearance

        const dx = screenX - moonCenterX;
        const dy = screenY - moonCenterY;
        const distToMoon = Math.hypot(dx, dy);

        if (distToMoon < minMoonClearancePx) {
          const pushScale = minMoonClearancePx / Math.max(distToMoon, 1);
          const newScreenX = moonCenterX + dx * pushScale;
          const newScreenY = moonCenterY + dy * pushScale;
          const groupScale = 1.25;
          targetX += (newScreenX - screenX) / (pixelsPerWorldUnit * groupScale);
          targetY -= (newScreenY - screenY) / (pixelsPerWorldUnit * groupScale);
        }
      }

      if (isAnySelected) {
        targetScale = ORBIT_BASE_SCALE * 0.75;
      } else {
        targetScale = isHovered ? ORBIT_BASE_SCALE * 1.15 : ORBIT_BASE_SCALE;
      }

      // Orbital orientation: facing slightly toward camera while tracking trajectory
      const tangentX = -Math.sin(angle);
      const tangentY = Math.cos(angle);
      targetRotY = Math.atan2(tangentX, tangentY) * 0.3 + 0.2;
      targetRotX = -0.15 + Math.sin(t * 0.8 + config.id) * 0.05;
      targetRotZ = 0.04;
    }

    // Initialize immediate position on first frame to prevent flying in from origin
    if (!initialized.current) {
      currentPos.current.set(targetX, targetY, targetZ);
      currentRot.current.set(targetRotX, targetRotY, targetRotZ);
      currentScale.current = targetScale;
      initialized.current = true;
    } else {
      // Exponential damping for silky smooth 60fps transitions
      const lerpFactor = Math.min(1, effectiveDelta * 3.8);
      currentPos.current.x += (targetX - currentPos.current.x) * lerpFactor;
      currentPos.current.y += (targetY - currentPos.current.y) * lerpFactor;
      currentPos.current.z += (targetZ - currentPos.current.z) * lerpFactor;

      currentRot.current.x += (targetRotX - currentRot.current.x) * lerpFactor;
      currentRot.current.y += (targetRotY - currentRot.current.y) * lerpFactor;
      currentRot.current.z += (targetRotZ - currentRot.current.z) * lerpFactor;

      currentScale.current += (targetScale - currentScale.current) * lerpFactor;
    }

    groupRef.current.position.copy(currentPos.current);
    groupRef.current.rotation.copy(currentRot.current);
    groupRef.current.scale.setScalar(currentScale.current);
    groupRef.current.updateMatrixWorld(true);

    if (groupRef.current) {
      (camera as THREE.PerspectiveCamera).updateMatrixWorld();
      const worldVec = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldVec);
      const proj = worldVec.clone().project(camera);
      const screenX = Math.round((proj.x * 0.5 + 0.5) * size.width);
      const screenY = Math.round((-proj.y * 0.5 + 0.5) * size.height);
      const depthFactor = (camera.position.z - worldVec.z) / camera.position.z;
      const satHalfH = Math.round(Math.max(40, 0.22 * (pixelsPerWorldUnit / depthFactor)));
      const satWingHalfH = Math.round(Math.max(50, 0.26 * (pixelsPerWorldUnit / depthFactor)));

      const { navBottom, webDesignLabelPaddedTop } = domLimitsRef.current;
      const clearanceBelowNav = Math.round((screenY - satHalfH) - navBottom);
      const clearanceAboveLabel = Math.round(webDesignLabelPaddedTop - (screenY + satWingHalfH));
      const appliedOffsetPx = Math.round(currentOffsetRef.current * (pixelsPerWorldUnit / depthFactor));

      const offScreen = screenX < 0 || screenX > size.width || screenY < 0 || screenY > size.height;
      const marginToHeader = clearanceBelowNav;
      const behindHeader = marginToHeader < 40;

      const moonWorld = new THREE.Vector3(0, 0, 0);
      if (groupRef.current.parent) {
        groupRef.current.parent.getWorldPosition(moonWorld);
      }
      const moonProj = moonWorld.project(camera);
      const moonScreenX = Math.round((moonProj.x * 0.5 + 0.5) * size.width);
      const moonScreenY = Math.round((-moonProj.y * 0.5 + 0.5) * size.height);

      const moonScreenR = 2.125 * pixelsPerWorldUnit;
      const satRadiusPx = 46;
      const distFromMoonCenterScreen = Math.hypot(screenX - moonScreenX, screenY - moonScreenY);
      const gapToMoonDisc = Math.round(distFromMoonCenterScreen - moonScreenR - satRadiusPx);
      const behindMoon = worldVec.z < 0 && distFromMoonCenterScreen < (moonScreenR + satRadiusPx);

      const edgeOccluded = screenX < 40 || screenX > size.width - 40 || screenY < 40 || screenY > size.height - 40;

      // Compute exact silhouette bounds from projected mesh vertices (not a fixed box)
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      if (groupRef.current) {
        groupRef.current.updateWorldMatrix(true, true);
        const tempV = new THREE.Vector3();
        groupRef.current.traverse((child) => {
          if ((child as THREE.Mesh).isMesh && !child.name.startsWith('proxy-')) {
            const mesh = child as THREE.Mesh;
            const pos = mesh.geometry?.attributes?.position;
            if (pos) {
              const stride = pos.count > 100 ? Math.ceil(pos.count / 80) : 1;
              for (let i = 0; i < pos.count; i += stride) {
                tempV.fromBufferAttribute(pos, i);
                tempV.applyMatrix4(mesh.matrixWorld);
                tempV.project(camera);
                const vx = (tempV.x * 0.5 + 0.5) * size.width;
                const vy = (-tempV.y * 0.5 + 0.5) * size.height;
                if (vx < minX) minX = vx;
                if (vx > maxX) maxX = vx;
                if (vy < minY) minY = vy;
                if (vy > maxY) maxY = vy;
              }
            }
          }
        });
      }

      const silhouette = isFinite(minX) ? {
        minX: Math.round(minX),
        maxX: Math.round(maxX),
        minY: Math.round(minY),
        maxY: Math.round(maxY),
        width: Math.round(maxX - minX),
        height: Math.round(maxY - minY),
      } : undefined;

      // Publish live 2D screen coordinates to orbital coords bridge for floating labels
      orbitalCoordsBridge.updateSatellite({
        id: config.id,
        slug: config.slug,
        config,
        screenX,
        screenY,
        depthZ: worldVec.z,
        behindMoon,
        edgeOccluded,
        moonScreenX,
        moonScreenY,
        viewportWidth: size.width,
        viewportHeight: size.height,
        silhouette,
      });
    }
  });

  return (
    <group
      ref={groupRef}
      name={`satellite-${config.slug}`}
      onClick={(e) => {
        e.stopPropagation();
        if (!isReadyRef.current) return;
        onSelect(config.slug);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(config.slug);
        if (typeof document !== 'undefined') {
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        onHover(null);
        if (typeof document !== 'undefined') {
          document.body.style.cursor = 'auto';
        }
      }}
    >
      {/* Invisible clickable raycast proxy ensuring reliable pointer interaction (>=44px tappable target) */}
      <mesh
        name={`proxy-${config.slug}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!isReadyRef.current) return;
          onSelect(config.slug);
        }}
      >
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <SatelliteModel
        config={config}
        isSelected={isSelected}
        isHovered={isHovered}
      />
    </group>
  );
}

// Subtle orbital elliptical guide rings
function OrbitalGuideRings({ isMobile }: { isMobile?: boolean }) {
  const xMult = isMobile ? 0.20 : 1.05;
  const ringMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: 0x475569,
      transparent: true,
      opacity: 0.20,
      depthWrite: false,
    });
  }, []);

  return (
    <group>
      {/* Primary Orbital Plane Ring (scaled 0.38 Y) */}
      <mesh rotation={[0.12, -0.14, 0.08]} scale={[xMult, 0.38, 1.0]}>
        <torusGeometry args={[3.55, 0.0035, 4, 180]} />
        <primitive object={ringMat} attach="material" />
      </mesh>

      {/* Secondary Orbital Plane Ring (scaled 0.38 Y) */}
      <mesh rotation={[-0.12, 0.16, -0.06]} scale={[xMult, 0.38, 1.0]}>
        <torusGeometry args={[3.48, 0.0035, 4, 180]} />
        <primitive object={ringMat} attach="material" />
      </mesh>
    </group>
  );
}

export function OrbitalSystem({ tier = 'full', isMobile }: OrbitalSystemProps) {
  const { selectedSlug, hoveredSlug, selectService, setHoveredSlug, isServicesRoute } = useOrbital();
  const labelRectsRef = useRef<LabelRect[]>([]);
  const domLimitsRef = useRef<DomLimits>({
    navBottom: 72,
    webDesignLabelTop: 591.125,
    webDesignLabelPaddedTop: 551.125,
    detailTextRight: 0,
    detailTextTop: 9999,
  });

  // Query live DOM bounding boxes of navigation bar and service labels with 40px padding
  useEffect(() => {
    const updateRects = () => {
      if (typeof document === 'undefined') return;

      // 1. Measure Navigation Bar bottom edge
      let navBottom = 72;
      const navEl = document.querySelector('header') || document.querySelector('nav');
      if (navEl) {
        const nr = navEl.getBoundingClientRect();
        if (nr.height > 0) {
          navBottom = nr.bottom;
        }
      }

      // 2. Measure Website Design label top edge
      let webDesignLabelTop = 591.125;
      const allWebDesign = Array.from(document.querySelectorAll<HTMLElement>('[data-service-label="web-design"]'));
      const activeWebDesign = allWebDesign.find((el) => el.getBoundingClientRect().height > 0) || allWebDesign[0];
      if (activeWebDesign) {
        const wr = activeWebDesign.getBoundingClientRect();
        if (wr.height > 0) {
          webDesignLabelTop = wr.top;
        }
      }

      // 3. Measure detail page text exclusion zones
      let detailTextRight = 0;
      let detailTextTop = 9999;
      const h1 = document.querySelector('h1');
      const subtitle = document.querySelector('h1 + p');
      const meta = document.querySelector('.border-t.border-line');
      const buttons = document.querySelector('.pt-6.flex');

      [h1, subtitle, meta, buttons].forEach((el) => {
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            detailTextRight = Math.max(detailTextRight, r.right);
            detailTextTop = Math.min(detailTextTop, r.top);
          }
        }
      });

      domLimitsRef.current = {
        navBottom,
        webDesignLabelTop,
        webDesignLabelPaddedTop: webDesignLabelTop - 40,
        detailTextRight,
        detailTextTop,
      };

      // 3. Measure all service label bounding boxes with 40px padding
      const elements = document.querySelectorAll<HTMLElement>('[data-service-label]');
      const rects: LabelRect[] = [];
      const pad = 40; // 40-pixel padding on all sides per spec

      elements.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          rects.push({
            left: r.left - pad,
            right: r.right + pad,
            top: r.top - pad,
            bottom: r.bottom + pad,
            centerX: (r.left + r.right) * 0.5,
            centerY: (r.top + r.bottom) * 0.5,
            width: r.width + pad * 2,
            height: r.height + pad * 2,
          });
        }
      });
      labelRectsRef.current = rects;
    };

    updateRects();
    const timeout = setTimeout(updateRects, 100);
    const interval = setInterval(updateRects, 250);
    window.addEventListener('resize', updateRects, { passive: true });
    window.addEventListener('scroll', updateRects, { passive: true });

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      window.removeEventListener('resize', updateRects);
      window.removeEventListener('scroll', updateRects);
    };
  }, []);

  // Direction opposite Moon's astronomical sun direction for shadow-side fill light
  const shadowFillPos = useMemo<[number, number, number]>(() => {
    const lunarData = getLunarPhase(new Date());
    const sunAngle = (0.5 - lunarData.phase) * Math.PI * 2;
    const sunDist = 32;
    return [
      -Math.sin(sunAngle) * sunDist,
      -1.5,
      -Math.cos(sunAngle) * sunDist,
    ];
  }, []);

  // Sunward directional vector matching Moon's primary solar lighting for faint rim highlight
  const sunPosition = useMemo<[number, number, number]>(() => {
    const lunarData = getLunarPhase(new Date());
    const sunAngle = (0.5 - lunarData.phase) * Math.PI * 2;
    const sunDist = 32;
    return [
      Math.sin(sunAngle) * sunDist,
      3.5,
      Math.cos(sunAngle) * sunDist,
    ];
  }, []);

  // Reset pointer on unmount
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.cursor = 'auto';
      }
    };
  }, []);

  useFrame(() => {
    if (!isServicesRoute && !selectedSlug) {
      return;
    }

    // Broadcast updated satellite frame coordinates to floating labels subscribers
    orbitalCoordsBridge.notify();
  });

  // Only render orbital system on services routes or when navigating services
  if (!isServicesRoute && !selectedSlug) {
    return null;
  }

  const isAnySelected = selectedSlug !== null;

  return (
    <group position={[0, 0, 0]}>
      {/* Shadow-side directional fill light opposite Moon's astronomical sun direction */}
      <directionalLight
        position={shadowFillPos}
        color="#949ba6"
        intensity={0.20}
        castShadow={false}
      />

      {/* Sunward faint rim highlight on the sunward edge of each body matching Moon's directional light */}
      <directionalLight
        position={sunPosition}
        color="#fff4e6"
        intensity={0.18}
        castShadow={false}
      />

      {/* Delicate orbital trajectory lines */}
      <OrbitalGuideRings isMobile={isMobile} />

      {/* The Six Satellites */}
      {SATELLITE_CONFIGS.map((config) => (
        <SatelliteItem
          key={config.slug}
          config={config}
          tier={tier}
          isMobile={isMobile}
          isSelected={selectedSlug === config.slug}
          isAnySelected={isAnySelected}
          isHovered={hoveredSlug === config.slug}
          labelRectsRef={labelRectsRef}
          domLimitsRef={domLimitsRef}
          onSelect={(slug) => selectService(slug, true)}
          onHover={(slug) => setHoveredSlug(slug)}
        />
      ))}
    </group>
  );
}

