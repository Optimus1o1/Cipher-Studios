# Public Assets Review: 3D Moon Models & Textures

**Project:** Moon Sanctum Labs website  
**Date:** 2026-10-25  
**Status:** Post-Cleanup Audit & Licensing Assessment  
**Working Branch:** `chore/moon-asset-cleanup`

---

## 1. Remaining Active Moon Assets

Following the targeted repository cleanup, exactly 4 files are retained in `public/models/moon/` and `public/textures/moon/`. Every retained file is actively loaded and required by the application.

| File | Size (Bytes) | Formatted Size | Loaded by Code? | Referencing Component / Module | Purpose in Application |
|---|---|---|:---:|---|---|
| `public/models/moon/lunarCubicMesh.js` | 33,874 B | 33.08 KB | **Yes** | `src/lib/lunarCubicGeometry.ts` (consumed by `src/components/three/Moon.tsx`) | Authentic 6-sided spherified-cube vertex and UV coordinate dataset (`LUNAR_CUBE_DATA`, `LUNAR_BASIS`) used to build uniform-density, zero-pinch lunar sphere geometry. |
| `public/textures/moon/Diffuse_2K.jpg` | 991,999 B | 968.75 KB | **Yes** | `src/components/three/Moon.tsx` | High-resolution cubic diffuse color texture map applied to the 3D Moon surface. |
| `public/textures/moon/Bump_2K.jpg` | 559,286 B | 546.18 KB | **Yes** | `src/components/three/Moon.tsx` | High-resolution cubic elevation displacement/bump map applied to the 3D Moon surface. |
| `public/textures/moon/moon_1024.jpg` | 238,093 B | 232.51 KB | **Yes** | `src/components/landing/StaticMoon.tsx` | Equirectangular lunar albedo map used as CSS background texture for the lightweight 2D static moon preview on `/website-review`. |

---

## 2. Disposition of Removed Assets

All unreferenced assets identified during the Phase 1 independent audit have been permanently removed from the repository and working disk:

| File Removed | Size | Original Git Status | Disposition | Verification & Justification |
|---|---|:---:|:---:|---|
| `public/models/moon/Moon_2K.obj` | 47.82 KB | Tracked | **Removed via `git rm`** | Confirmed zero references in `src/`. No `OBJLoader` or runtime parser used in the app. Raw 3D mesh from TurboSquid preview. |
| `public/models/moon/Moon_2K.mtl` | 0.24 KB | Tracked | **Removed via `git rm`** | Confirmed zero references in `src/`. No material loader used. Accompanied the unused `.obj` file. |
| `public/textures/moon/moon_2k.jpg` | 259.52 KB | Tracked | **Removed via `git rm`** | Confirmed zero references in `src/`. Redundant duplicate equirectangular map. |
| `public/textures/moon/moon_map.jpg` | 259.52 KB | Tracked | **Removed via `git rm`** | Confirmed zero references in `src/`. Identical byte-for-byte duplicate of `moon_2k.jpg`. |
| `public/textures/moon/Bump_2K.png` | 3.16 MB | Untracked | **Deleted from disk** | Confirmed zero references in `src/`. Uncompressed PNG duplicate; code loads `Bump_2K.jpg`. |
| `public/textures/moon/Diffuse_2K.png` | 3.80 MB | Untracked | **Deleted from disk** | Confirmed zero references in `src/`. Uncompressed PNG duplicate; code loads `Diffuse_2K.jpg`. |

> **Critical Note on `lunarCubicMesh.js`:**  
> The preliminary audit draft initially categorized `lunarCubicMesh.js` as an unused asset candidate. However, Phase 1 deep-search revealed that `src/lib/lunarCubicGeometry.ts` line 15 explicitly executes:  
> `import { LUNAR_CUBE_DATA, LUNAR_BASIS } from '../../public/models/moon/lunarCubicMesh';`  
> which is imported by `src/components/three/Moon.tsx` to construct the 3D Moon sphere. Deleting this file would break compilation and runtime rendering. In adherence to preservation rules, `lunarCubicMesh.js` is **strictly preserved**.

---

## 3. Licensing, Provenance & Attribution Audit

The application's Moon rendering pipeline relies on two distinct sources of lunar data:

### A. `public/textures/moon/moon_1024.jpg`
- **Known Source:** USGS Astrogeology Science Center / NASA Lunar Reconnaissance Orbiter Camera (LROC) / Clementine mission global lunar mosaic.
- **Available Terms:** United States Government / NASA work in the public domain under 14 CFR § 1217.102 and US Copyright Law (17 U.S.C. § 105).
- **Commercial Use & Redistribution:** **Permitted** for commercial website use without payment or royalty.
- **Attribution:** NASA/GSFC/Arizona State University or USGS acknowledgment is standard courtesy, though not legally restrictive.
- **Licensing Risk:** **Minimal / Clean (Public Domain).**

### B. `lunarCubicMesh.js`, `Diffuse_2K.jpg`, and `Bump_2K.jpg`
- **Known Source:** Accompanied the TurboSquid 3D asset package titled "Moon Photorealistic" (referenced directly in file headers and `lunarCubicGeometry.ts:4`).
- **Available Terms / Licence Status:**
  - TurboSquid standard 3D Model License Agreement permits embedding 3D assets in digital software, games, and web applications provided the raw 3D mesh files (`.obj`, `.fbx`, `.max`, `.c4d`) are **not** distributed in an open, standalone extractable form.
  - The raw geometry files (`Moon_2K.obj`, `Moon_2K.mtl`) have been **completely purged** from the repository, substantially lowering distribution risk.
  - However, the underlying texture maps (`Diffuse_2K.jpg`, `Bump_2K.jpg`) and spherified cube vertex mappings in `lunarCubicMesh.js` originated from this package.
- **Commercial Use & Redistribution Findings:**
  - If the original TurboSquid asset was acquired under a "Royalty Free" license by the agency or developer, commercial website usage and distribution as compiled web assets is generally permitted under TurboSquid Section 2 ("Permitted Uses").
  - If the asset was downloaded as a sample/free preview without a paid commercial license record on file, public commercial deployment poses copyright exposure under TurboSquid terms.
- **Unresolved Licensing Questions:**
  1. *Purchase Record:* Does Moon Sanctum Labs or Aniket Nandi have a receipt or license order ID from TurboSquid for "Moon Photorealistic"? (Status: **TBC — Pending Agency Confirmation**).
  2. *Alternative Open-Source Fallback:* If a formal TurboSquid commercial license is not on record, the 6-sided cubic maps can be replaced in a future phase with pure NASA Scientific Visualization Studio (SVS) CGI Moon Kit 2019/2021 displacement and color maps (freely available for commercial and public use with NASA credit).
- **Licensing Risk Assessment:**
  - **Medium.** Removing the raw OBJ/MTL files resolved raw 3D asset redistribution concerns. To reach **Zero Risk** before client handover or live public domain launch, the agency should either:
    1. Verify the TurboSquid order receipt in agency records, or
    2. Swap the textures/mesh with NASA SVS CGI Moon Kit open assets in a planned follow-up maintenance phase.
