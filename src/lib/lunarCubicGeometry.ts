/**
 * Lunar Cubic Projection Geometry Builder
 * Generates an ultra-smooth spherified-cube BufferGeometry mapped to the
 * authentic 6-sided cubic projection UV coordinates from TurboSquid "Moon Photorealistic".
 * 
 * Advantages over standard UV-Sphere:
 * 1. Zero polar pinching or distortion at North and South poles.
 * 2. Uniform texel density across the entire sphere.
 * 3. Exact matching UV coordinates for Diffuse_2K and Bump_2K cubic texture maps.
 * 4. Perfectly round silhouette (every vertex normalized to spherical radius).
 * 5. Pre-oriented in canonical astronomical coordinates (+Y: North, -Y: South, +Z: Near Side).
 */

import * as THREE from 'three';
import { LUNAR_CUBE_DATA, LUNAR_BASIS } from '../../public/models/moon/lunarCubicMesh';

export function createCubicMoonGeometry(radius: number = 2.0, subdivisions: number = 4): THREE.BufferGeometry {
  const { v: rawPositions, vt: rawUVs, f: rawFaces } = LUNAR_CUBE_DATA;
  const { nX, nY, nZ } = LUNAR_BASIS;

  function dot(a: number[], b: number[]): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function transform(p: number[]): [number, number, number] {
    return [dot(nX, p), dot(nY, p), dot(nZ, p)];
  }

  const N = Math.max(1, Math.min(subdivisions, 8));
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];

  for (const f of rawFaces) {
    const p0 = transform(rawPositions[f[0][0]]);
    const p1 = transform(rawPositions[f[1][0]]);
    const p2 = transform(rawPositions[f[2][0]]);
    const p3 = transform(rawPositions[f[3][0]]);

    const uv0 = rawUVs[f[0][1]];
    const uv1 = rawUVs[f[1][1]];
    const uv2 = rawUVs[f[2][1]];
    const uv3 = rawUVs[f[3][1]];

    function evalPoint(u: number, v: number) {
      const w00 = (1 - u) * (1 - v);
      const w10 = u * (1 - v);
      const w11 = u * v;
      const w01 = (1 - u) * v;

      const x = w00 * p0[0] + w10 * p1[0] + w11 * p2[0] + w01 * p3[0];
      const y = w00 * p0[1] + w10 * p1[1] + w11 * p2[1] + w01 * p3[1];
      const z = w00 * p0[2] + w10 * p1[2] + w11 * p2[2] + w01 * p3[2];

      const len = Math.hypot(x, y, z) || 1;
      const nx = x / len;
      const ny = y / len;
      const nz = z / len;

      const px = nx * radius;
      const py = ny * radius;
      const pz = nz * radius;

      const tu = w00 * uv0[0] + w10 * uv1[0] + w11 * uv2[0] + w01 * uv3[0];
      const tv = w00 * uv0[1] + w10 * uv1[1] + w11 * uv2[1] + w01 * uv3[1];

      return {
        pos: [px, py, pz],
        norm: [nx, ny, nz],
        uv: [tu, tv]
      };
    }

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const u0 = i / N, v0 = j / N;
        const u1 = (i + 1) / N, v1 = (j + 1) / N;

        const pt00 = evalPoint(u0, v0);
        const pt10 = evalPoint(u1, v0);
        const pt11 = evalPoint(u1, v1);
        const pt01 = evalPoint(u0, v1);

        // First triangle: 00 -> 10 -> 11
        positions.push(...pt00.pos, ...pt10.pos, ...pt11.pos);
        normals.push(...pt00.norm, ...pt10.norm, ...pt11.norm);
        uvs.push(...pt00.uv, ...pt10.uv, ...pt11.uv);

        // Second triangle: 00 -> 11 -> 01
        positions.push(...pt00.pos, ...pt11.pos, ...pt01.pos);
        normals.push(...pt00.norm, ...pt11.norm, ...pt01.norm);
        uvs.push(...pt00.uv, ...pt11.uv, ...pt01.uv);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

  return geometry;
}
