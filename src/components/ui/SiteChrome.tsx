'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MoonScene } from '@/components/three/MoonScene';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

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
      <MoonScene />
      {!bare && <Navigation />}
    </>
  );
}

export function BottomChrome() {
  const pathname = usePathname();
  if (isBare(pathname)) return null;
  return <Footer />;
}
