'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client/SSR runtime errors cleanly
    console.error('App runtime error caught:', error);
  }, [error]);

  return (
    <div className="min-h-[80svh] flex items-center justify-center pt-28 pb-20 px-6">
      <div className="text-center max-w-[500px] space-y-6">
        <span className="text-accent text-sm font-mono tracking-widest uppercase">
          Signal Disrupted
        </span>

        <h1 className="font-serif text-ink text-[2.4rem] md:text-[3rem] font-light leading-tight">
          Something went wrong.
        </h1>

        <p className="text-mute text-[1.05rem] leading-relaxed">
          We encountered an unexpected disruption while rendering this view. You can retry or head back to home.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Button onClick={() => reset()} variant="primary" size="md">
            Try again
          </Button>
          <Button href="/" variant="secondary" size="md">
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
