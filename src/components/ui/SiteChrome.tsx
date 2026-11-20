'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SceneErrorBoundary } from './SceneErrorBoundary';

const MoonScene = dynamic(
  () => import('@/components/three/MoonScene').then((mod) => mod.MoonScene),
  {
    ssr: false,
    loading: () => (
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 75% 30%, #1a2048 0%, #05060d 65%)',
        }}
        aria-hidden="true"
      />
    ),
  }
);

// Paths that render their own minimal header and footer (no 3D moon, no main nav).
const BARE_PATHS = ['/website-review'];

function isBare(pathname: string) {
  return BARE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function TopChrome() {
  const pathname = usePathname();
  const bare = isBare(pathname);
  const [shouldLoad3D, setShouldLoad3D] = useState(false);

  useEffect(() => {
    // Progressive 3D initialization: defer heavy WebGL/texture hydration until critical path finishes
    if (typeof window === 'undefined') return;

    if ('requestIdleCallback' in window) {
      const handle = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number })
        .requestIdleCallback(
          () => {
            setShouldLoad3D(true);
          },
          { timeout: 1200 }
        );
      return () => {
        if ('cancelIdleCallback' in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
        }
      };
    } else {
      const timer = setTimeout(() => {
        setShouldLoad3D(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Mobile composition: scale down to 58% and translate towards upper-right to avoid content collision. Desktop remains unchanged (md:transform-none). */}
        <div className="w-full h-full md:transform-none transform-gpu scale-[0.58] translate-x-[26%] -translate-y-[18%] sm:scale-[0.75] sm:translate-x-[18%] sm:-translate-y-[10%] origin-top-right transition-transform duration-700 ease-out">
          <SceneErrorBoundary>
            {shouldLoad3D ? (
              <MoonScene />
            ) : (
              <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                  background: 'radial-gradient(ellipse at 75% 30%, #1a2048 0%, #05060d 65%)',
                }}
                aria-hidden="true"
              />
            )}
          </SceneErrorBoundary>
        </div>
      </div>
      {!bare && <Navigation />}
    </>
  );
}

export function BottomChrome() {
  const pathname = usePathname();
  if (isBare(pathname)) return null;
  return <Footer />;
}
