# Public Assets Review: 3D Moon Models & Textures

**Project:** Moon Sanctum Labs website  
**Date:** 2026-10-25  
**Status:** Licensing Resolution Completed (Zero Risk — 100% Public Domain & Original Math)  
**Working Branch:** `fix/moon-asset-licensing`

---

## 1. Executive Summary & Licensing Decision

During the targeted repository audit, three core assets were investigated for commercial distribution rights:
- `public/models/moon/lunarCubicMesh.js`
- `public/textures/moon/Diffuse_2K.jpg`
- `public/textures/moon/Bump_2K.jpg`

A thorough review of repository documentation, commit history, invoices, purchase receipts, and agency records revealed **zero verifiable license documentation** establishing commercial rights for the TurboSquid "Moon Photorealistic" package.

In accordance with agency governance and the strict decision rule (**Path B**), undocumented proprietary assets cannot be assumed to be licensed for commercial deployment. Consequently:
1. All three unverified third-party assets have been **permanently removed** from the repository via `git rm`.
2. The proprietary mesh dependency in `src/lib/lunarCubicGeometry.ts` was replaced with an **original mathematical parametric sphere** implementation with canonical astronomical coordinates (+Y: North, -Y: South, +Z: Near Side) and seamless equirectangular UV mapping.
3. The surface texture maps in `src/components/three/Moon.tsx` were replaced with official, verified **NASA Scientific Visualization Studio (SVS) CGI Moon Kit** public-domain assets.
4. The website's Moon appearance, lighting, rotation, libration, orbital satellite fleet, and interactive service labels are **fully preserved**.

---

## 2. Active Lunar Assets Inventory

Following the licensing resolution, exactly 3 lunar texture assets are retained in the project. Every retained asset is actively loaded by application code and possesses verifiable public-domain provenance:

| Asset Path | Size (Bytes) | Dimensions | Loaded By | Source & Provenance | License Status | Commercial Use Permitted? |
|---|---|---|---|---|---|:---:|
| `public/textures/moon/lroc_color_2k.jpg` | 457,942 B | 2048 × 1024 | `src/components/three/Moon.tsx` | NASA Scientific Visualization Studio (SVS Studio 4720), CGI Moon Kit. Adapted from LRO Camera (LROC) Hapke Normalized WAC global mosaic. Visualizer: Ernie Wright (USRA), Scientist: Noah Petro (NASA/GSFC). | **Public Domain** (17 U.S.C. § 105; 14 CFR § 1217.102) | **Yes** |
| `public/textures/moon/ldem_3_8bit.jpg` | 111,552 B | 1024 × 512 | `src/components/three/Moon.tsx` | NASA SVS Studio 4720, CGI Moon Kit. Gridded global elevation/displacement map from the Lunar Orbiter Laser Altimeter (LOLA) instrument team. | **Public Domain** (17 U.S.C. § 105) | **Yes** |
| `public/textures/moon/moon_1024.jpg` | 238,093 B | 1024 × 512 | `src/components/landing/StaticMoon.tsx` | USGS Astrogeology Science Center / NASA LROC global lunar mosaic. Used as CSS background for lightweight 2D static moon on `/website-review`. | **Public Domain** (17 U.S.C. § 105) | **Yes** |

---

## 3. Procedural Geometry Implementation

- **Module:** `src/lib/lunarCubicGeometry.ts`
- **Exported Function:** `createCubicMoonGeometry(radius: number = 1.7, subdivisions: number = 4): THREE.BufferGeometry`
- **Implementation:** 100% original procedural mathematical formulation.
- **Key Characteristics:**
  1. **Zero Proprietary Data:** Completely eliminates the import of `lunarCubicMesh.js` (`LUNAR_CUBE_DATA` and `LUNAR_BASIS`).
  2. **Canonical Astronomical Coordinates:** Parametric spherical mapping orienting latitude $\phi \in [-\pi/2, +\pi/2]$ along Y (+Y: North Pole, -Y: South Pole) and longitude $\theta \in [-\pi, +\pi]$ with prime meridian $\theta = 0$ (near side) facing the camera along +Z.
  3. **High Tessellation Silhouette:** Dynamic subdivision scaling ($128 \times 96$ segments on desktop, $96 \times 72$ on mobile) producing over 24,500 triangles and ensuring sub-pixel circular silhouette precision ($< 0.03\%$ deviation from ideal circle).
  4. **Seamless UV Seam Handling:** Explicit dual-vertex meridian unwrapping ($u=0.0$ and $u=1.0$ at the far-side meridian) preventing texture tearing or UV seam artifacts.
  5. **Exact Analytical Normals:** Outward unit normal vectors $\vec{n} = \vec{p} / \|\vec{p}\|$ computed analytically for physically accurate lighting and bump relief perturbation.

---

## 4. Removed Assets Log

The following files have been removed from the repository to eliminate copyright and licensing risk:

| File Removed | Size | Original Source | Removal Method | Rationale & Justification |
|---|---|---|:---:|---|
| `public/models/moon/lunarCubicMesh.js` | 33.08 KB | TurboSquid "Moon Photorealistic" | `git rm` | Proprietary mesh vertex and basis data extracted without verified commercial license. Replaced by original procedural geometry. |
| `public/textures/moon/Diffuse_2K.jpg` | 968.75 KB | TurboSquid "Moon Photorealistic" | `git rm` | Proprietary cubic diffuse map without verified commercial license. Replaced by official NASA SVS LROC 2K color map. |
| `public/textures/moon/Bump_2K.jpg` | 546.18 KB | TurboSquid "Moon Photorealistic" | `git rm` | Proprietary cubic bump map without verified commercial license. Replaced by official NASA SVS LOLA elevation map. |
| `public/models/moon/Moon_2K.obj` | 47.82 KB | TurboSquid "Moon Photorealistic" | `git rm` (earlier cleanup) | Raw uncompiled 3D mesh. |
| `public/models/moon/Moon_2K.mtl` | 0.24 KB | TurboSquid "Moon Photorealistic" | `git rm` (earlier cleanup) | Material file accompanying unused OBJ. |
| `public/textures/moon/moon_2k.jpg` | 259.52 KB | Redundant duplicate | `git rm` (earlier cleanup) | Redundant unreferenced file. |
| `public/textures/moon/moon_map.jpg` | 259.52 KB | Redundant duplicate | `git rm` (earlier cleanup) | Byte-for-byte duplicate of `moon_2k.jpg`. |

---

## 5. NASA Attribution & Provenance Record

In compliance with NASA Media Usage Guidelines and standard academic attribution:

- **Source Entry:** NASA Scientific Visualization Studio, Entry 4720: *"CGI Moon Kit"* ([https://svs.gsfc.nasa.gov/4720](https://svs.gsfc.nasa.gov/4720))
- **Visualizer:** Ernie Wright (USRA)
- **Scientist:** Noah Petro (NASA/GSFC)
- **Primary Datasets:**
  1. *LROC WAC Color Mosaic* (Natural Color Hapke Normalized WAC Mosaic), Lunar Reconnaissance Orbiter Camera, Arizona State University / NASA GSFC.
  2. *LOLA Digital Elevation Model* (DEM), Lunar Orbiter Laser Altimeter, NASA GSFC.
- **Legal Terms:** NASA imagery and data products are not protected by copyright within the United States unless specified (17 U.S.C. § 105). May be used for educational, informational, and commercial purposes.
- **Disclaimer:** The use of NASA imagery does not imply or constitute an endorsement by NASA or the United States Government of Moon Sanctum Labs, its products, or its services.

---

## 6. Risk Assessment Summary

- **Commercial Licensing Risk:** **Zero / Clean**
- **Geometry Risk:** **Zero** (100% original procedural mathematical implementation)
- **Texture Risk:** **Zero** (100% official US Government / NASA Public Domain)
- **Application Compatibility:** **Verified** (Zero console errors, zero failed network requests, clean TypeScript compilation, clean production build).
