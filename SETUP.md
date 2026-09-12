# CIPHER Studios — Production Setup & Deployment Guide
**Decode. Build. Evolve.**

This document provides complete instructions for configuring, running, securing, and deploying the CIPHER web agency platform.

---

## 1. Local Development

### Prerequisites
- Node.js `v18+` or `v20+` (LTS recommended)
- npm or pnpm

### Quick Start
1. Clone the repository and navigate into the workspace:
   ```bash
   cd "CIPHER Studios"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env.local
   ```
4. Run the local development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Firebase Setup & Security Configuration

### Step A: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project**, name it `cipher-studios` (or your preferred name), and disable Google Analytics unless required.
3. In Project Settings &rarr; **General**, click the Web icon (`</>`) to create a Web App.
4. Copy the `firebaseConfig` keys into `.env.local` as `NEXT_PUBLIC_FIREBASE_*`.

### Step B: Enable Firestore Database
1. In the Firebase console left rail, click **Firestore Database** &rarr; **Create database**.
2. Select your closest region (e.g., `asia-south1` for Mumbai / Kolkata).
3. Choose **Production mode**.

### Step C: Deploy Security Rules
Deploy `firestore.rules` using the Firebase CLI or paste directly into the Firebase Console &rarr; Firestore Database &rarr; **Rules** tab:
```bash
firebase deploy --only firestore:rules
```
The rules guarantee:
- `leads`: Public create-only with schema validation; read/update/delete restricted to admin.
- `users`: User self-access only (`request.auth.uid == userId`).
- `portfolio` / `testimonials`: Public read, admin-only write.
- Catch-all default deny.

### Step D: Setting Admin Custom Claims
To grant admin privileges to Aniket Nandi's user account:
Run this script once via Node.js with Firebase Admin SDK credentials:
```javascript
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Set custom user claims on this specific UID
async function makeAdmin(uid) {
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  console.log(`Successfully granted admin privileges to UID: ${uid}`);
}

makeAdmin('YOUR_USER_UID_HERE');
```

---

## 3. Deploying to Render

This project is configured as a Node.js Web Service on **Render** (via `render.yaml`).

1. Connect your GitHub repository to [Render.com](https://render.com).
2. Create a new **Web Service** or use **Blueprint** pointing to `render.yaml`.
3. Set the build settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Node Version**: `20.x` or newer.
4. Under **Environment Variables**, add the variables documented in `.env.example`.
5. Click **Deploy**. Render will build and deploy the Next.js production bundle with automatic HTTPS and health check monitoring on `/`.

---

## 4. Understanding & Testing the Device-Tier Gate

The site implements `useDeviceTier()` in `src/hooks/useDeviceTier.ts` to guarantee a 60fps frame rate and Lighthouse &ge; 90 on mobile devices.

### The Three Tiers:
| Tier | Trigger Conditions | Scene Rendered |
|---|---|---|
| **`full`** | &ge;4 CPU cores, &ge;4 GB RAM, and passes ~50fps rAF probe | Interactive `@react-three/fiber` 3D canvas with RoundedBox cubes, cursor parallax, and scroll-linked state interpolation. |
| **`lite`** | <4 CPU cores, <4 GB RAM, or throttled GPU | Lightweight CSS-animated representation of the 3x3 matrix C grid (`FallbackGrid.tsx`). Zero WebGL overhead. |
| **`off`** | `prefers-reduced-motion: reduce` requested | Fully static pre-assembled matrix C grid with zero motion. Fully accessible. |

### How to Test Each Tier in Chrome DevTools:
1. **Testing `off` tier (Accessibility / Reduced Motion):**
   - Open DevTools &rarr; `Ctrl + Shift + P` (or `Cmd + Shift + P`).
   - Type `Rendering` and select **Show Rendering**.
   - Under **Emulate CSS media feature prefers-reduced-motion**, select **prefers-reduced-motion: reduce**.
   - Refresh the page: the canvas switches to the static `FallbackGrid` instantly.

2. **Testing `lite` tier (Low-End Mobile Profile):**
   - In DevTools, open the **Performance** tab &rarr; click the gear icon.
   - Set **CPU** to **4x slowdown** or **6x slowdown**.
   - Under **Network**, select **Slow 3G** or **Fast 3G**.
   - The ~300ms rAF probe detects dropped frames and gracefully falls back to `lite` tier.

3. **Testing `full` tier (Desktop / Modern Flagship):**
   - Standard conditions: WebGL canvas renders at 60fps with capped DPR of 2.
