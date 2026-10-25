'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Monitor,
  Code2,
  Search,
  Megaphone,
  PenTool,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { SATELLITE_CONFIGS, SatelliteConfig } from '@/components/three/satellites/types';
import { orbitalCoordsBridge, SatelliteScreenCoord } from '@/lib/orbitalCoords';
import { useOrbital } from '@/context/OrbitalContext';
import { cn } from '@/lib/utils';

// Lucide icon mapping
const ICON_MAP: Record<SatelliteConfig['iconType'], React.ElementType> = {
  design: Monitor,
  dev: Code2,
  seo: Search,
  marketing: Megaphone,
  branding: PenTool,
  care: ShieldCheck,
};

interface FloatingServiceLabelsProps {
  heroRef?: React.RefObject<HTMLElement | null>;
}

export function FloatingServiceLabels({ heroRef }: FloatingServiceLabelsProps) {
  const router = useRouter();
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
        // Visible if hero occupies meaningful vertical space on screen
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
      }

      const candidates: LabelCandidate[] = [];

      for (const config of SATELLITE_CONFIGS) {
        const data = coordsMap.get(config.slug);
        const el = labelRefs.current[config.slug];

        if (!data || !el) continue;

        const w = el.offsetWidth || 230;
        const h = el.offsetHeight || 68;

        const xSat = data.screenX;
        const ySat = data.screenY;
        const dxMoon = xSat - data.moonScreenX;

        // Position 28px away from satellite center along the Moon ray
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

        // Visibility rules:
        // Hide when within 40px of any viewport edge or behind the Moon
        const edgeOccluded =
          xSat < 40 ||
          xSat > viewportWidth - 40 ||
          ySat < 40 ||
          ySat > viewportHeight - 40;

        let isVisible = !edgeOccluded && !data.behindMoon && isHeroVisible;

        // Responsive Filter: Below 900px width, show only the active/hovered satellite label
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

        // Dynamic side indicator attribute for connector styling
        el.setAttribute('data-anchor-side', item.side);
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
      {SATELLITE_CONFIGS.map((config) => {
        const Icon = ICON_MAP[config.iconType];

        return (
          <Link
            key={config.slug}
            href={config.route}
            ref={(node) => {
              labelRefs.current[config.slug] = node;
            }}
            data-floating-label={config.slug}
            data-service-label={config.slug}
            aria-label={config.title}
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
              'absolute top-0 left-0 w-max max-w-[245px] sm:max-w-[265px]',
              'rounded-[14px] px-3.5 py-2.5',
              'bg-[#05060d]/60 backdrop-blur-md border border-white/10',
              'transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
              'transition-[background-color,border-color,box-shadow] duration-200 ease-out',
              'opacity-0 pointer-events-none select-none',
              'group cursor-pointer',
              'hover:bg-[#0f121e]/85 hover:border-[#e0a45c]/30',
              'hover:shadow-[0_0_12px_rgba(224,164,92,0.20),inset_0_0_0_1px_rgba(224,164,92,0.20)]',
              '[&.is-canvas-hovered]:bg-[#0f121e]/85 [&.is-canvas-hovered]:border-[#e0a45c]/30',
              '[&.is-canvas-hovered]:shadow-[0_0_12px_rgba(224,164,92,0.20),inset_0_0_0_1px_rgba(224,164,92,0.20)]',
              'focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e0a45c] focus-visible:border-[#e0a45c]'
            )}
            style={{
              willChange: 'transform, opacity',
            }}
          >
            {/* Header: Icon + Number + Status Dot */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                <span
                  className="p-1 rounded-md border border-white/10 bg-white/5 text-mute group-hover:text-white transition-colors"
                  style={{ borderColor: `${config.accentColor}40` }}
                >
                  <Icon className="size-3.5" style={{ color: config.accentColor }} />
                </span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-mute/80 group-hover:text-mute">
                  {config.number}
                </span>
              </div>
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0 group-hover:animate-ping"
                style={{ background: config.accentColor }}
                aria-hidden="true"
              />
            </div>

            {/* Title */}
            <h3
              className="font-mono text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider text-[#F2EFE8] group-hover:text-white truncate transition-colors"
              style={{
                color: hoveredSlug === config.slug ? config.accentColor : undefined,
              }}
            >
              {config.title}
            </h3>

            {/* Tagline */}
            <p className="text-[11px] text-[#8B9099] leading-tight line-clamp-1 mt-0.5 group-hover:text-white/80 transition-colors">
              {config.tagline}
            </p>

            {/* Quick Inspect Arrow */}
            <div className="mt-1 flex items-center justify-between text-[9px] font-mono text-[#e0a45c]/80 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Inspect</span>
              <ChevronRight className="size-3 text-[#e0a45c]" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
