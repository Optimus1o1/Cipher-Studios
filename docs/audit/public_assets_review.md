# Public Assets Review: 3D Moon Models & Textures

**Date:** 2026-10-25  
**Status:** Audit & Licence Exposure Review  

## 1. Summary of Public Moon Assets

| File | Size | Loaded by Code? | Referencing Files in `src/` |
|---|---|:---:|---|
| `public/models/moon/lunarCubicMesh.js` | 33.08 KB | **No** | None |
| `public/models/moon/Moon_2K.mtl` | 0.24 KB | **No** | None |
| `public/models/moon/Moon_2K.obj` | 47.82 KB | **No** | None |
| `public/textures/moon/Bump_2K.jpg` | 546.18 KB | **Yes** | `src/components/three/Moon.tsx` |
| `public/textures/moon/Bump_2K.png` | 3.16 MB | **No** | None |
| `public/textures/moon/Diffuse_2K.jpg` | 968.75 KB | **Yes** | `src/components/three/Moon.tsx` |
| `public/textures/moon/Diffuse_2K.png` | 3.80 MB | **No** | None |
| `public/textures/moon/moon_1024.jpg` | 232.51 KB | **Yes** | `src/components/landing/StaticMoon.tsx` |
| `public/textures/moon/moon_2k.jpg` | 259.52 KB | **No** | None |
| `public/textures/moon/moon_map.jpg` | 259.52 KB | **No** | None |

## 2. Key Findings & Licence Exposure

1. **Source OBJ/MTL Files:**
   - `public/models/moon/Moon_2K.obj` (47.82 KB) and `public/models/moon/Moon_2K.mtl` (0.24 KB) are raw 3D mesh files.
   - **Application Code Status:** **NOT loaded by code.** `src/components/three/Moon.tsx` uses procedural sphere geometry (`<sphereGeometry args={[2.0, 64, 64]} />`) combined with custom shaders and texture maps, or the procedural cubic geometry in `src/lib/lunarCubicGeometry.ts`.
   - **Licence Implication:** Because the OBJ/MTL files originated from a 3D asset preview and are not consumed anywhere in application code, removing them will eliminate unnecessary public exposure without affecting runtime rendering.

2. **Texture Maps:**
   - `public/textures/moon/Diffuse_2K.jpg` (968.75 KB) and `public/textures/moon/Bump_2K.jpg` (546.18 KB) are **actively loaded** by `src/components/three/Moon.tsx` using Three.js `useTexture` for the photorealistic lunar surface displacement and color map.
   - Redundant fallback textures (`moon_1024.jpg`, `moon_2k.jpg`, `moon_map.jpg`, and untracked PNG duplicates) are not loaded by application code and can be cleaned up in a future asset pruning pass.
