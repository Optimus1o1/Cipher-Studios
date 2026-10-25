import * as THREE from 'three';

function hs(a: number, b: number, c: number): number {
  const n = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function vn(x: number, y: number, z: number): number {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const k = Math.floor(z);
  let u = x - i;
  let v = y - j;
  let w = z - k;
  u *= u * (3 - 2 * u);
  v *= v * (3 - 2 * v);
  w *= w * (3 - 2 * w);

  return lerp(
    lerp(
      lerp(hs(i, j, k), hs(i + 1, j, k), u),
      lerp(hs(i, j + 1, k), hs(i + 1, j + 1, k), u),
      v
    ),
    lerp(
      lerp(hs(i, j, k + 1), hs(i + 1, j, k + 1), u),
      lerp(hs(i, j + 1, k + 1), hs(i + 1, j + 1, k + 1), u),
      v
    ),
    w
  );
}

function fb(x: number, y: number, z: number, octaves: number): number {
  let s = 0;
  let a = 0.5;
  for (let i = 0; i < octaves; i++) {
    s += a * vn(x, y, z);
    x *= 2.03;
    y *= 2.03;
    z *= 2.03;
    a *= 0.5;
  }
  return s;
}

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

let cachedTexture: THREE.CanvasTexture | null = null;

export function generateMoonTexture(isMobile: boolean = false): THREE.CanvasTexture {
  if (cachedTexture) return cachedTexture;

  const W = isMobile ? 512 : 1024;
  const H = W / 2;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(W, H);
  const d = imgData.data;
  let o = 0;

  for (let py = 0; py < H; py++) {
    const la = (py / H - 0.5) * Math.PI;
    const cl = Math.cos(la);
    const Y = Math.sin(la);

    for (let px = 0; px < W; px++) {
      const lo = (px / W) * 6.2832;
      const X = cl * Math.cos(lo);
      const Z = cl * Math.sin(lo);

      const hi = fb(X * 4 + 3, Y * 4, Z * 4, isMobile ? 4 : 5);
      const ma = smoothstep(0.47, 0.58, fb(X * 1.5 + 9, Y * 1.5 + 2, Z * 1.5, 3));
      const gr = vn(X * 90, Y * 90, Z * 90);

      let val = 0.7 + 0.5 * (hi - 0.5) - ma * 0.3 + 0.05 * (gr - 0.5);
      val = Math.min(1, Math.max(0, val)) * 255;

      d[o++] = Math.min(255, val * 1.02);
      d[o++] = Math.min(255, val * 0.99);
      d[o++] = Math.min(255, val * 0.94);
      d[o++] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Add realistic impact craters with cylindrical projection warping correction
  const craterCount = isMobile ? 260 : 580;
  for (let n = 0; n < craterCount; n++) {
    const cx = Math.random() * W;
    const cla = Math.asin(2 * Math.random() - 1);
    const cy = (cla / Math.PI + 0.5) * H;
    const r = 2 + Math.pow(Math.random(), 3.2) * H * 0.09;
    const sx = 1 / Math.max(0.28, Math.cos(cla));

    for (let wr = -1; wr <= 1; wr++) {
      ctx.save();
      ctx.translate(cx + wr * W, cy);
      ctx.scale(sx, 1);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.2);
      g.addColorStop(0, 'rgba(18, 18, 22, 0.42)');
      g.addColorStop(0.62, 'rgba(18, 18, 22, 0.22)');
      g.addColorStop(0.82, 'rgba(255, 255, 255, 0.35)');
      g.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;

  cachedTexture = texture;
  return texture;
}
