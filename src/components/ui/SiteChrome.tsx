'use client';

import React from 'react';
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
  return (
    <>
      <SceneErrorBoundary>
        <MoonScene />
      </SceneErrorBoundary>
      {!bare && <Navigation />}
    </>
  );
}

export function BottomChrome() {
  const pathname = usePathname();
  if (isBare(pathname)) return null;
  return <Footer />;
}
