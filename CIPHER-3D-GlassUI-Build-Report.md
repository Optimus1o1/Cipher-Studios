# CIPHER — Glass UI × 3D Motion Build Report
**Decode. Build. Evolve.**

A complete design + engineering spec for building cipherstudios' own website with Firebase (auth/DB), glass UI, and 3D animation, ready to deploy on Render.

---

## Contents
0. A note on your inputs
1. Design concept — why 3D and glass belong together here
2. Brand system recap
3. Stack additions for 3D
4. Layer architecture — how glass and 3D coexist without killing performance
5. Site map & page-by-page treatment
6. Component inventory
7. Animation choreography
8. Performance & accessibility guardrails
9. Security recap (Firebase)
10. Build roadmap
11. Antigravity prompt (paste-ready, full & updated)

---

## 0. A note on your inputs

You pasted four workflow snippets in one block. Three of them — `/glass-ui`, `/design-system`, `/build-page` — are generic build tools and I've used all three directly below.

The fourth, **"Professional Designer Persona & Design System Workflow,"** is a complete design system for a different product called **UrbanTwin AI** (an ANPR/digital-twin platform), with an obsidian-and-neon "aerospace command cockpit" aesthetic — multiple saturated accent colors (cyan, emerald, amber, crimson, purple), glowing drop-shadows, telemetry sound cues.

I haven't applied it here, because it directly contradicts CIPHER's own rules:
- CIPHER's brand file says **one accent only** (copper) and **"don't add gradients/shadows/outlines."** UrbanTwin uses five neon accents and glow shadows on everything.
- `/glass-ui` itself says **"no neon on glass."** UrbanTwin is built on neon.

If that block was meant for a client project rather than cipherstudios' own site, it's a good spec to run separately — just flag it and I'll build it as its own thing. For your own site, staying inside CIPHER's ink/bone/copper system is what keeps it recognizable as *your* work.

---

## 1. Design concept — why 3D and glass belong together here

Most sites bolt 3D onto glass because it looks impressive. Here it can actually mean something, because your mark is already a spatial system: a 3×3 grid of cells that **decodes** into a C.

The concept — **"The grid beneath the glass":**

A field of soft-shadowed 3D cubes lives behind the interface, using the *exact* cell layout and stagger order already encoded in `Logo.tsx` (bottom row → mid-left → top row, copper cell last). Real content — headlines, copy, forms — sits in glass panels floating above that field. The 3D layer is a literal enlargement of your mark; the glass layer is where the honest, no-hype copy lives. This gives the two techniques a reason to coexist instead of competing for attention.

The three brand words become three literal states of the same 3D scene:

| Act | 3D state | What the visitor sees |
|---|---|---|
| **Decode.** | Cubes scattered, then fly into the grid in the `Logo.tsx` stagger order | Hero load-in |
| **Build.** | Cubes interlock, camera settles, grid tightens | Pinned scroll section |
| **Evolve.** | Grid locked; the copper cube gets a slow, subtle ambient pulse | Resting/idle state after scroll |

Everywhere else on the site (Services, Work, About, Contact, Portal) stays glass-only over a static blurred gradient mesh, per `/glass-ui`'s own `BackgroundScene`. **The live 3D canvas is reserved for the homepage only** — that's a performance decision, explained in §4.

---

## 2. Brand system recap

| Token | Value | Use |
|---|---|---|
| Ink | `#0F1013` | Primary background |
| Bone | `#F2EFE8` | Primary text / bg-on-dark |
| Copper | `#E0A45C` | **Single** accent — CTAs, links, the one copper cell |
| Slate (dark) | `#8B9099` | Secondary text on dark |
| Slate (light) | `#5E636B` | Secondary text on light |

- **Type**: Space Grotesk 500 (wordmark + headings, +10% tracking on the wordmark only) · Manrope 500 (body/UI). Both via `next/font`, both free on Google Fonts.
- **Logo**: `Logo.tsx` ships as-is — don't regenerate it. It already respects `useReducedMotion`, which is the pattern every new animated component below must follow too.
- **Rules that still apply**: one logo treatment per screen, 1-cell clear space, never stretch/recolor/add effects, minimum 120px lockup / 16px mark.

---

## 3. Stack additions for 3D

On top of the Next.js/TypeScript/Tailwind/Framer Motion/GSAP+ScrollTrigger+Lenis stack already agreed:

| Package | Role |
|---|---|
| `three` | Core 3D engine |
| `@react-three/fiber` | React renderer for three.js |
| `@react-three/drei` | Helpers — `RoundedBox`, `Environment`, `PerformanceMonitor` |
| `zustand` | Tiny external store bridging GSAP's scroll timeline into the R3F render loop (GSAP runs outside React's render cycle; the canvas needs to read scroll progress every frame without re-rendering the whole tree) |
| `next/dynamic` (`ssr:false`) | Code-splits the whole 3D bundle out of the initial page load — it never blocks first paint and never runs server-side |

Let Antigravity/npm resolve current stable versions at install time rather than pinning numbers here.

---

## 4. Layer architecture — how glass and 3D coexist without killing performance

Both `backdrop-filter: blur()` and a live WebGL canvas are GPU-expensive on their own. Running both carelessly is how sites end up janky on a two-year-old phone. The stack, back to front:

```
z-0   <Canvas>            3D cube field — pointer-events: none except one
                           invisible raycast plane for cursor parallax
z-1   gradient wash        controllable vignette/tint over the canvas so
      + vignette           text contrast never depends on what the cubes
                           are doing at that instant
z-2   glass panels         ALL real content lives here — nav, headline,
                           copy, buttons, forms
z-3   cursor highlight     optional, subtle, off on touch devices
```

**Hard rules:**
- **Only one live WebGL canvas mounted at a time, site-wide** — the homepage hero/process scroll. Everywhere else uses `/glass-ui`'s static `BackgroundScene` (pre-blurred photo/gradient, no WebGL).
- The canvas **unmounts** via `IntersectionObserver` once scrolled well past — no GPU spend for a scene nobody's looking at.
- No more than **2 glass surfaces** visible over the live canvas at once (tighter than `/glass-ui`'s general "≤6" guard, because the canvas already has a GPU budget of its own).
- **Device-tier gate on mount** — before the canvas ever spins up:

```ts
// src/lib/useDeviceTier.ts
type Tier = "full" | "lite" | "off";

export function useDeviceTier(): Tier {
  const [tier, setTier] = useState<Tier>("off");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return setTier("off");

    const mem = (navigator as any).deviceMemory ?? 4;
    const cores = navigator.hardwareConcurrency ?? 4;
    if (mem < 4 || cores < 4) return setTier("lite");

    // cheap 300ms rAF probe — bails to "lite" if the device can't
    // hold a steady frame rate even before any 3D is drawn
    let frames = 0;
    const start = performance.now();
    function tick() {
      frames++;
      if (performance.now() - start < 300) requestAnimationFrame(tick);
      else setTier(frames >= 15 ? "full" : "lite"); // ~50fps floor
    }
    requestAnimationFrame(tick);
  }, []);

  return tier;
}
```

- `full` → live R3F canvas.
- `lite` → a pre-rendered short WebM loop of the same scene, or a static frame with slow CSS drift (no WebGL at all).
- `off` → static gradient, fully still. Respects `prefers-reduced-motion` and low-end hardware identically.

This is what actually satisfies `/glass-ui`'s "reduce blur on mobile" and "test on a mid-range Android" guards once a live canvas is in the mix — without it, Lighthouse mobile ≥ 90 is not realistic on this design direction.

---

## 5. Site map & page-by-page treatment

**Home** — the only page with the live canvas.
- Nav: `GlassNav`, transparent → glass after 40px scroll. `<Logo size={40} tone="dark" />` in the bar.
- Hero: full-bleed `GridField` canvas (tier `full`/`lite`/`off` as above); a dark-glass headline card on top (H1 + one-line subhead + one copper CTA). Contrast measured against the *busiest* frame of the cube animation, not the background alone.
- Trust strip: a thin glass pill row (years, client count, stack marks) — no 3D.
- Services: 3–6 `StatCard`s per the `/glass-ui` anatomy (icon chip, label, one big figure, small progress dots) — one `AccentCard` (copper gradient) on your flagship service, e.g. Web apps/SaaS MVPs.
- Process (Decode/Build/Evolve): pinned `ScrollGridSection` — GSAP ScrollTrigger scrubs the *same* `GridField` instance through the three acts from §1; a glass copy panel swaps text per act.
- Work: glass cards with a lightweight CSS 3D tilt on mousemove (not R3F — this one's cheap, no canvas needed).
- Testimonials: stacked dark-glass cards, real names + context per `/build-page`.
- Final CTA: one `AccentCard`, no 3D, single copper CTA.
- Footer: wordmark-only lockup, no motion.

**Services / Work / About / Contact** — glass components over a static gradient-mesh `BackgroundScene`. No live canvas — the GPU budget stays on the homepage.

**Portal (`/portal`) & Admin (`/admin`)** — the full `/glass-ui` dashboard shell verbatim: icon-only left rail, pill tabs, greeting line, hero score + range gauge, 2–3 column `StatCard` grid, narrow detail column. **Deliberately no 3D here** — utility screens should load instantly and stay legible, not perform.

---

## 6. Component inventory

**Glass (`src/components/ui/glass/`, from `/glass-ui`, unchanged):**
`GlassCard`, `StatCard`, `GlassNav`, `PillTabs`, `AccentCard`, `ScoreHero`, `Dots`/`Ring`/`MiniBars`, `BackgroundScene`.

**3D (`src/components/three/`, new):**

| Component | Props | Notes |
|---|---|---|
| `GridField` | `act: 'decode'\|'build'\|'evolve'`, `tier`, `interactive` | The persistent cube-field scene |
| `HeroCanvas` | — | Wraps `GridField` + lighting for the hero; lazy-loaded via `next/dynamic` |
| `ScrollGridSection` | — | Pins `GridField` via GSAP ScrollTrigger + Lenis; drives `act` off scroll progress through the zustand bridge |
| `useTilt` (hook) | — | CSS-only 3D tilt for Work cards — no canvas |
| `CubeMaterial` | — | Shared material: ink cubes, bone edge highlight, one copper-emissive cube per stagger group — keeps the 3D palette locked to brand tokens |

```tsx
// src/components/three/GridField.tsx — skeleton
"use client";
import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";

const ORDER = [[0,2],[1,2],[2,2],[0,1],[0,0],[1,0],[2,0]]; // mirrors Logo.tsx exactly

export function GridField({ act, tier }: { act: "decode"|"build"|"evolve"; tier: "full"|"lite" }) {
  const cells = useMemo(() => ORDER.map(([c, r], i) => ({ c, r, i })), []);
  return (
    <group>
      {cells.map(({ c, r, i }) => (
        <RoundedBox key={`${c}${r}`} args={[0.9, 0.9, 0.9]} radius={0.12}
          position={/* act-dependent: scattered for decode, gridded for build/evolve */ [c - 1, 1 - r, 0]}>
          <meshStandardMaterial color={c === 2 && r === 1 ? "#E0A45C" : "#F2EFE8"}
            emissive={c === 2 && r === 1 && act === "evolve" ? "#E0A45C" : "#000"}
            emissiveIntensity={c === 2 && r === 1 && act === "evolve" ? 0.4 : 0} />
        </RoundedBox>
      ))}
    </group>
  );
}
```

This is a starting skeleton, not final code — Antigravity should flesh out the per-act position interpolation and lighting.

---

## 7. Animation choreography

**Hero mount** (mirrors `Logo.tsx` timing, scaled ~3× for a full-bleed field so it reads at size):
- Each cube: `opacity 0→1, scale 0.6→1`, `duration ~1s`, `stagger ~0.25s`, ease `[0.16, 1, 0.3, 1]`, in the exact `ORDER` above.
- Copper cube fires last, ~0.3s after the final bone cube, with a slightly longer, softer ease.

**Scroll section** — GSAP ScrollTrigger, scrubbed:
- 0–33% scroll: `decode` (scattered → assembling)
- 33–66%: `build` (interlock, camera settles)
- 66–100%: `evolve` (locked grid, copper cube starts its idle pulse)

**Hover**: glass cards lift 2–4px + border brightens, 200ms, per `/glass-ui`. Work cards additionally get the CSS tilt from `useTilt`.

**Reduced motion / reduced transparency**: `GridField` renders already-assembled and static — no stagger, no scroll-scrub, no pulse. On `off` tier, skip the canvas entirely in favor of a static gradient. This is a hard requirement, not a nice-to-have — check it explicitly in the browser review step.

---

## 8. Performance & accessibility guardrails

Everything from `/glass-ui`'s guard list still applies (contrast on the busiest background pixel, visible focus rings, `-webkit-backdrop-filter`, no `mix-blend-mode` + `backdrop-filter` together, dark-mode swap). On top of that, for the 3D layer specifically:

- One live canvas maximum, ever, at a time — unmount off-screen via `IntersectionObserver`.
- Cap `Math.min(window.devicePixelRatio, 2)` on the renderer — uncapped DPR on a high-res phone is a common silent frame-rate killer.
- `powerPreference: 'high-performance'` with a graceful fallback if the browser denies it.
- No shadow maps on `lite` tier; keep lighting flat there.
- Canvas is `aria-hidden` — it's decorative. Every real heading/paragraph lives in the DOM inside a glass panel, never baked into the 3D scene or rasterized text.
- Lighthouse mobile ≥ 90 is still the bar from `/build-page` — the device-tier gate in §4 is what makes that achievable with a WebGL hero in the mix. Test on an actual mid-range Android, not just Chrome's CPU throttling.

---

## 9. Security recap (Firebase)

Unchanged from the earlier brief — this round of work is presentation-layer only and doesn't touch the data layer:

- Firestore rules: public create-only on `leads`, self-only on `users`, public-read/admin-write on `portfolio`/`testimonials`, default-deny catch-all.
- Admin access via Firebase custom claims set server-side, never a client-side check.
- App Check (reCAPTCHA) on the Firestore project, rate-limited contact form route.
- Firebase config in env vars only; Admin SDK service account key stays server-only on Render.

One addition specific to this phase: **don't fetch portfolio/testimonial content from Firestore inside the R3F render loop.** Fetch once server-side (ISR or a server component) and pass it down as props — keep the canvas purely visual and dumb, with zero data-layer awareness.

---

## 10. Build roadmap

1. **Tokens + glass shell** — static, no 3D yet. Responsive, password-protected on Render, Lighthouse pass.
2. **Firebase** — auth, `/portal`, `/admin`, security rules, App Check.
3. **Hero 3D field** — `GridField` + `HeroCanvas` + device-tier gate. Ship, verify on a real mid-range Android before moving on.
4. **`ScrollGridSection`** (the Process act), Work card tilt, testimonials.
5. **Content, SEO metadata, OG image, launch.**

Each phase should get its own Implementation Plan and Walkthrough before the next starts, per the usual process.

---

## 11. Antigravity prompt — full & updated (paste this whole block)

```
Build a production website for a web design/dev agency called CIPHER 
("Decode. Build. Evolve.") using this exact stack:

STACK
- Next.js 14+ App Router, TypeScript, Tailwind CSS
- Framer Motion for UI animation; GSAP + ScrollTrigger + Lenis for the
  scroll-driven Process section; React Three Fiber + drei for the 3D
  hero/process scene; zustand as a tiny bridge feeding GSAP scroll
  progress into the R3F render loop
- Firebase Auth (email/password + Google) for a client/admin login area
- Firebase Firestore as the database (contact form leads, testimonials,
  portfolio items)
- Deploy target: Render (Node web service, NOT Firebase Hosting)

BRAND (use exactly, do not alter)
- Name: CIPHER — slogan "Decode. Build. Evolve." (all three periods,
  every time it appears)
- Colors: Ink #0F1013 (bg/dark), Bone #F2EFE8 (text-on-dark), Copper
  #E0A45C (ONE accent only — CTAs, links, the one copper cube/cell),
  Slate #8B9099 (secondary text on dark) / #5E636B (secondary text on
  light). No neon, no gradients beyond the single copper accent card,
  no glows/outlines added to the mark.
- Fonts: Space Grotesk 500 (wordmark + headings, +10% tracking on the
  wordmark only), Manrope 500 (body/UI), both via next/font.
- Logo: I'm supplying Logo.tsx as-is (animated 3x3 "decode" mark using
  framer-motion, respects useReducedMotion) — use it unmodified in nav
  and footer. Also supplied: SVG lockups, OG image, social avatar,
  favicon set.
- Rules: one logo treatment per screen, 1-cell clear space, never
  stretch/recolor/add effects, min 120px lockup / 16px mark.

DESIGN CONCEPT — "the grid beneath the glass"
A field of 3D cubes (RoundedBox geometry) arranged in the exact same
3x3 layout and stagger order as Logo.tsx's ORDER array
([[0,2],[1,2],[2,2],[0,1],[0,0],[1,0],[2,0]]) lives behind the homepage
hero and a pinned scroll section, cycling through three literal states:
- "decode": cubes scattered, fly into the grid on load (mirror
  Logo.tsx's stagger timing: ~duration 0.35s scaled 3x, ease
  [0.16,1,0.3,1], the copper cube animates in last)
- "build": cubes interlock into the tight grid as the user scrolls a
  pinned Process section (GSAP ScrollTrigger, scrubbed 0-66%)
- "evolve": grid locked, copper cube gets a slow ambient emissive pulse
  (66-100% scroll and as the resting state)
Everywhere else on the site (Services, Work, About, Contact, Portal,
Admin) uses glass panels over a STATIC blurred gradient mesh background
— no live WebGL canvas outside the homepage hero/process section.

3D + GLASS PERFORMANCE RULES — DO NOT SKIP
- Only ONE live WebGL canvas mounted at a time, site-wide (the homepage
  hero/process scene). Unmount it via IntersectionObserver once
  scrolled well past.
- Build a useDeviceTier() hook that checks prefers-reduced-motion,
  navigator.deviceMemory, navigator.hardwareConcurrency, and a ~300ms
  requestAnimationFrame probe, returning 'full' | 'lite' | 'off'.
  'full' = live R3F canvas. 'lite' = a pre-rendered short video loop or
  static frame with slow CSS drift, no WebGL. 'off' = fully static
  gradient, no motion. Respect prefers-reduced-motion by always
  returning 'off' and rendering the grid already-assembled and static.
- Cap devicePixelRatio at 2 on the renderer. No shadow maps on 'lite'.
  powerPreference 'high-performance' with graceful fallback.
- No more than 2 glass surfaces visible over the live canvas at once
  (tighter than the general glass guard below).
- Load the whole 3D bundle via next/dynamic with ssr:false so it never
  blocks first paint or runs server-side.
- Canvas is aria-hidden (decorative only) — every real heading/
  paragraph lives in an actual DOM element inside a glass panel, never
  rendered as 3D text or baked into the canvas.
- Don't fetch Firestore data inside the R3F render loop — fetch once
  server-side/ISR, pass down as props. The canvas is visual-only, no
  data-layer awareness.

GLASS UI SYSTEM (apply everywhere per this spec, verbatim)
- Two glass tones: light glass (white 55-70%, dark text) and dark glass
  (charcoal 35-55%, light text — this is the default here since the
  site is ink-first).
- Edges: 1px border rgba(255,255,255,.12) on dark glass, inner top
  highlight inset 0 1px 0 rgba(255,255,255,.12), soft deep shadow
  0 24px 60px -24px rgba(0,0,0,.35). Radius 24-32px on cards, pill radius
  on chips/nav.
- StatCard anatomy: icon chip top-left, round "open" arrow chip
  top-right, optional warning dot, label 13-14px muted, one big numeral
  48-64px medium weight tabular figures, small unit beside it, tiny
  progress visual bottom-right (dots/ring/sparkline) — no charts inside
  cards.
- One AccentCard among neutrals using the copper accent as a gradient,
  reserved for the single most important item per section (flagship
  service on Services, hero CTA on the final section).
- Motion: cards fade+rise on load (opacity 0->1, y 24->0, 600ms, out
  easing, stagger 80ms) — one orchestrated moment per section. Hover:
  lift 2-4px, border brightens, 200ms.
- Guards: contrast measured on the busiest part of whatever's behind the
  glass (photo, gradient, or the live 3D scene) — raise glass opacity
  until body text >=4.5:1 and big numerals >=3:1. Long paragraphs never
  sit directly on glass over a photo/3D scene — put them on a solid
  surface instead. backdrop-filter <=6 surfaces visible at once
  generally (<=2 when a live canvas is also on screen). Respect
  prefers-reduced-transparency (swap to solid backgrounds, no blur).
  Keep -webkit-backdrop-filter for Safari; never combine
  mix-blend-mode with backdrop-filter on the same element.

SITE STRUCTURE
- Home: Nav (GlassNav) -> Hero (3D GridField "decode" state + dark-glass
  headline card, one copper CTA) -> trust strip (glass pills) ->
  Services (StatCards + one AccentCard) -> Process (pinned scroll
  section cycling the GridField through decode/build/evolve with a
  glass copy panel per act) -> Work (glass cards with CSS-only 3D tilt
  on hover, no canvas) -> Testimonials (dark glass cards, real names) ->
  Final CTA (AccentCard) -> Footer (wordmark only)
- Services (detail page or anchors)
- Work/Portfolio (case study cards, [PROJECT TBC] placeholders until real
  work is added)
- About (agency story built around Decode/Build/Evolve)
- Contact (name, email, project type, budget range, message -> Firestore
  `leads` collection, Resend email notification, honeypot field)
- /login and /portal: Firebase Auth (email/password + Google), gated
  glass dashboard shell per the anatomy above (icon rail, pill tabs,
  greeting, hero score, stat card grid, detail column) — NO 3D here
- /admin: view submitted leads, my login only

FIREBASE SECURITY — PRIORITY, DO NOT SKIP
- All Firebase config in environment variables (.env.local dev, Render
  env vars prod). Never hardcoded. .env* in .gitignore.
- firestore.rules, explicit, not test mode:
  - `leads`: public create-only, no read/update/delete except admin
    UID(s)
  - `users`: a user can read/write only their own document
    (request.auth.uid == resource.id)
  - `portfolio` / `testimonials`: public read, admin-only write via
    custom claims
  - default deny-all catch-all at the bottom
- Admin marked via Firebase custom claims set server-side through the
  Admin SDK — never a client-side-only check
- Server-side validation on every write beyond the public lead form
- Firebase App Check (reCAPTCHA v3) enabled on the project
- Rate-limit the contact form submission route
- Admin SDK service account key is server-only (Render env var), never
  shipped to the client
- CSP headers, HTTPS-only, secure cookies for any session handling

QUALITY FLOOR
- Mobile-first, Lighthouse >=90 on mobile (the device-tier gate above is
  what makes this achievable with a WebGL hero — test on an actual
  mid-range Android, not just CPU throttling)
- WCAG AA contrast everywhere, visible focus states, prefers-reduced-
  motion AND prefers-reduced-transparency respected throughout, no
  layout shift, zero console errors
- Real copy only, no lorem ipsum — mark unknowns [CLIENT TO CONFIRM]
- One typographic system (2 families max), one accent color, consistent
  radius family, 8pt spacing

DELIVERABLES
1. Full Next.js project structure
2. firestore.rules (complete, not placeholder)
3. .env.example
4. render.yaml or documented Render deploy settings (build/start command,
   Node version, required env vars)
5. SETUP.md: Firebase project creation, where keys go, how to set admin
   custom claims, how to deploy to Render, and how the device-tier
   fallback works so I know what to test on a low-end phone
```

Attach directly in Antigravity (don't retype): `Logo.tsx`, all SVGs/PNGs, `README.md`, and this report — Antigravity should read the report as context alongside the prompt, not just the prompt in isolation.
