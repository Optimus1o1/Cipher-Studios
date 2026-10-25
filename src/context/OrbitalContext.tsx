'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SATELLITE_CONFIGS } from '@/components/three/satellites/types';


interface OrbitalContextValue {
  selectedSlug: string | null;
  hoveredSlug: string | null;
  selectService: (slug: string | null, navigate?: boolean) => void;
  setHoveredSlug: (slug: string | null) => void;
  isServicesRoute: boolean;
}

export const OrbitalContext = createContext<OrbitalContextValue | undefined>(undefined);

export function OrbitalProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isServicesRoute = pathname === '/services' || pathname.startsWith('/services/');

  // Initial selection derived from route if on /services/[slug]
  const [selectedSlug, setSelectedSlug] = useState<string | null>(() => {
    if (pathname && pathname.startsWith('/services/')) {
      return pathname.replace('/services/', '').split('/')[0] || null;
    }
    return null;
  });

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  // Sync route changes to selectedSlug
  useEffect(() => {
    if (pathname && pathname.startsWith('/services/')) {
      const slug = pathname.replace('/services/', '').split('/')[0];
      if (slug) setSelectedSlug(slug);
    } else if (pathname === '/services') {
      setSelectedSlug(null);
    } else {
      setSelectedSlug(null);
    }
  }, [pathname]);


  const selectService = useCallback(
    (slug: string | null, navigate: boolean = false) => {
      setSelectedSlug(slug);
      if (navigate && slug) {
        const targetConfig = SATELLITE_CONFIGS.find((s) => s.slug === slug);
        const route = targetConfig?.route || `/services/${slug}`;
        router.push(route);
      }
    },
    [router]
  );

  return (
    <OrbitalContext.Provider
      value={{
        selectedSlug,
        hoveredSlug,
        selectService,
        setHoveredSlug,
        isServicesRoute,
      }}
    >
      {children}
    </OrbitalContext.Provider>
  );
}

export function useOrbital(): OrbitalContextValue {
  const context = useContext(OrbitalContext);
  if (context) return context;

  // Safe fallback for isolated React reconcilers (such as R3F Canvas root)
  const isServices =
    typeof window !== 'undefined'
      ? window.location.pathname === '/services' ||
        window.location.pathname.startsWith('/services/')
      : true;

  let selected: string | null = null;
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/services/')) {
    selected = window.location.pathname.replace('/services/', '').split('/')[0] || null;
  }

  return {
    selectedSlug: selected,
    hoveredSlug: null,
    selectService: (slug: string | null, navigate: boolean = false) => {
      if (navigate && slug && typeof window !== 'undefined') {
        window.location.href = `/services/${slug}`;
      }
    },
    setHoveredSlug: () => {},
    isServicesRoute: isServices,
  };
}
