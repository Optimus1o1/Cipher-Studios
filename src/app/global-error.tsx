'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0F1013] text-[#F2EFE8] flex items-center justify-center min-h-screen p-6 font-sans">
        <div className="text-center max-w-md space-y-5">
          <span className="text-[#E0A45C] text-sm font-mono tracking-widest uppercase">
            Moon Sanctum Labs
          </span>
          <h1 className="text-3xl font-serif font-light text-[#F2EFE8]">
            System Disrupted
          </h1>
          <p className="text-[#8B9099] text-sm leading-relaxed">
            An unexpected error occurred while loading this page. Please try refreshing or reloading the window.
          </p>
          <div className="pt-2">
            <button
              onClick={() => reset()}
              className="px-5 py-2.5 bg-[#E0A45C] text-[#0F1013] rounded font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
