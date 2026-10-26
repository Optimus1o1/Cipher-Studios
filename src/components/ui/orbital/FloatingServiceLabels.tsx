'use client';

import React, { useEffect, useRef } from 'react';
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

interface ConnectorCoords {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface LabelCandidate {
  slug: string;
  config: SatelliteConfig;
  xSat: number;
  ySat: number;
  targetLeft: number;
  targetTop: number;
  width: number;
  height: number;
  isVisible: boolean;
  side: 'left' | 'right';
  panelPos: 'beside' | 'below';
  connector?: ConnectorCoords;
  hiddenReason?: string;
}

interface NoGoZone {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  name: string;
}

export function FloatingServiceLabels({ heroRef }: FloatingServiceLabelsProps) {
  const { hoveredSlug, setHoveredSlug, selectedSlug, isServicesRoute, selectService } = useOrbital();
  const labelRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const lineRefs = useRef<Record<string, SVGLineElement | null>>({});

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

  // Track no-go zones: navbar, eyebrow, headline, subtitle, hint (+16px padding)
  const noGoZonesRef = useRef<NoGoZone[]>([]);

  useEffect(() => {
    const updateNoGoZones = () => {
      if (typeof window === 'undefined') return;
      const zones: NoGoZone[] = [];
      const pad = 16;

      // 1. Navigation bar
      const nav = document.querySelector('nav') || document.querySelector('header');
      if (nav) {
        const r = nav.getBoundingClientRect();
        zones.push({
          x1: r.left - pad,
          y1: 0,
          x2: r.right + pad,
          y2: r.bottom + pad,
          name: 'navbar',
        });
      } else {
        zones.push({
          x1: 0,
          y1: 0,
          x2: window.innerWidth,
          y2: 88,
          name: 'navbar',
        });
      }

      // 2. Hero text elements
      const heroIds = [
        { id: 'hero-eyebrow', name: 'eyebrow' },
        { id: 'hero-headline', name: 'headline' },
        { id: 'hero-subtitle', name: 'subtitle' },
        { id: 'hero-hint', name: 'hint' },
      ];

      for (const item of heroIds) {
        const el = document.getElementById(item.id);
        if (el) {
          const r = el.getBoundingClientRect();
          zones.push({
            x1: r.left - pad,
            y1: r.top - pad,
            x2: r.right + pad,
            y2: r.bottom + pad,
            name: item.name,
          });
        }
      }

      noGoZonesRef.current = zones;
    };

    updateNoGoZones();
    const timer = setInterval(updateNoGoZones, 400);
    window.addEventListener('resize', updateNoGoZones, { passive: true });
    window.addEventListener('scroll', updateNoGoZones, { passive: true });
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', updateNoGoZones);
      window.removeEventListener('scroll', updateNoGoZones);
    };
  }, []);

  // Synchronize 3D projected coordinates to DOM labels at 60fps
  useEffect(() => {
    const unsubscribe = orbitalCoordsBridge.subscribe((coordsMap) => {
      if (typeof window === 'undefined') return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isNarrow = viewportWidth < 900;
      const isHeroVisible = isHeroVisibleRef.current;
      const noGoZones = noGoZonesRef.current;

      // Moon disc screen radius approximation (~35% of viewport height at FOV 40)
      const moonR = Math.round(viewportHeight * 0.33);

      // 1. Gather preliminary candidate coordinates for all 6 satellites
      const candidates: LabelCandidate[] = [];

      for (const config of SATELLITE_CONFIGS) {
        const data = coordsMap.get(config.slug);
        const el = labelRefs.current[config.slug];

        if (!data || !el) continue;

        // Label dimensions
        const w = el.offsetWidth || 150;
        const h = el.offsetHeight || 22;

        const xSat = data.screenX;
        const ySat = data.screenY;
        const dxMoon = xSat - data.moonScreenX;

        // Determine silhouette edge or fallback
        const sil = data.silhouette || {
          minX: xSat - 16,
          maxX: xSat + 16,
          minY: ySat - 16,
          maxY: ySat + 16,
          width: 32,
          height: 32,
        };

        // Satellite in front of Moon check
        const isSatInFrontOfMoon =
          data.depthZ > 0.05 &&
          Math.hypot(xSat - data.moonScreenX, ySat - data.moonScreenY) < moonR;

        // Candidate side preferences (prefer side facing away from Moon center)
        const primarySide: 'left' | 'right' = dxMoon >= 0 ? 'right' : 'left';
        const secondarySide: 'left' | 'right' = primarySide === 'right' ? 'left' : 'right';

        // Connector line horizontal gap: 22px (ensures line length stays within 16px - 40px)
        const connectorGap = 22;

        // Helper: check if a candidate box collides with no-go zones or Moon disc
        const checkCollision = (boxLeft: number, boxTop: number) => {
          const boxRight = boxLeft + w;
          const boxBottom = boxTop + h;

          // Viewport margins check (at least 20px margin)
          if (boxLeft < 20 || boxRight > viewportWidth - 20) return 'viewport-edge';
          if (boxTop < 88 || boxBottom > viewportHeight - 20) return 'viewport-edge';

          // No-go zones check (navbar, eyebrow, headline, subtitle, hint)
          for (const zone of noGoZones) {
            const overlapX = Math.max(boxLeft, zone.x1) < Math.min(boxRight, zone.x2);
            const overlapY = Math.max(boxTop, zone.y1) < Math.min(boxBottom, zone.y2);
            if (overlapX && overlapY) {
              return `no-go-${zone.name}`;
            }
          }

          // Moon disc check: labels must not cover Moon disc unless satellite is in front
          if (!isSatInFrontOfMoon) {
            const nearestX = Math.max(boxLeft, Math.min(data.moonScreenX, boxRight));
            const nearestY = Math.max(boxTop, Math.min(data.moonScreenY, boxBottom));
            const distToMoon = Math.hypot(nearestX - data.moonScreenX, nearestY - data.moonScreenY);
            if (distToMoon < moonR) {
              return 'moon-disc';
            }
          }

          return null; // No collision!
        };

        // Placement evaluation strategy:
        // Try primary side (dy = 0)
        // -> if collides, flip to secondary side (dy = 0)
        // -> if collides, try vertical nudges on primary side (up to 24px: ±8, ±16, ±24)
        // -> if collides, try vertical nudges on secondary side
        // -> if all collide, mark hidden
        let chosenSide: 'left' | 'right' = primarySide;
        let chosenLeft = 0;
        let chosenTop = 0;
        let placementFound = false;
        let collisionReason: string | null = null;

        const verticalNudges = [0, -8, 8, -16, 16, -24, 24];

        // Try primary side with 0 nudge first
        const primaryLeft = sil.maxX + connectorGap;
        const primaryTop = ySat - h / 2;
        const secondaryLeft = sil.minX - connectorGap - w;
        const secondaryTop = ySat - h / 2;

        let res = checkCollision(primarySide === 'right' ? primaryLeft : secondaryLeft, primaryTop);
        if (!res) {
          chosenSide = primarySide;
          chosenLeft = primarySide === 'right' ? primaryLeft : secondaryLeft;
          chosenTop = primaryTop;
          placementFound = true;
        } else {
          // Flip side
          const flippedSide = secondarySide;
          const flippedLeft = flippedSide === 'right' ? primaryLeft : secondaryLeft;
          res = checkCollision(flippedLeft, secondaryTop);
          if (!res) {
            chosenSide = flippedSide;
            chosenLeft = flippedLeft;
            chosenTop = secondaryTop;
            placementFound = true;
          } else {
            // Try vertical nudges on primary side then secondary side
            for (const dy of verticalNudges.slice(1)) {
              const testLeft = primarySide === 'right' ? primaryLeft : secondaryLeft;
              const testTop = primaryTop + dy;
              if (!checkCollision(testLeft, testTop)) {
                chosenSide = primarySide;
                chosenLeft = testLeft;
                chosenTop = testTop;
                placementFound = true;
                break;
              }
            }

            if (!placementFound) {
              for (const dy of verticalNudges.slice(1)) {
                const testLeft = secondarySide === 'right' ? primaryLeft : secondaryLeft;
                const testTop = secondaryTop + dy;
                if (!checkCollision(testLeft, testTop)) {
                  chosenSide = secondarySide;
                  chosenLeft = testLeft;
                  chosenTop = testTop;
                  placementFound = true;
                  break;
                }
              }
            }

            if (!placementFound) {
              collisionReason = res;
            }
          }
        }

        // Connector line segment calculation
        // 1px line in satellite accent color from label inner edge to satellite silhouette nearest edge
        let connector: ConnectorCoords | undefined;
        if (placementFound) {
          const innerX = chosenSide === 'right' ? chosenLeft : chosenLeft + w;
          const innerY = chosenTop + h / 2;
          const satEdgeX = chosenSide === 'right' ? sil.maxX : sil.minX;
          const satEdgeY = ySat;

          connector = {
            x1: innerX,
            y1: innerY,
            x2: satEdgeX,
            y2: satEdgeY,
          };
        }

        // Visibility determination
        let isVisible =
          placementFound &&
          !data.behindMoon &&
          !data.edgeOccluded &&
          isHeroVisible;

        let hiddenReason: string | undefined;
        if (!isVisible) {
          if (data.behindMoon) hiddenReason = 'behind Moon';
          else if (data.edgeOccluded) hiddenReason = 'viewport edge occluded';
          else if (!isHeroVisible) hiddenReason = 'scrolled past hero';
          else if (!placementFound) hiddenReason = collisionReason || 'no-go collision';
        }

        // Narrow Viewport Filter (< 900px): only active/targeted satellite label shows
        if (isNarrow) {
          const isTargeted = hoveredSlug === config.slug || selectedSlug === config.slug;
          if (!isTargeted) {
            isVisible = false;
            hiddenReason = 'narrow viewport active only';
          }
        }

        // Determine compact panel position (beside if space allows, otherwise below)
        const panelWidth = 260;
        const hasSpaceBeside =
          chosenSide === 'right'
            ? chosenLeft + w + panelWidth + 16 < viewportWidth
            : chosenLeft - panelWidth - 16 > 0;
        const panelPos: 'beside' | 'below' = hasSpaceBeside ? 'beside' : 'below';

        candidates.push({
          slug: config.slug,
          config,
          xSat,
          ySat,
          targetLeft: chosenLeft,
          targetTop: chosenTop,
          width: w,
          height: h,
          isVisible,
          side: chosenSide,
          panelPos,
          connector,
          hiddenReason,
        });
      }

      // 2. Anti-Collision (Label to Label):
      // Keep at least 8px between labels. If two collide, move lower one down by up to 24px.
      // If still collides, hide the one farther from viewport centre.
      const visibleCandidates = candidates.filter((c) => c.isVisible);
      visibleCandidates.sort((a, b) => a.targetTop - b.targetTop);

      for (let i = 0; i < visibleCandidates.length; i++) {
        for (let j = i + 1; j < visibleCandidates.length; j++) {
          const a = visibleCandidates[i];
          const b = visibleCandidates[j];
          if (!a.isVisible || !b.isVisible) continue;

          // Check horizontal overlap
          const overlapX =
            Math.max(a.targetLeft, b.targetLeft) <
            Math.min(a.targetLeft + a.width, b.targetLeft + b.width);

          if (overlapX) {
            // Check vertical proximity (require at least 8px separation)
            const verticalDeficit = a.targetTop + a.height + 8 - b.targetTop;
            if (verticalDeficit > 0) {
              const nudge = Math.min(24, verticalDeficit);
              const nudgedTop = b.targetTop + nudge;

              // Check if nudged b is still within margins and free of no-go zones
              let validNudge = nudgedTop + b.height <= viewportHeight - 20;
              if (validNudge) {
                for (const zone of noGoZones) {
                  const ovX = Math.max(b.targetLeft, zone.x1) < Math.min(b.targetLeft + b.width, zone.x2);
                  const ovY = Math.max(nudgedTop, zone.y1) < Math.min(nudgedTop + b.height, zone.y2);
                  if (ovX && ovY) {
                    validNudge = false;
                    break;
                  }
                }
              }

              // Also check if nudge successfully resolved the overlap with a
              if (validNudge && nudgedTop >= a.targetTop + a.height + 8) {
                b.targetTop = nudgedTop;
                if (b.connector) {
                  b.connector.y1 = b.targetTop + b.height / 2;
                }
              } else {
                // Still collides: hide the one farther from the viewport centre
                const viewCenterX = viewportWidth / 2;
                const viewCenterY = viewportHeight / 2;
                const distA = Math.hypot(
                  a.targetLeft + a.width / 2 - viewCenterX,
                  a.targetTop + a.height / 2 - viewCenterY
                );
                const distB = Math.hypot(
                  b.targetLeft + b.width / 2 - viewCenterX,
                  b.targetTop + b.height / 2 - viewCenterY
                );

                if (distA > distB) {
                  a.isVisible = false;
                  a.hiddenReason = 'label-to-label collision (farther from center)';
                } else {
                  b.isVisible = false;
                  b.hiddenReason = 'label-to-label collision (farther from center)';
                }
              }
            }
          }
        }
      }

      // 3. Apply computed coordinates, connector lines & visibility directly to DOM
      const finalVisible = candidates.filter((c) => c.isVisible);
      finalVisible.sort((a, b) => a.targetTop - b.targetTop || a.targetLeft - b.targetLeft);
      const visualOrderMap = new Map<string, number>();
      finalVisible.forEach((c, idx) => {
        visualOrderMap.set(c.slug, idx + 1);
      });

      for (const item of candidates) {
        const el = labelRefs.current[item.slug];
        const line = lineRefs.current[item.slug];

        if (el) {
          el.style.transform = `translate3d(${Math.round(item.targetLeft)}px, ${Math.round(item.targetTop)}px, 0)`;
          el.style.opacity = item.isVisible ? '1' : '0';
          el.style.pointerEvents = item.isVisible ? 'auto' : 'none';

          const assignedTab = item.isVisible ? String(visualOrderMap.get(item.slug) || 1) : '-1';
          el.setAttribute('tabindex', assignedTab);
          el.setAttribute('aria-hidden', item.isVisible ? 'false' : 'true');
          el.setAttribute('data-anchor-side', item.side);
          el.setAttribute('data-panel-pos', item.panelPos);
          if (item.hiddenReason) {
            el.setAttribute('data-hidden-reason', item.hiddenReason);
          } else {
            el.removeAttribute('data-hidden-reason');
          }
        }

        // Connector line updates
        if (line) {
          if (item.isVisible && item.connector) {
            line.setAttribute('x1', String(Math.round(item.connector.x1)));
            line.setAttribute('y1', String(Math.round(item.connector.y1)));
            line.setAttribute('x2', String(Math.round(item.connector.x2)));
            line.setAttribute('y2', String(Math.round(item.connector.y2)));
            line.style.opacity = '1';
          } else {
            line.style.opacity = '0';
          }
        }
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
      {/* 1px Satellite Connector Lines rendered via SVG overlay */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full z-10"
        style={{ overflow: 'hidden' }}
        aria-hidden="true"
      >
        {SATELLITE_CONFIGS.map((config) => (
          <line
            key={config.slug}
            ref={(node) => {
              lineRefs.current[config.slug] = node;
            }}
            data-connector-line={config.slug}
            stroke={config.accentColor}
            strokeWidth={1}
            strokeOpacity={0.6}
            style={{
              transition: 'opacity 300ms ease-out',
              opacity: 0,
            }}
          />
        ))}
      </svg>

      {/* Component-scoped compact panel positioning rules */}
      <style jsx>{`
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
            {/* Service Name: Inter body font, sentence case, 13px, weight 500, tracking 0.02em, #ECEEF4 at 90% */}
            <span
              className="block font-sans text-[13px] font-medium tracking-[0.02em] text-[#ECEEF4]/90 transition-colors duration-200 group-hover:text-white group-focus-visible:text-white [&.is-canvas-hovered]:text-white"
              style={{
                textTransform: 'none',
                textShadow: '0 1px 8px rgba(5, 6, 13, 0.9)',
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
