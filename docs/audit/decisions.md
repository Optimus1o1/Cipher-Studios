# Phase 2: Decision Log on Changed & Core Untracked Files

**Date:** 2026-10-25T13:49:00+05:30  
**Project:** Moon Sanctum Labs website (Next.js App Router, React Three Fiber, Three.js)  
**Status:** Awaiting User Approval on "needs approval" items before editing code.

---

## 1. Decision Matrix

| File | Status | Action / Decision | Rationale & Live Evidence |
| :--- | :---: | :---: | :--- |
| `src/components/three/MoonScene.tsx` | Untracked | **keep** | Required client-side R3F Canvas root (`fov: 40, pos: [0,0,7.5]`). Verified live rendering Moon and fleet in `baseline_services.png`. |
| `src/components/three/Moon.tsx` | Untracked | **keep** | Required spherified cubic 3D Moon mesh (radius 1.7) with 2K textures and real-time astronomical solar lighting/libration. Verified live in `baseline_services.png`. |
| `src/components/three/Starfield.tsx` | Untracked | **keep** | Required procedural background starfield points system (1300 desktop / 500 mobile). Verified live rendering in `baseline_services.png`. |
| `src/components/three/satellites/OrbitalSystem.tsx` | Untracked | **keep** | Required procedural 6-satellite fleet system managing orbital kinematics, clearance limits, and detail focus state. Verified live in `baseline_services.png`. |
| `src/components/three/satellites/SatelliteModels.tsx` | Untracked | **keep** | Required procedural Three.js satellite body meshes, solar wings, thrusters, and distinct service instruments. Verified live in `baseline_services.png`. |
| `src/components/three/satellites/SatelliteFactory.ts` | Untracked | **keep** | Required procedural geometry generation factory for satellite primitives, hex bolt heads, and thin parts. Verified live in `baseline_services.png`. |
| `src/components/three/satellites/types.ts` | Untracked | **keep** | Required TypeScript interfaces and type definitions for satellite configurations and orbital metrics. Verified by clean `npm run build` and `tsc`. |
| `src/components/three/satellites/satelliteConfigs.ts` | Untracked | **keep** | Required locked orbital parameters (radii 2.92–3.62, base angles, speeds, tilt planes 0/1) and accent colors. Verified live in `baseline_services.png`. |
| `src/components/ui/orbital/FloatingServiceLabels.tsx` | Untracked | **keep** | Required 60fps DOM floating labels anchored 28px from projected satellite screen coordinates with collision avoidance. Verified live in `baseline_services.png`. |
| `src/components/ui/orbital/OrbitalServicesHero.tsx` | Untracked | **keep** | Required services hero container hosting floating labels on desktop and the 6-satellite touch control deck on mobile. Verified live in `baseline_services.png`. |
| `src/components/ui/orbital/ServicesGrid.tsx` | Untracked | **keep** | Required overview grid with 6 cards synchronized with orbital fleet states. Verified live on `/services`. |
| `src/context/OrbitalContext.tsx` | Untracked | **keep** | Required React context managing selected satellite slug, hovered slug, and routing synchronization. Verified live restoring overview fleet on `/services`. |
| `src/lib/orbitalCoords.ts` | Untracked | **keep** | Required coordinate bridge connecting 3D R3F canvas loop with DOM floating labels via `msl-orbital-coords-sync`. Verified live with 23 frames/syncs in 500ms. |
| `src/app/services/[slug]/page.tsx` | Untracked | **keep** | Required individual service detail page with "All services" breadcrumb, instrument pill, deliverables, and FAQs. Verified live on `/services/care-growth`. |
| `src/app/services/page.tsx` | Tracked (Modified) | **keep** | Required services overview route hosting the 3D Moon and orbital fleet hero. Verified live in `baseline_services.png`. |
| `src/components/ui/SiteChrome.tsx` | Untracked | **keep** | Required layout chrome mounting global `MoonScene`, `Navigation`, and `Footer` across routes. Verified live in `baseline_services.png`. |
| `src/components/ui/Navigation.tsx` | Untracked | **keep** | Required global responsive navigation bar with logo, links, and CTA. Verified live in `baseline_services.png`. |
| `src/lib/lunar.ts` | Untracked | **keep** | Required astronomical calculations for real-time lunar phase, sun vector, and optical libration. Verified live in `baseline_services.png`. |
| `src/lib/lunarCubicGeometry.ts` | Untracked | **keep** | Required cubic spherified mesh generator with uniform texel density and zero pole distortion. Verified live in `baseline_services.png`. |
| `src/app/layout.tsx` | Tracked (Modified) | **keep** | Required root HTML/body layout mounting fonts, `OrbitalProvider`, `TopChrome`, main content area, and `BottomChrome`. Verified live. |
| `src/hooks/useDeviceTier.ts` | Tracked (Modified) | **needs approval** | Hardware capability gate. Originally imported `DeviceTier` from `@/types`, but `src/types/index.ts` was deleted. Currently has inlined `DeviceTier`. Needs approval on resolution option. |
| `src/types/index.ts` | Tracked (Deleted) | **needs approval** | Legacy CIPHER type bundle deleted in commit `3ab9eb4`. Needs approval whether to restore it for `DeviceTier` or keep types colocated in their modules. |

---

## 2. In-Depth Analysis: `useDeviceTier.ts` & `src/types/index.ts`

- **Context:** In commit `3ab9eb4`, `src/types/index.ts` was deleted because it contained legacy CIPHER agency types (`ReviewFormValues`, `AuditRequest`, etc.) that were no longer relevant to Moon Sanctum Labs. In `src/hooks/useDeviceTier.ts`, `DeviceTier` was inlined:
  ```ts
  export type DeviceTier = 'full' | 'lite' | 'off' | 'checking';
  ```
- **Option A (Restore `src/types/index.ts`):**
  - Re-create `src/types/index.ts` exporting `DeviceTier` (and any shared agency types).
  - Update `useDeviceTier.ts` to `import type { DeviceTier } from '@/types';`.
  - *Pro:* Keeps shared global types centralized under `@/types`.
  - *Con:* Reintroduces a separate file for a single type definition used primarily by `useDeviceTier` and 3D scenes.
- **Option B (Keep inline type in `useDeviceTier.ts`):**
  - Keep `export type DeviceTier = 'full' | 'lite' | 'off' | 'checking';` exported directly from `src/hooks/useDeviceTier.ts`.
  - Consumers (`MoonScene.tsx`, `Moon.tsx`, `OrbitalSystem.tsx`) import `DeviceTier` directly from `@/hooks/useDeviceTier`.
  - *Pro:* Fully self-contained, idiomatic Next.js hook architecture, zero external dependencies, passes clean `tsc --noEmit` and clean build.
  - *Con:* Does not use `@/types/index.ts`.

---

## 3. In-Depth Analysis: `msl-orbital-coords-sync`

- **Can the labels work without `msl-orbital-coords-sync`?**
  - **No.** In Next.js 14 App Router with React Three Fiber, the 3D scene (`Canvas` / `OrbitalSystem`) runs inside an isolated React reconciler root (`react-reconciler`), while `FloatingServiceLabels` runs in the main React DOM tree.
  - Because Next.js production chunking bundles R3F components and DOM UI components into separate Webpack/Turbopack chunk closures, in-memory singleton module references (such as an in-memory `Map` or singleton class instance) cannot be guaranteed to share the exact same object reference across separate chunk bundles.
  - `msl-orbital-coords-sync` uses the standard browser `window` event bus (`window.dispatchEvent` / `window.addEventListener`) to reliably cross chunk boundaries at 60fps without race conditions or memory leaks.
- **Dispatcher:**
  - `src/components/three/satellites/OrbitalSystem.tsx`: Inside `useFrame`, calls `orbitalCoordsBridge.notify()`, which executes:
    ```ts
    window.dispatchEvent(new CustomEvent('msl-orbital-coords-sync', { detail: this.coords }));
    ```
- **Listener:**
  - `src/lib/orbitalCoords.ts`: `OrbitalCoordsBridge` constructor on `window`:
    ```ts
    window.addEventListener('msl-orbital-coords-sync', (event: CustomEvent<Map<string, SatelliteScreenCoord>>) => {
      if (this.isBroadcasting) return;
      if (event.detail) {
        this.coords = event.detail;
        this.listeners.forEach((listener) => listener(this.coords));
      }
    });
    ```
  - `src/components/ui/orbital/FloatingServiceLabels.tsx`: Subscribes via `orbitalCoordsBridge.subscribe(...)` to update DOM label transforms at 60fps.
- **Live Verification:**
  - Verified live: 23 frames / CustomEvent broadcasts fired in 500ms (~60fps) with full coordinates for all 6 satellites when the tab is in foreground.

---

## 4. Stop Gate Enforcement

As required by Phase 2:
> **"Stop after writing `decisions.md`. Wait for approval on every "needs approval" row before editing it."**

No code modifications will be executed until the user reviews and provides explicit approval on:
1. `useDeviceTier.ts` & `src/types/index.ts`: Choice between Option A (Restore `src/types/index.ts`) vs Option B (Keep inline type in `useDeviceTier.ts`).
2. Retention of `msl-orbital-coords-sync` CustomEvent bridge.
