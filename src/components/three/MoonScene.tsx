'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { cn } from '@/lib/utils';
import { MoonSceneContent } from './Moon';

export function MoonScene() {
  const [mounted, setMounted] = useState(false);
  const tier = useDeviceTier();
  const pathname = usePathname();
  const isServicePage = pathname === '/services' || pathname.startsWith('/services/');

  useEffect(() => {
    setMounted(true);
    const trigger = () => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('resize'));
      }
    };
    const t1 = setTimeout(trigger, 50);
    const t2 = setTimeout(trigger, 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Fallback gradient while mounting, checking tier, or if 3D is disabled
  if (!mounted || tier === 'off' || tier === 'checking') {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 75% 30%, #1a2048 0%, #05060d 65%)',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-0 overflow-hidden',
        isServicePage ? 'pointer-events-auto' : 'pointer-events-none'
      )}
      style={{
        background: 'radial-gradient(ellipse at 75% 30%, #0f1430 0%, #05060d 75%)',
        touchAction: 'pan-y',
      }}
      aria-hidden="true"
    >
      <Canvas
        frameloop="always"
        dpr={typeof window !== 'undefined' ? [1, Math.min(window.devicePixelRatio, 1.25)] : [1, 1.25]}
        gl={{
          antialias: tier === 'full',
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 7.5], fov: 40 }}
        className="w-full h-full"
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: isServicePage ? 'auto' : 'none',
          touchAction: 'pan-y',
        }}
      >
        <MoonSceneContent isServicePage={isServicePage} tier={tier} />
      </Canvas>
    </div>
  );
}
