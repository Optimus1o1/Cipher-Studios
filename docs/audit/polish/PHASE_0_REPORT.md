# Phase 0 Report: Baseline Audit

**Project:** Moon Sanctum Labs website  
**Date:** 26 October 2026  
**Branch:** `feature/services-visual-polish`  
**Working Directory:** `c:\Users\ANIKET\OneDrive\Documents\CIPHER Studios`  

---

## 1. Git Status & Commit History

### `git status`
```text
On branch feature/services-visual-polish
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	docs/audit/polish/

nothing added to commit but untracked files present (use "git add" to track)
```

### `git log --oneline -3`
```text
151d841 revert(moon): restore previous 3d moon model and cubic projection textures
7ab69db feat(services): clean overview service labels and add accent connector lines
b5ff80b chore: resolve moon asset licensing
```

---

## 2. Baseline Viewport Screenshots

Captured live on `http://localhost:3000/services` via Chrome DevTools Protocol:
- **1920 × 1080 (Primary Desktop):** `docs/audit/polish/baseline_1920.png` (1,353,589 bytes)
- **1440 × 900 (Laptop):** `docs/audit/polish/baseline_1440.png` (956,229 bytes)
- **1280 × 720 (Small Desktop):** `docs/audit/polish/baseline_1280.png` (669,827 bytes)
- **768 × 1024 (Tablet Portrait):** `docs/audit/polish/baseline_768.png` (824,155 bytes)
- **390 × 844 (Mobile):** `docs/audit/polish/baseline_390.png` (367,778 bytes)

---

## 3. Current System Parameter Values

| Parameter | Current Baseline Value | Target Approved Value |
| :--- | :--- | :--- |
| **Overview Scale (Desktop)** | `0.62` | `0.72` (Phase 3) |
| **Overview Scale (Mobile)** | `0.40` | `0.46` (Phase 3) |
| **Body Base Colour** | `#1c1e24` (metalness: 0.60, roughness: 0.45) | `#252932` (Phase 3) |
| **Panel Navy Colour** | `#0c1527` / diffuse base `#081020` | `#142848` (Phase 3) |
| **Body Rim Light** | None (emissive: 0) | Material Fresnel rim (`#cfd8ff`, $\le 0.25$) (Phase 3) |
| **Instrument Rings** | Partially floating collars | Attached with mounts / unified groups (Phase 3) |
| **Base Angles (rad)** | `0.20`, `0.70`, `2.38`, `3.25`, `4.15`, `5.50` | Equidistant $60^\circ$ ($\pi/3$ rad) spacing (Phase 4) |
| **Orbit Radii** | `[2.95, 3.55, 3.62, 2.92, 3.52, 3.48]` | Tuned for margins only (Phase 4) |
| **Orbit Speeds** | `[0.038, 0.034, 0.036, 0.035, 0.037, 0.033]` | Equal within $\le 5\%$ (Phase 4) |
| **Orbit Lines** | None / invisible | 1px line, `#ECEEF4` at 10–15% opacity, depth-tested (Phase 4) |
| **Label Font** | `font-mono` (monospace) | Body font `font-sans` (Inter) (Phase 2) |
| **Label Case & Size** | Uppercase (`uppercase`), 11px/12px | Sentence case, 13px, weight 500, letter-spacing 0.02em (Phase 2) |
| **Label Colour** | `#ECEEF4` at 85% opacity | `#ECEEF4` at 90% opacity, shadow `0 1px 8px rgba(5,6,13,0.9)` (Phase 2) |
| **Hero Scrim** | None | Radial gradient scrim behind text block (Phase 1) |
| **Subtitle Colour & Shadow**| `text-mute` (`#8B9099`), no shadow | `#C9CEDC`, shadow `0 1px 12px rgba(5,6,13,0.8)` (Phase 1) |

---

## 4. 30-Second Samples Recording

- Recorded 120 live samples over 30 seconds (every 250 ms) at 1920 × 1080 via Chrome CDP listening to the `msl-orbital-coords-sync` event.
- Stored raw data at `docs/audit/polish/baseline_samples.json`.
- Each sample contains satellite projected silhouette coordinates (`minX`, `maxX`, `minY`, `maxY`, `width`, `height`), `behindMoon` flags, and label bounding boxes.

---

## 5. Moon-Only Baseline Crop

- **File:** `docs/audit/polish/baseline_moon_region.png`
- **Region:** 300 × 300 px crop from coordinates `(x: 810, y: 550)` at 1920 × 1080 (lower central disc of Moon).
- **Verification:** Region confirmed to lie strictly over the Moon disc without any intersecting text, hero header, or floating labels. Serves as reference image for all future pixel-difference checks ($\Delta \le 1.0$).
