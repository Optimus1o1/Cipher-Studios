import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[80svh] flex items-center justify-center pt-28 pb-20 px-6">
      <div className="text-center max-w-[500px] space-y-6">
        {/* Crescent Moon Visual */}
        <div className="mx-auto w-16 h-16 rounded-full bg-ink relative overflow-hidden shadow-glow">
          <div className="absolute inset-0 rounded-full bg-bg -translate-x-[36%]" />
        </div>

        <span className="text-accent text-sm font-mono tracking-widest uppercase">
          404 — Orbit Lost
        </span>

        <h1 className="font-serif text-ink text-[2.8rem] md:text-[3.6rem] font-light leading-tight">
          Page not found.
        </h1>

        <p className="text-mute text-[1.05rem] leading-relaxed">
          The coordinates you navigated to do not exist or have moved to another
          sector. Let us guide you back to familiar terrain.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Button href="/" variant="primary" size="md">
            Return to Home
          </Button>
          <Button href="/services" variant="secondary" size="md">
            Browse Services
          </Button>
        </div>
      </div>
    </div>
  );
}
