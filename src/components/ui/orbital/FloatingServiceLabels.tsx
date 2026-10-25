'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { SATELLITE_CONFIGS, SatelliteConfig } from '@/components/three/satellites/types';
import { orbitalCoordsBridge } from '@/lib/orbitalCoords';
import { useOrbital } from '@/context/OrbitalContext';
import { servicesData } from '@/data/services';
import { cn } from '@/lib/utils';

// Lookup map for exact text from services.ts
const SERVICES_MAP = new Map(servicesData.map((s) => [s.slug, s]));

interface FloatingServiceLabelsProps {
  heroRef?: React.RefObject<HTMLElement | null>;
}

export function FloatingServiceLabels({ heroRef }: FloatingServiceLabelsProps) {
  const { hoveredSlug, setHoveredSlug, selectedSlug, isServicesRoute, selectService } = useOrbital();
  const labelRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // 600ms mount pointer guard
  const isReadyRef = useRef(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      isReadyRef.current = true;
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Track hero visibility (fade out when user scrolls past the hero section)
  const isHeroVisibleRef = useRef(true);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      if (heroRef?.current) {
        const rect = heroRef.current.getBoundingClientRect();
        isHeroVisibleRef.current = rect.bottom > 140 && rect.top < window.innerHeight - 100;
      } else {
        isHeroVisibleRef.current = window.scrollY < 450;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [heroRef]);

  // Synchronize 3D projected coordinates to DOM labels at 60fps
  useEffect(() => {
    const unsubscribe = orbitalCoordsBridge.subscribe((coordsMap) => {
      if (typeof window === 'undefined') return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isNarrow = viewportWidth < 900;
      const isHeroVisible = isHeroVisibleRef.current;

      // 1. Gather preliminary candidate coordinates for all 6 satellites
      interface LabelCandidate {
        slug: string;
        config: SatelliteConfig;
        xSat: number;
        ySat: number;
        dxMoon: number;
        targetLeft: number;
        targetTop: number;
        width: number;
        height: number;
        isVisible: boolean;
        side: 'left' | 'right';
        panelPos: 'beside' | 'below';
      }

      const candidates: LabelCandidate[] = [];

      for (const config of SATELLITE_CONFIGS) {
        const data = coordsMap.get(config.slug);
        const el = labelRefs.current[config.slug];

        if (!data || !el) continue;

        // Label dimensions (compact text only)
        const w = el.offsetWidth || 160;
        const h = el.offsetHeight || 24;

        const xSat = data.screenX;
        const ySat = data.screenY;
        const dxMoon = xSat - data.moonScreenX;

        // Position 28px away from satellite on the side facing away from the Moon
        let targetLeft: number;
        let side: 'left' | 'right';

        if (dxMoon >= 0) {
          // Satellite is to the right of Moon -> place label 28px to the right
          targetLeft = xSat + 28;
          side = 'right';
          // Viewport boundary flip: if it extends past right margin, flip to left side
          if (targetLeft + w > viewportWidth - 20) {
            targetLeft = xSat - 28 - w;
            side = 'left';
          }
        } else {
          // Satellite is to the left of Moon -> place label 28px to the left
          targetLeft = xSat - 28 - w;
          side = 'left';
          // Viewport boundary flip: if it extends past left margin, flip to right side
          if (targetLeft < 20) {
            targetLeft = xSat + 28;
            side = 'right';
          }
        }

        // Center vertically on satellite
        let targetTop = ySat - h / 2;
        // Clamp vertically between top nav edge and bottom viewport
        const minTop = 82;
        const maxTop = viewportHeight - h - 16;
        targetTop = Math.max(minTop, Math.min(maxTop, targetTop));

        // Determine compact panel position (beside if space allows, otherwise below)
        const panelWidth = 260;
        const hasSpaceBeside =
          side === 'right'
            ? targetLeft + w + panelWidth + 16 < viewportWidth
            : targetLeft - panelWidth - 16 > 0;
        const panelPos: 'beside' | 'below' = hasSpaceBeside ? 'beside' : 'below';

        // Visibility rules:
        // Hide when within 40px of any viewport edge or behind the Moon
        const edgeOccluded =
          xSat < 40 ||
          xSat > viewportWidth - 40 ||
          ySat < 40 ||
          ySat > viewportHeight - 40;

        let isVisible = !edgeOccluded && !data.behindMoon && isHeroVisible;

        // Responsive Filter: Below 900px width, show only the active/targeted satellite label
        if (isNarrow) {
          const isTargeted =
            hoveredSlug === config.slug || selectedSlug === config.slug;
          if (!isTargeted) {
            isVisible = false;
          }
        }

        candidates.push({
          slug: config.slug,
          config,
          xSat,
          ySat,
          dxMoon,
          targetLeft,
          targetTop,
          width: w,
          height: h,
          isVisible,
          side,
          panelPos,
        });
      }

      // 2. Anti-Collision: Check pairwise AABB bounding boxes of visible labels
      // If two visible labels overlap, offset the lower one downward by up to 24px
      const visibleCandidates = candidates.filter((c) => c.isVisible);
      visibleCandidates.sort((a, b) => a.targetTop - b.targetTop);

      for (let i = 0; i < visibleCandidates.length; i++) {
        for (let j = i + 1; j < visibleCandidates.length; j++) {
          const a = visibleCandidates[i];
          const b = visibleCandidates[j];

          // Check horizontal overlap
          const overlapX =
            Math.max(a.targetLeft, b.targetLeft) <
            Math.min(a.targetLeft + a.width, b.targetLeft + b.width);

          if (overlapX) {
            // Check vertical proximity/overlap
            const verticalDeficit = a.targetTop + a.height + 8 - b.targetTop;
            if (verticalDeficit > 0) {
              const offset = Math.min(24, verticalDeficit);
              b.targetTop += offset;
            }
          }
        }
      }

      // 3. Apply computed coordinates & visibility directly to DOM elements
      // Dynamically order tabindex 1..N based on visual position (top-to-bottom)
      visibleCandidates.sort((a, b) => a.targetTop - b.targetTop || a.targetLeft - b.targetLeft);
      const visualOrderMap = new Map<string, number>();
      visibleCandidates.forEach((c, idx) => {
        visualOrderMap.set(c.slug, idx + 1);
      });

      for (const item of candidates) {
        const el = labelRefs.current[item.slug];
        if (!el) continue;

        // Smooth GPU transform
        el.style.transform = `translate3d(${Math.round(item.targetLeft)}px, ${Math.round(item.targetTop)}px, 0)`;

        // Opacity transition (300ms defined in CSS)
        el.style.opacity = item.isVisible ? '1' : '0';
        el.style.pointerEvents = item.isVisible ? 'auto' : 'none';

        // Tab order strictly follows visual order
        const assignedTab = item.isVisible ? String(visualOrderMap.get(item.slug) || 1) : '-1';
        el.setAttribute('tabindex', assignedTab);
        el.setAttribute('aria-hidden', item.isVisible ? 'false' : 'true');

        // Dynamic side indicator attribute for connector styling and panel orientation
        el.setAttribute('data-anchor-side', item.side);
        el.setAttribute('data-panel-pos', item.panelPos);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [hoveredSlug, selectedSlug]);

  // Synchronize 3D canvas hover state to DOM element classes
  useEffect(() => {
    for (const config of SATELLITE_CONFIGS) {
      const el = labelRefs.current[config.slug];
      if (el) {
        if (hoveredSlug === config.slug) {
          el.classList.add('is-canvas-hovered');
        } else {
          el.classList.remove('is-canvas-hovered');
        }
      }
    }
  }, [hoveredSlug]);

  if (!isServicesRoute) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden"
      aria-label="Orbital Service Instruments Fleet"
    >
      {/* Component-scoped connector line and compact panel positioning rules */}
      <style jsx>{`
        [data-anchor-side='right'] .satellite-connector-line {
          left: -28px;
          right: auto;
        }
        [data-anchor-side='left'] .satellite-connector-line {
          right: -28px;
          left: auto;
        }
        [data-anchor-side='right'][data-panel-pos='beside'] .service-description-panel {
          left: calc(100% + 12px);
          right: auto;
          top: 50%;
          transform: translateY(-50%);
        }
        [data-anchor-side='left'][data-panel-pos='beside'] .service-description-panel {
          right: calc(100% + 12px);
          left: auto;
          top: 50%;
          transform: translateY(-50%);
        }
        [data-anchor-side='right'][data-panel-pos='below'] .service-description-panel {
          left: 0;
          right: auto;
          top: calc(100% + 6px);
          transform: none;
        }
        [data-anchor-side='left'][data-panel-pos='below'] .service-description-panel {
          right: 0;
          left: auto;
          top: calc(100% + 6px);
          transform: none;
        }
        :global([data-floating-label]):hover .service-description-panel,
        :global([data-floating-label]:focus-visible) .service-description-panel,
        :global([data-floating-label].is-canvas-hovered) .service-description-panel {
          opacity: 1 !important;
        }
        :global([data-floating-label]):hover > span:not(.satellite-connector-line),
        :global([data-floating-label]:focus-visible) > span:not(.satellite-connector-line),
        :global([data-floating-label].is-canvas-hovered) > span:not(.satellite-connector-line) {
          color: #ffffff !important;
        }
      `}</style>

      {SATELLITE_CONFIGS.map((config) => {
        const service = SERVICES_MAP.get(config.slug);
        const title = service?.title || config.title;
        const intro = service?.intro || config.description;

        return (
          <Link
            key={config.slug}
            href={config.route}
            ref={(node) => {
              labelRefs.current[config.slug] = node;
            }}
            data-floating-label={config.slug}
            data-service-label={config.slug}
            aria-label={title}
            onClick={(e) => {
              if (!isReadyRef.current) {
                e.preventDefault();
                return;
              }
              e.preventDefault();
              selectService(config.slug, true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!isReadyRef.current) return;
                selectService(config.slug, true);
              }
            }}
            onMouseEnter={() => setHoveredSlug(config.slug)}
            onMouseLeave={() => setHoveredSlug(null)}
            onFocus={() => setHoveredSlug(config.slug)}
            onBlur={() => setHoveredSlug(null)}
            className={cn(
              'absolute top-0 left-0 w-max',
              'transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
              'opacity-0 pointer-events-none select-none',
              'group cursor-pointer',
              'focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e0a45c] focus-visible:ring-offset-2 focus-visible:ring-offset-black/60 rounded-sm'
            )}
            style={{
              willChange: 'transform, opacity',
            }}
          >
            {/* 1px Connector Line linking label to satellite anchor across the 28px offset */}
            <span
              className="satellite-connector-line absolute top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-200"
              style={{
                width: '28px',
                height: '1px',
                backgroundColor: config.accentColor,
                opacity: 0.85,
              }}
              aria-hidden="true"
            />

            {/* Service Name: Small uppercase monospace, 0.12em tracking, #ECEEF4 at 85% opacity, soft text shadow */}
            <span
              className="block font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.12em] text-[#ECEEF4]/85 transition-colors duration-200 group-hover:text-white group-focus-visible:text-white [&.is-canvas-hovered]:text-white"
              style={{
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.85), 0 0 10px rgba(0, 0, 0, 0.70)',
              }}
            >
              {title}
            </span>

            {/* Compact Description Panel (Revealed on hover or keyboard focus, 200ms fade-in, no scale change) */}
            <div
              className="service-description-panel absolute z-30 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 group-[.is-canvas-hovered]:opacity-100 transition-opacity duration-200 ease-out"
              style={{
                backgroundColor: 'rgba(5, 6, 13, 0.6)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                borderRadius: '8px',
                padding: '8px 12px',
                width: 'max-content',
                maxWidth: '260px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45), 0 0 1px rgba(255, 255, 255, 0.15)',
              }}
            >
              <p className="text-[11px] leading-snug text-[#8B9099] font-sans">
                {intro}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
