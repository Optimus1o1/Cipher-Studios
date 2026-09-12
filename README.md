# CIPHER — Decode. Build. Evolve.

> High-performance digital flagships, web applications, and conversion architecture. Built with Next.js 14 App Router, TypeScript, Tailwind CSS, and a persistent 60FPS Three.js WebGL background system.

---

## Brand & Philosophy

- **Name**: CIPHER
- **Slogan**: *Decode. Build. Evolve.*
- **The Three Laws**:
  1. **Decode.** — Uncovering the business requirement beneath the request. Rigorous discovery before a single line of code.
  2. **Build.** — Engineered without shortcuts, bloated templates, or technical debt. Sub-second page speeds, mobile-first responsive architecture, and Lighthouse 95+ score floors.
  3. **Evolve.** — Launch is day zero. Continuous telemetry, conversion funnel intelligence, and performance tuning.

---

## Technical Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with bespoke Glassmorphism Design System tokens (Ink `#0F1013`, Bone `#F2EFE8`, Copper `#E0A45C`, Slate `#8B9099`)
- **3D & WebGL**: [Three.js](https://threejs.org/) + [React Three Fiber](https://r3f.docs.pmnd.rs/) (`GlobalSpaceBackground.tsx` — single persistent canvas with 3D CIPHER matrix reveal & continuous zero-G floating field)
- **Motion & Scroll**: [GSAP](https://greensock.com/gsap/) + [Lenis](https://lenis.darkroom.engineering/) smooth scrolling
- **Backend & Auth**: Firebase / Firebase Admin SDK + Auth.js
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started

### 1. Prerequisites
- Node.js 18.17+ or 20+
- npm, pnpm, or yarn

### 2. Installation
```bash
git clone https://github.com/Optimus1o1/cipher-studios.git
cd cipher-studios
npm install
```

### 3. Environment Setup
Copy the example environment file and configure your variables:
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. Production Build
```bash
npm run build
npm start
```

---

## Architecture Highlights

- **Single Persistent WebGL Canvas**: Zero multi-canvas lag. A single instanced WebGL canvas runs globally behind all sections with toroidal viewport wrapping.
- **Scroll-Driven Brand Reveal**: Seamless transition from cosmic starfield assembly to right-shifted lockup docking directly into the glass navigation.
- **Interactive 3-Phase Process Section**: Stepper card architecture with instantaneous phase switching and zero scroll jumping.
- **Client Cockpit Portal**: Real-time project telemetry, deliverables tracking, and phase roadmap.
- **Automated Security Audit Tool**: Live vulnerability scanner simulation and client conversion engine.

---

## License

MIT © [Aniket Nandi](https://github.com/Optimus1o1) — **CIPHER**
