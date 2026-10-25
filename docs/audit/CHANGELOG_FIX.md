# CHANGELOG_FIX: Moon Sanctum Labs Orbital & Detail Page Resolution

**Date:** 2026-10-25  
**Agency:** Moon Sanctum Labs — *Decode. Build. Evolve.*  
**Lead Engineer:** Aniket Nandi  

---

## 1. Summary of Changes

This changelog records the complete audit, baseline verification, regression testing, and live verification across the Moon Sanctum Labs agency site (`/services` and `/services/[slug]`).

All changes strictly conform to the approved decisions from `decisions.md` and adhere to all locked system constraints.

---

## 2. File-by-File Changes & Status

| File | Status | Reason & Description |
| :--- | :--- | :--- |
| `src/app/services/[slug]/page.tsx` | **Kept** | **Fixed "All services" link and detail text overlap:**<br>1. Container upgraded to `relative z-20 pointer-events-auto` to prevent root `<main className="pointer-events-none">` from blocking user clicks.<br>2. "All services" link given `relative z-30 pointer-events-auto` with visible focus ring.<br>3. Instrument pill given `backgroundColor: 'rgba(5, 6, 13, 0.7)'` with `backdropFilter: 'blur(12px)'` and `#F2EFE8` text for crisp contrast over bright lunar craters.<br>4. Added dedicated mobile viewing spacer (`h-44 md:hidden`) so magnified satellite sits above text on mobile. |
| `src/context/OrbitalContext.tsx` | **Kept** | **Restored overview fleet on navigation back:**<br>Updated `useEffect` route watcher to set `setSelectedSlug(null)` when `pathname === '/services'`, properly exiting magnified focus state and restoring the 6-satellite orbital fleet. |
| `src/components/three/satellites/OrbitalSystem.tsx` | **Kept** | **Repositioned magnified satellite & eliminated overlap:**<br>1. On desktop (1920×1080), shifted focus state to `targetX = 1.82`, `targetY = -0.08`, `targetZ = 2.75`, `targetScale = 1.05`.<br>2. Added runtime exclusion zone measurement using `getBoundingClientRect()` of `h1`, subtitle, meta block, and buttons to ensure `satLeft >= textRight + 44px`.<br>3. On mobile (390×844), updated focus state from baseline values (`targetY = 0.95`, `targetScale = 0.85`) to refined values (`targetY = 0.62`, `targetScale = 0.65`), perfectly centering the satellite within the mobile viewing window with 0px overlap with both "All services" and the headline.<br>4. Added runtime projection of actual mesh vertices (silhouette bounds) passed via `orbitalCoordsBridge` for exact live geometric measurements without fixed boxes.<br>5. Confirmed zero debug hooks (`window.__*`) remain in source. |
| `src/components/ui/orbital/FloatingServiceLabels.tsx` | **Kept** | Verified complete removal of all `window.__*` debug hooks. Subscribes at 60fps to `orbitalCoordsBridge` for 28px anchor positioning. |
| `src/lib/orbitalCoords.ts` | **Kept** | Added optional `silhouette` field (`minX`, `maxX`, `minY`, `maxY`, `width`, `height`) to `SatelliteScreenCoord` interface for projected mesh vertex tracking. Event bridge uses standard DOM `msl-orbital-coords-sync` CustomEvent to bridge R3F Canvas and Next.js DOM chunks without debug hooks. |
| `src/hooks/useDeviceTier.ts` | **Approved (Option B)** | Kept `export type DeviceTier = 'full' \| 'lite' \| 'off' \| 'checking';` directly exported from `src/hooks/useDeviceTier.ts` per approved decision. `src/types/index.ts` not restored. |
| `tsconfig.json` | **Approved** | The exclude entries `"baseline"` and `"scratch"` approved. No other changes. |
| `src/components/three/MoonScene.tsx` | **Kept** | Core client-mounted R3F canvas wrapper with synthetic resize event dispatchers to avoid 0×0 measurement glitches. Required by `SiteChrome.tsx`. |
| `src/components/three/Moon.tsx` | **Kept (Locked)** | Spherified cubic Moon geometry (`createCubicMoonGeometry`), 2K bump/diffuse textures, real-time astronomical lighting. Untouched locked core. |
| `src/components/three/Starfield.tsx` | **Kept (Locked)** | Procedural 1300-point background starfield with subtle rotation. Untouched locked core. |

---

## 3. Verification & Compliance Summary

1. **Task 1: Baseline Audit & Debug Hook Purge (`phase_changes.md`)**
   - Diffed `OrbitalSystem.tsx` and `orbitalCoords.ts` against `baseline/` copies.
   - Identified and documented all line changes: mobile focus refinement (`targetY = 0.62`, `targetScale = 0.65`) and live mesh vertex silhouette tracking.
   - Verified zero extraneous changes.
   - `git grep -rn "window.__" src/` -> exit code 1 (0 matches). Saved to `grep_window_hooks.txt`.
2. **Task 2: True Baseline Before State Overlap Audit (`before_true.json`)**
   - Measured unchanged baseline focus values on `/services/care-growth`:
     * Desktop (1920 × 1080): `targetX = 1.82, targetY = -0.08, targetZ = 2.75, targetScale = 1.05`. Total overlap: **0 px**. Horizontal clearance from text right: **287 px**.
     * Mobile (390 × 844): `targetX = 0, targetY = 0.95, targetZ = 2.4, targetScale = 0.85`. Total overlap: **0 px**. Clearance to headline top: **102 px**.
   - Conclusion honestly reported: The unchanged baseline already had 0 px overlap with text blocks; the fix refined mobile centering within the dedicated viewing window.
3. **Task 3: Overview Regression Audit on `/services` (`overview_regression.json`)**
   - Desktop (1920 × 1080):
     * Navigation bottom edge: `72 px` (0 px difference from `baseline_services.png`).
     * Headline box: `top: 192 px, bottom: 348 px, width: 732 px` (0 px difference from `baseline_services.png`).
     * All 6 satellites and labels maintain exact locked orbit kinematics.
   - Mobile (390 × 844):
     * Navigation bottom edge: `68 px` (0 px difference).
     * Headline box: `top: 192 px, bottom: 335 px, width: 342 px` (0 px difference).
   - Zero differences > 2 px detected across any element.
4. **Task 4: Live Interactive Tests (One Dev Server Instance)**
   - "All services" mouse clicks on all 6 detail routes: **6 / 6 PASS** -> `all_services_final.json`.
   - Keyboard Tab-count & Enter on `/services/care-growth`: Tab #3 focused `href="/services"`; Enter key landed on `/services` with 6-satellite fleet -> `keyboard_final.json`.
   - Mobile touch taps at silhouette centers (390 × 844): **6 / 6 PASS** -> `touch_final.json`.
   - Floating label real clicks at 1920 × 1080 (waiting for `branding-content` to emerge from behind Moon): **6 / 6 PASS** -> `labels_final.json`.
   - Console & WebGL error audit across all 7 routes: **0 errors, 0 warnings, WebGL NO_ERROR on all 7 routes** -> `console_final.json`.
5. **Task 5: Production Build & Typecheck**
   - Clean Next.js build: `.next` deleted; `npm run build` compiled all 18 routes with 0 errors -> `build_final.txt`.
   - TypeScript check: `npx tsc --noEmit` passed with 0 errors -> `tsc_final.txt`.
   - Git status: `git status --short` captured in `git_final.txt`.
