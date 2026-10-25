/**
 * Lunar Procedural Geometry Builder
 * Generates an ultra-smooth spherical BufferGeometry with authentic
 * astronomical coordinate orientation (+Y: North, -Y: South, +Z: Near Side / Prime Meridian),
 * seamless equirectangular UV mapping for NASA LROC & LOLA global mosaics (NASA SVS 4720),
 * and zero reliance on proprietary third-party mesh datasets.
 * 
 * Mathematical Properties:
 * 1. Parametric spherical surface with exact analytical normals n = p / ||p||.
 * 2. Canonical astronomical frame: 0° Lon / 0° Lat (near side center) aligned to +Z.
 * 3. High tessellation density (subdivision-controlled) ensuring sub-pixel circular silhouette.
 * 4. Dual-vertex meridian seam handling ensuring zero texture tearing or UV artifacts.
 */

import * as THREE from 'three';

export function createCubicMoonGeometry(radius: number = 1.7, subdivisions: number = 4): THREE.BufferGeometry {
  const widthSegments = Math.max(32, subdivisions * 32);
  const heightSegments = Math.max(24, subdivisions * 24);

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let y = 0; y <= heightSegments; y++) {
    const v = y / heightSegments;
    const phi = (v - 0.5) * Math.PI;
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);

    for (let x = 0; x <= widthSegments; x++) {
      const u = x / widthSegments;
      const theta = (u - 0.5) * Math.PI * 2;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      const px = radius * cosPhi * sinTheta;
      const py = radius * sinPhi;
      const pz = radius * cosPhi * cosTheta;

      positions.push(px, py, pz);

      const nx = cosPhi * sinTheta;
      const ny = sinPhi;
      const nz = cosPhi * cosTheta;

      normals.push(nx, ny, nz);
      uvs.push(u, v);
    }
  }

  const rowStride = widthSegments + 1;
  for (let y = 0; y < heightSegments; y++) {
    for (let x = 0; x < widthSegments; x++) {
      const a = y * rowStride + x;
      const b = (y + 1) * rowStride + x;
      const c = (y + 1) * rowStride + (x + 1);
      const d = y * rowStride + (x + 1);

      // CCW front-facing winding order
      indices.push(a, d, b);
      indices.push(d, c, b);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

  return geometry;
}

