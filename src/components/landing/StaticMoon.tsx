import React from 'react';

/**
 * A light, WebGL-free rotating moon for landing pages.
 * Uses the equirectangular map already in /public/textures/moon (keep moon_1024.jpg when cleaning assets).
 */
export function StaticMoon({ className }: { className?: string }) {
  return (
    <>
      <div className={className} aria-hidden="true">
        <div className="msl-moon" />
      </div>
      <style>{`
        .msl-moon{
          --s:min(78vw,420px);
          width:var(--s);height:var(--s);border-radius:50%;
          background:#2a2d38 url(/textures/moon/moon_1024.jpg) 0 50%/200% 100% repeat-x;
          box-shadow:inset -52px -18px 70px 12px rgba(0,0,0,.9),inset 6px 4px 22px rgba(255,255,255,.06),0 0 90px rgba(216,195,160,.14);
          animation:msl-spin 260s linear infinite;
        }
        @keyframes msl-spin{to{background-position-x:calc(var(--s) * -2)}}
        @media (prefers-reduced-motion: reduce){.msl-moon{animation:none}}
      `}</style>
    </>
  );
}
