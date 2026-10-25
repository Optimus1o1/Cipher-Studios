# Git Accounting Report: Tracked Modified & Deleted Files

**Project:** Moon Sanctum Labs website (Next.js App Router, React Three Fiber, Three.js)  
**Generated:** 2026-10-25T14:32:36.582Z  
**Status:** Task 1 Complete. Task 2 Stop Gate: Awaiting User Decision on "needs approval" rows.  

## Summary

- **Total Tracked Changes:** 87 files
- **Tracked Modified (M):** 23 files
- **Tracked Deleted (D):** 64 files
- **Live Route Imports for Deleted Files:** **0** (no live route or component in `src/` imports any deleted file)
- **src/types/index.ts Confirmation:** Confirmed deleted intentionally, consistent with `useDeviceTier` Option B (inlined `DeviceTier` in `src/hooks/useDeviceTier.ts`).

---

## 1. Tracked Deleted Files (64 files)

| # | File | Belongs To | Classification | Live Route Imports (`grep -rn <basename> src/`) | Proposed Action |
|---|---|---|---|---|:---:|
| 1 | `CIPHER-3D-GlassUI-Build-Report.md` | Legacy CIPHER migration | Legacy build report | None | **keep as deleted** |
| 2 | `LICENSE` | Legacy CIPHER migration | Legacy MIT license | None | **needs approval** |
| 3 | `README.md` | Legacy CIPHER migration | Legacy repository README | None | **needs approval** |
| 4 | `SETUP.md` | Legacy CIPHER migration | Legacy setup guide | None | **keep as deleted** |
| 5 | `firestore.rules` | Legacy CIPHER migration | Legacy Firebase rules | src/lib/firebase.ts<br>src/lib/firebaseAdmin.ts | **needs approval** |
| 6 | `public/Logo.tsx` | Legacy CIPHER migration | Misplaced component | None | **needs approval** |
| 7 | `public/README.md` | Legacy CIPHER migration | Legacy public assets README | None | **needs approval** |
| 8 | `public/apple-icon-180.png` | Legacy CIPHER migration | Legacy icon asset | None | **needs approval** |
| 9 | `public/email-signature@2x.png` | Legacy CIPHER migration | Legacy signature asset | None | **needs approval** |
| 10 | `public/favicon.ico` | Legacy CIPHER migration | Legacy favicon | None | **needs approval** |
| 11 | `public/icon-16.png` | Legacy CIPHER migration | Legacy icon asset | None | **needs approval** |
| 12 | `public/icon-192.png` | Legacy CIPHER migration | Legacy icon asset | None | **needs approval** |
| 13 | `public/icon-32.png` | Legacy CIPHER migration | Legacy icon asset | None | **needs approval** |
| 14 | `public/icon-512.png` | Legacy CIPHER migration | Legacy icon asset | None | **needs approval** |
| 15 | `public/logo-on-dark.svg` | Legacy CIPHER migration | Legacy brand asset | None | **needs approval** |
| 16 | `public/logo-on-dark@2x.png` | Legacy CIPHER migration | Legacy brand asset | None | **needs approval** |
| 17 | `public/logo-on-light.svg` | Legacy CIPHER migration | Legacy brand asset | None | **needs approval** |
| 18 | `public/logo-on-light@2x.png` | Legacy CIPHER migration | Legacy brand asset | None | **needs approval** |
| 19 | `public/logo-slogan-on-dark.svg` | Legacy CIPHER migration | Legacy brand asset | None | **needs approval** |
| 20 | `public/logo-slogan-on-light.svg` | Legacy CIPHER migration | Legacy brand asset | None | **needs approval** |
| 21 | `public/mark-on-dark.svg` | Legacy CIPHER migration | Legacy brand asset | None | **needs approval** |
| 22 | `public/mark-on-light.svg` | Legacy CIPHER migration | Legacy brand asset | None | **needs approval** |
| 23 | `public/og-cover-1200x630.png` | Legacy CIPHER migration | Legacy social preview | None | **needs approval** |
| 24 | `public/social-avatar-1080.png` | Legacy CIPHER migration | Legacy avatar asset | None | **needs approval** |
| 25 | `public/wordmark-on-dark.svg` | Legacy CIPHER migration | Legacy brand asset | None | **needs approval** |
| 26 | `public/wordmark-on-light.svg` | Legacy CIPHER migration | Legacy brand asset | None | **needs approval** |
| 27 | `render.yaml` | Legacy CIPHER migration | Legacy Render deploy config | None | **needs approval** |
| 28 | `src/app/about/page.tsx` | Legacy CIPHER migration | Legacy page route | src/app/contact/page.tsx<br>src/app/page.tsx | **keep as deleted** |
| 29 | `src/app/admin/page.tsx` | Legacy CIPHER migration | Legacy admin route | src/app/api/contact/route.ts<br>src/lib/firebaseAdmin.ts | **keep as deleted** |
| 30 | `src/app/api/audit/route.ts` | Legacy CIPHER migration | Legacy API route | None | **keep as deleted** |
| 31 | `src/app/api/leads/route.ts` | Legacy CIPHER migration | Legacy API route | src/app/api/contact/route.ts | **keep as deleted** |
| 32 | `src/app/api/session/route.ts` | Legacy CIPHER migration | Legacy API route | None | **keep as deleted** |
| 33 | `src/app/favicon.ico` | Legacy CIPHER migration | Legacy favicon (replaced by icon.svg) | None | **keep as deleted** |
| 34 | `src/app/portal/page.tsx` | Legacy CIPHER migration | Legacy portal route | None | **keep as deleted** |
| 35 | `src/app/work/page.tsx` | Legacy CIPHER migration | Legacy portfolio route | src/app/api/contact/route.ts<br>src/app/page.tsx | **keep as deleted** |
| 36 | `src/components/brand/Logo.tsx` | Legacy CIPHER migration | Legacy brand component | None | **keep as deleted** |
| 37 | `src/components/providers/SmoothScrollProvider.tsx` | Legacy CIPHER migration | Legacy scroll provider | None | **keep as deleted** |
| 38 | `src/components/sections/AboutSection.tsx` | Legacy CIPHER migration | Legacy section component | None | **keep as deleted** |
| 39 | `src/components/sections/ClientPortalSection.tsx` | Legacy CIPHER migration | Legacy section component | None | **keep as deleted** |
| 40 | `src/components/sections/FinalCtaSection.tsx` | Legacy CIPHER migration | Legacy section component | None | **keep as deleted** |
| 41 | `src/components/sections/HeroSection.tsx` | Legacy CIPHER migration | Legacy section component | None | **keep as deleted** |
| 42 | `src/components/sections/SecurityAuditTool.tsx` | Legacy CIPHER migration | Legacy tool component | None | **keep as deleted** |
| 43 | `src/components/sections/ServicesSection.tsx` | Legacy CIPHER migration | Legacy section component | None | **keep as deleted** |
| 44 | `src/components/sections/TestimonialsSection.tsx` | Legacy CIPHER migration | Legacy section component | None | **keep as deleted** |
| 45 | `src/components/sections/TrustStrip.tsx` | Legacy CIPHER migration | Legacy section component | None | **keep as deleted** |
| 46 | `src/components/sections/WorkSection.tsx` | Legacy CIPHER migration | Legacy section component | None | **keep as deleted** |
| 47 | `src/components/three/BoxesHoverField.tsx` | Legacy CIPHER migration | Legacy 3D background | None | **keep as deleted** |
| 48 | `src/components/three/FallbackGrid.tsx` | Legacy CIPHER migration | Legacy fallback grid | None | **keep as deleted** |
| 49 | `src/components/three/GlobalSpaceBackground.tsx` | Legacy CIPHER migration | Legacy 3D background | None | **keep as deleted** |
| 50 | `src/components/three/HeroCanvas.tsx` | Legacy CIPHER migration | Legacy canvas component | None | **keep as deleted** |
| 51 | `src/components/three/ScrollGridSection.tsx` | Legacy CIPHER migration | Legacy scroll section | None | **keep as deleted** |
| 52 | `src/components/three/StarfieldLayer.tsx` | Legacy CIPHER migration | Legacy starfield | None | **keep as deleted** |
| 53 | `src/components/ui/FloatingColorEffect.tsx` | Legacy CIPHER migration | Legacy UI effect | None | **keep as deleted** |
| 54 | `src/components/ui/GlassNav.tsx` | Legacy CIPHER migration | Legacy nav component | None | **keep as deleted** |
| 55 | `src/components/ui/glass/AccentCard.tsx` | Legacy CIPHER migration | Legacy UI card | None | **keep as deleted** |
| 56 | `src/components/ui/glass/BackgroundScene.tsx` | Legacy CIPHER migration | Legacy glass background | None | **keep as deleted** |
| 57 | `src/components/ui/glass/PillTabs.tsx` | Legacy CIPHER migration | Legacy UI component | None | **keep as deleted** |
| 58 | `src/components/ui/glass/ProgressIndicators.tsx` | Legacy CIPHER migration | Legacy UI component | None | **keep as deleted** |
| 59 | `src/components/ui/glass/ScoreHero.tsx` | Legacy CIPHER migration | Legacy UI component | None | **keep as deleted** |
| 60 | `src/hooks/useScrollBridge.ts` | Legacy CIPHER migration | Legacy scroll hook | None | **keep as deleted** |
| 61 | `src/hooks/useTilt.ts` | Legacy CIPHER migration | Legacy tilt hook | None | **keep as deleted** |
| 62 | `src/lib/leadsStore.ts` | Legacy CIPHER migration | Legacy store module | None | **keep as deleted** |
| 63 | `src/types/declarations.d.ts` | Legacy CIPHER migration | Legacy declaration file | None | **keep as deleted** |
| 64 | `src/types/index.ts` | Legacy CIPHER migration | Legacy type bundle (Option B confirmed) | None | **keep as deleted** |

---

## 2. Tracked Modified Files (23 files)

| # | File | Belongs To | Classification | Live Route Imports / Usage | Proposed Action |
|---|---|---|---|---|:---:|
| 1 | `.env.example` | Approved working set / Current app | Configuration | src/lib/firebase.ts<br>src/lib/firebaseAdmin.ts | **keep modified** |
| 2 | `.gitignore` | Approved working set / Current app | Configuration | None | **keep modified** |
| 3 | `next.config.mjs` | Approved working set | Next.js build configuration | None | **keep modified** |
| 4 | `package-lock.json` | Approved working set / Current app | Dependency lockfile | None | **keep modified** |
| 5 | `package.json` | Approved working set | Package manifest | src/app/contact/page.tsx<br>src/app/services/page.tsx | **keep modified** |
| 6 | `src/app/api/contact/route.ts` | This project’s current app | Contact API route | src/app/contact/page.tsx<br>src/app/page.tsx<br>src/app/services/page.tsx<br>src/components/ui/Footer.tsx | **keep modified** |
| 7 | `src/app/contact/page.tsx` | This project’s current app | Contact page route | src/app/api/contact/route.ts<br>src/app/page.tsx<br>src/app/services/page.tsx<br>src/components/ui/Footer.tsx | **keep modified** |
| 8 | `src/app/globals.css` | Approved working set / Current app | Global CSS & tokens | src/app/layout.tsx | **keep modified** |
| 9 | `src/app/layout.tsx` | Approved working set | Root layout | None | **keep modified** |
| 10 | `src/app/page.tsx` | This project’s current app | Home landing page | src/app/contact/page.tsx<br>src/app/globals.css<br>src/lib/firebase.ts<br>src/lib/firebaseAdmin.ts | **keep modified** |
| 11 | `src/app/services/page.tsx` | Approved working set | Services overview route | src/app/contact/page.tsx<br>src/app/page.tsx<br>src/app/styleguide/page.tsx<br>src/components/ui/Footer.tsx | **keep modified** |
| 12 | `src/app/styleguide/page.tsx` | This project’s current app | Design system styleguide | None | **keep modified** |
| 13 | `src/components/ui/Button.tsx` | This project’s current app | UI Component | src/app/contact/page.tsx<br>src/app/page.tsx<br>src/app/services/page.tsx<br>src/app/styleguide/page.tsx | **keep modified** |
| 14 | `src/components/ui/Footer.tsx` | This project’s current app | Site footer | src/app/layout.tsx | **keep modified** |
| 15 | `src/components/ui/glass/GlassCard.tsx` | This project’s current app | UI Component | src/app/contact/page.tsx<br>src/app/page.tsx<br>src/app/styleguide/page.tsx | **keep modified** |
| 16 | `src/components/ui/glass/StatCard.tsx` | This project’s current app | UI Component | src/app/page.tsx<br>src/app/styleguide/page.tsx | **keep modified** |
| 17 | `src/hooks/useDeviceTier.ts` | Approved working set (Option B) | Tier gate hook | None | **keep modified** |
| 18 | `src/lib/firebase.ts` | This project’s current app | Firebase client | src/app/api/contact/route.ts<br>src/lib/firebaseAdmin.ts | **keep modified** |
| 19 | `src/lib/firebaseAdmin.ts` | This project’s current app | Firebase Admin | src/app/api/contact/route.ts | **keep modified** |
| 20 | `src/lib/rateLimit.ts` | This project’s current app | API rate limiter | src/app/api/contact/route.ts | **keep modified** |
| 21 | `src/lib/utils.ts` | This project’s current app | Utility functions | src/components/ui/Button.tsx<br>src/components/ui/glass/GlassCard.tsx<br>src/components/ui/glass/StatCard.tsx | **keep modified** |
| 22 | `tailwind.config.ts` | Approved working set | Tailwind configuration | None | **keep modified** |
| 23 | `tsconfig.json` | Approved working set | TypeScript configuration | None | **keep modified** |

---

## 3. Explicit Confirmations

1. **`src/types/index.ts` is deleted intentionally:**
   - Deleted in commit `3ab9eb4` during migration from legacy CIPHER types.
   - In Phase 2, the user explicitly approved **Option B for `useDeviceTier.ts`** (keeping `DeviceTier` exported directly from `src/hooks/useDeviceTier.ts`).
   - All consumers (`MoonScene.tsx`, `Moon.tsx`, `OrbitalSystem.tsx`) import `DeviceTier` directly from `@/hooks/useDeviceTier`.
   - Verified: `npx tsc --noEmit` and `npm run build` pass with 0 errors without `src/types/index.ts`.

2. **Zero Missing Dependencies:**
   - Not a single file in `src/` references any of the 64 deleted files.
   - All 64 deleted files are legacy CIPHER artifacts that have either been completely superseded by Moon Sanctum Labs equivalents or retired.

## 4. "Needs Approval" Items for User Decision

The following items are marked **`needs approval`** for your explicit decision:

1. **Repository Root Documents (`LICENSE`, `README.md`):**
   - `LICENSE`: Legacy CIPHER MIT License deleted. *Decision required:* Keep as deleted, or create new Moon Sanctum Labs LICENSE?
   - `README.md`: Legacy CIPHER README deleted. *Decision required:* Keep as deleted, or generate a Moon Sanctum Labs README.md?
2. **Infrastructure Configurations (`firestore.rules`, `render.yaml`):**
   - `firestore.rules`: Legacy CIPHER rules deleted. *Decision required:* Keep as deleted, or retain/update?
   - `render.yaml`: Legacy CIPHER Render blueprint deleted. (Default stack is Vercel). *Decision required:* Keep as deleted?
3. **Legacy Public Assets (`public/*` - 19 files):**
   - Legacy CIPHER icons (`apple-icon-180.png`, `icon-*.png`, `favicon.ico`) and vector logos (`logo-*.svg`, `wordmark-*.svg`, `mark-*.svg`).
   - The current Moon Sanctum Labs site uses `src/app/icon.svg` for favicon/app icon.
   - *Decision required:* Keep all 19 legacy assets as deleted, or should specific Moon Sanctum Labs brand SVGs from `agency/brand/` be placed in `public/`?
