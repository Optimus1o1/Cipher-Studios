import * as THREE from 'three';
import { SatelliteServiceConfig } from './satelliteConfigs';

// ============================================================================
// SHARED GEOMETRY SINGLETONS (Reused across fleet for performance & low VBO churn)
// ============================================================================
let sharedHexBoltGeo: THREE.CylinderGeometry | null = null;
function getSharedHexBoltGeo(): THREE.CylinderGeometry {
  if (!sharedHexBoltGeo) {
    // 0.028 diameter, 0.010 height (minimum 0.02 thickness)
    sharedHexBoltGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.010, 6);
  }
  return sharedHexBoltGeo;
}

let sharedCylinderGeo: THREE.CylinderGeometry | null = null;
function getSharedCylinderGeo(): THREE.CylinderGeometry {
  if (!sharedCylinderGeo) {
    sharedCylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 16);
  }
  return sharedCylinderGeo;
}

// Rounded box chassis with 2.5% bevel (width 0.46, height 0.38, depth 0.76)
let sharedBeveledBusGeo: THREE.BufferGeometry | null = null;
export function getBeveledBusGeometry(): THREE.BufferGeometry {
  if (sharedBeveledBusGeo) return sharedBeveledBusGeo;

  const shape = new THREE.Shape();
  const w = 0.46;
  const h = 0.38;
  const r = 0.035;

  shape.moveTo(-w / 2 + r, -h / 2);
  shape.lineTo(w / 2 - r, -h / 2);
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  shape.lineTo(w / 2, h / 2 - r);
  shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  shape.lineTo(-w / 2 + r, h / 2);
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  shape.lineTo(-w / 2, -h / 2 + r);
  shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

  // 2.5% bevel of bus dimensions (~0.012)
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.74,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.012,
    bevelThickness: 0.012,
  });
  geo.center();
  sharedBeveledBusGeo = geo;
  return sharedBeveledBusGeo;
}

// Parabolic Lathe Geometries (y = c * x^2)
let sharedSeoDishGeo: THREE.LatheGeometry | null = null;
function getSeoDishGeometry(): THREE.LatheGeometry {
  if (sharedSeoDishGeo) return sharedSeoDishGeo;
  const points: THREE.Vector2[] = [];
  const segments = 16;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const r = 0.018 + t * 0.122; // max radius 0.14 -> diameter 0.28
    const z = t * t * 0.12;      // parabolic curve
    points.push(new THREE.Vector2(r, z));
  }
  sharedSeoDishGeo = new THREE.LatheGeometry(points, 24);
  return sharedSeoDishGeo;
}

let sharedCareDishGeo: THREE.LatheGeometry | null = null;
function getCareDishGeometry(): THREE.LatheGeometry {
  if (sharedCareDishGeo) return sharedCareDishGeo;
  const points: THREE.Vector2[] = [];
  const segments = 14;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const r = 0.015 + t * 0.095; // max radius 0.11 -> diameter 0.22 (slightly smaller than SEO)
    const z = t * t * 0.095;     // parabolic profile
    points.push(new THREE.Vector2(r, z));
  }
  sharedCareDishGeo = new THREE.LatheGeometry(points, 20);
  return sharedCareDishGeo;
}

// ============================================================================
// PROCEDURAL TEXTURE GENERATION (Offscreen Canvas with SSR Fallback)
// ============================================================================

// 1. Two Panel Seams per Bus Face (Grooves in normal & bump map, not geometry)
let cachedBodySeamsNormal: THREE.CanvasTexture | null = null;
export function getBodySeamsNormalMap(): THREE.Texture {
  if (cachedBodySeamsNormal) return cachedBodySeamsNormal;
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return new THREE.Texture();
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Flat normal base: rgb(128, 128, 255)
  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, 256, 256);

  // Exactly two seam grooves per face (at 1/3 and 2/3 of face coordinate)
  const seamCoords = [85, 171];
  seamCoords.forEach((coord) => {
    // Horizontal groove normal perturbations
    ctx.strokeStyle = 'rgb(100, 100, 245)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, coord - 1);
    ctx.lineTo(256, coord - 1);
    ctx.stroke();

    ctx.strokeStyle = 'rgb(156, 156, 245)';
    ctx.beginPath();
    ctx.moveTo(0, coord + 1);
    ctx.lineTo(256, coord + 1);
    ctx.stroke();

    // Vertical groove normal perturbations
    ctx.strokeStyle = 'rgb(100, 100, 245)';
    ctx.beginPath();
    ctx.moveTo(coord - 1, 0);
    ctx.lineTo(coord - 1, 256);
    ctx.stroke();

    ctx.strokeStyle = 'rgb(156, 156, 245)';
    ctx.beginPath();
    ctx.moveTo(coord + 1, 0);
    ctx.lineTo(coord + 1, 256);
    ctx.stroke();
  });

  cachedBodySeamsNormal = new THREE.CanvasTexture(canvas);
  cachedBodySeamsNormal.wrapS = THREE.RepeatWrapping;
  cachedBodySeamsNormal.wrapT = THREE.RepeatWrapping;
  return cachedBodySeamsNormal;
}

let cachedBodySeamsBump: THREE.CanvasTexture | null = null;
export function getBodySeamsBumpMap(): THREE.Texture {
  if (cachedBodySeamsBump) return cachedBodySeamsBump;
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return new THREE.Texture();
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // Dark recessed groove line (two seams per face)
  ctx.strokeStyle = '#202020';
  ctx.lineWidth = 2;
  const seamCoords = [85, 171];
  seamCoords.forEach((coord) => {
    ctx.beginPath();
    ctx.moveTo(0, coord);
    ctx.lineTo(256, coord);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(coord, 0);
    ctx.lineTo(coord, 256);
    ctx.stroke();
  });

  cachedBodySeamsBump = new THREE.CanvasTexture(canvas);
  cachedBodySeamsBump.wrapS = THREE.RepeatWrapping;
  cachedBodySeamsBump.wrapT = THREE.RepeatWrapping;
  return cachedBodySeamsBump;
}

// 2. Navy Solar Panel Cell-Grid Normal & Diffuse Map (Shared navy panel)
let cachedNavyGridNormal: THREE.CanvasTexture | null = null;
export function getNavyGridNormalMap(): THREE.Texture {
  if (cachedNavyGridNormal) return cachedNavyGridNormal;
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return new THREE.Texture();
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, 256, 256);

  // 4 cols x 2 rows cell grid
  const cols = 4;
  const rows = 2;
  const cellW = 256 / cols;
  const cellH = 256 / rows;

  for (let c = 0; c <= cols; c++) {
    const x = c * cellW;
    ctx.strokeStyle = 'rgb(105, 105, 245)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 1, 0);
    ctx.lineTo(x - 1, 256);
    ctx.stroke();

    ctx.strokeStyle = 'rgb(151, 151, 245)';
    ctx.beginPath();
    ctx.moveTo(x + 1, 0);
    ctx.lineTo(x + 1, 256);
    ctx.stroke();
  }

  for (let r = 0; r <= rows; r++) {
    const y = r * cellH;
    ctx.strokeStyle = 'rgb(105, 105, 245)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y - 1);
    ctx.lineTo(256, y - 1);
    ctx.stroke();

    ctx.strokeStyle = 'rgb(151, 151, 245)';
    ctx.beginPath();
    ctx.moveTo(0, y + 1);
    ctx.lineTo(256, y + 1);
    ctx.stroke();
  }

  cachedNavyGridNormal = new THREE.CanvasTexture(canvas);
  cachedNavyGridNormal.wrapS = THREE.RepeatWrapping;
  cachedNavyGridNormal.wrapT = THREE.RepeatWrapping;
  return cachedNavyGridNormal;
}

let cachedNavyGridDiffuse: THREE.CanvasTexture | null = null;
export function getNavyGridDiffuseMap(): THREE.Texture {
  if (cachedNavyGridDiffuse) return cachedNavyGridDiffuse;
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return new THREE.Texture();
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Deep aerospace navy panel base
  ctx.fillStyle = '#081020';
  ctx.fillRect(0, 0, 256, 256);

  const cols = 4;
  const rows = 2;
  const pad = 4;
  const cellW = (256 - pad * (cols + 1)) / cols;
  const cellH = (256 - pad * (rows + 1)) / rows;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x = pad + c * (cellW + pad);
      const y = pad + r * (cellH + pad);

      ctx.fillStyle = '#0e1d35';
      ctx.fillRect(x, y, cellW, cellH);

      // Fine silver collectors
      ctx.strokeStyle = 'rgba(120, 155, 195, 0.22)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let fy = y + 8; fy < y + cellH - 4; fy += 9) {
        ctx.moveTo(x + 2, fy);
        ctx.lineTo(x + cellW - 2, fy);
      }
      ctx.stroke();
    }
  }

  cachedNavyGridDiffuse = new THREE.CanvasTexture(canvas);
  cachedNavyGridDiffuse.wrapS = THREE.RepeatWrapping;
  cachedNavyGridDiffuse.wrapT = THREE.RepeatWrapping;
  cachedNavyGridDiffuse.colorSpace = THREE.SRGBColorSpace;
  return cachedNavyGridDiffuse;
}

// ============================================================================
// ENVIRONMENT MAP (Dark, low-contrast studio reflection map)
// ============================================================================
let sharedEnvTexture: THREE.Texture | null = null;
export function getOrCreateStudioEnv(renderer?: THREE.WebGLRenderer): THREE.Texture | null {
  if (sharedEnvTexture) return sharedEnvTexture;
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, '#0c0f16');
  grad.addColorStop(0.5, '#07090e');
  grad.addColorStop(1, '#010204');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);

  const tex = new THREE.CanvasTexture(canvas);
  tex.mapping = THREE.EquirectangularReflectionMapping;

  if (renderer) {
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      const rt = pmrem.fromEquirectangular(tex);
      sharedEnvTexture = rt.texture;
      tex.dispose();
      pmrem.dispose();
      return sharedEnvTexture;
    } catch {
      sharedEnvTexture = tex;
      return sharedEnvTexture;
    }
  }

  sharedEnvTexture = tex;
  return sharedEnvTexture;
}

// ============================================================================
// SHARED MATERIALS SINGLETONS (Shared graphite body & shared navy panel across fleet)
// ============================================================================
let sharedGraphiteBodyMaterial: THREE.MeshStandardMaterial | null = null;
function getSharedGraphiteBodyMaterial(): THREE.MeshStandardMaterial {
  if (!sharedGraphiteBodyMaterial) {
    // Body: metalness 0.5 to 0.7 (0.60), roughness 0.35 to 0.55 (0.45), dark graphite.
    // Two seams per bus face as grooves in normal and bump maps, not extra geometry.
    sharedGraphiteBodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1c1e24,
      metalness: 0.60,
      roughness: 0.45,
      normalMap: getBodySeamsNormalMap(),
      normalScale: new THREE.Vector2(0.4, 0.4),
      bumpMap: getBodySeamsBumpMap(),
      bumpScale: 0.02,
    });
  }
  return sharedGraphiteBodyMaterial;
}

let sharedNavyPanelMaterial: THREE.MeshStandardMaterial | null = null;
function getSharedNavyPanelMaterial(): THREE.MeshStandardMaterial {
  if (!sharedNavyPanelMaterial) {
    // Navy panels: roughness 0.35 to 0.45 (0.40), faint cell-grid normal map.
    sharedNavyPanelMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c1527,
      map: getNavyGridDiffuseMap(),
      normalMap: getNavyGridNormalMap(),
      normalScale: new THREE.Vector2(0.35, 0.35),
      metalness: 0.45,
      roughness: 0.40,
    });
  }
  return sharedNavyPanelMaterial;
}

let sharedDarkMetalMaterial: THREE.MeshStandardMaterial | null = null;
function getSharedDarkMetalMaterial(): THREE.MeshStandardMaterial {
  if (!sharedDarkMetalMaterial) {
    // Non-reflective structural fittings & hinges (metalness 0.70, roughness 0.40)
    sharedDarkMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x22252c,
      metalness: 0.70,
      roughness: 0.40,
    });
  }
  return sharedDarkMetalMaterial;
}

let sharedDarkGlassMaterial: THREE.MeshStandardMaterial | null = null;
function getSharedDarkGlassMaterial(): THREE.MeshStandardMaterial {
  if (!sharedDarkGlassMaterial) {
    sharedDarkGlassMaterial = new THREE.MeshStandardMaterial({
      color: 0x060b13,
      metalness: 0.20,
      roughness: 0.12,
    });
  }
  return sharedDarkGlassMaterial;
}

export interface SatelliteMaterials {
  bodyGraphite: THREE.MeshStandardMaterial;
  solarPanel: THREE.MeshStandardMaterial;
  accent: THREE.MeshStandardMaterial;
  darkMetal: THREE.MeshStandardMaterial;
  darkGlass: THREE.MeshStandardMaterial;
  indicatorLED: THREE.MeshStandardMaterial;
}

// Materials creator - uses shared singletons for body & panels, varies only the accent
export function createSatelliteMaterials(
  config: SatelliteServiceConfig,
  _envMap?: THREE.Texture | null,
  isSelected: boolean = false,
  isHovered: boolean = false
): SatelliteMaterials {
  const bodyGraphite = getSharedGraphiteBodyMaterial();
  const solarPanel = getSharedNavyPanelMaterial();
  const darkMetal = getSharedDarkMetalMaterial();
  const darkGlass = getSharedDarkGlassMaterial();

  // Accent material: varies ONLY per satellite accent color.
  // Emissive intensity strictly <= 0.3 maximum.
  const accent = new THREE.MeshStandardMaterial({
    color: new THREE.Color(config.accentColor),
    emissive: new THREE.Color(config.accentColor),
    emissiveIntensity: 0.20,
    metalness: 0.65,
    roughness: 0.38,
  });

  // Emissive indicator LED (intensity 0.3 maximum, no glowing cables)
  const ledIntensity = isSelected ? 0.28 : isHovered ? 0.25 : 0.20;
  const indicatorLED = new THREE.MeshStandardMaterial({
    color: 0x111318,
    emissive: new THREE.Color(config.emissiveColor),
    emissiveIntensity: ledIntensity,
    metalness: 0.3,
    roughness: 0.3,
  });

  return {
    bodyGraphite,
    solarPanel,
    accent,
    darkMetal,
    darkGlass,
    indicatorLED,
  };
}

// ============================================================================
// HELPER: Solid structural beam connecting two 3D points
// Guarantees all thin parts are at least 0.02 world units thick (radius >= 0.01)
// ============================================================================
export function createBeamMesh(
  start: [number, number, number],
  end: [number, number, number],
  material: THREE.Material,
  radius: number = 0.012 // diameter >= 0.024 >= 0.02
): THREE.Mesh {
  const safeRadius = Math.max(0.010, radius); // radius >= 0.010 guarantees thickness >= 0.020
  const s = new THREE.Vector3(...start);
  const e = new THREE.Vector3(...end);
  const d = new THREE.Vector3().subVectors(e, s);
  const len = d.length();
  const pos = new THREE.Vector3().copy(s).add(e).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    d.clone().normalize()
  );

  const mesh = new THREE.Mesh(getSharedCylinderGeo(), material);
  mesh.position.copy(pos);
  mesh.quaternion.copy(quat);
  mesh.scale.set(safeRadius, len, safeRadius);
  return mesh;
}

// ============================================================================
// MAIN SPACECRAFT FACTORY FUNCTION
// createSatellite(config, materials) builds every satellite from unified parts:
// 1. Central bus (rounded box 2.5% bevel, 4 corner bolts, 2 seams per face)
// 2. Two solar wings (clean navy panels, NO full-width struts or cables)
// 3. One primary instrument (~35% bus length, most visible shape)
// 4. One small base-mounted detail (rear thruster housing)
// ============================================================================
export function createSatellite(
  config: SatelliteServiceConfig,
  materials?: SatelliteMaterials
): THREE.Group {
  const mats = materials || createSatelliteMaterials(config);
  const root = new THREE.Group();

  // --------------------------------------------------------------------------
  // 1. CENTRAL SPACECRAFT BUS
  // --------------------------------------------------------------------------
  const busGroup = new THREE.Group();

  // A. Main Rounded Box with 2.5% bevel
  // Bus length = 0.764 (~0.76), width = 0.484, height = 0.404
  const busMesh = new THREE.Mesh(getBeveledBusGeometry(), mats.bodyGraphite);
  busGroup.add(busMesh);

  // B. Exactly 4 bolt heads per satellite at the bus corners
  // Bolt size: radius 0.014 (thickness 0.028 >= 0.02), height 0.010
  const boltPositions: [number, number, number][] = [
    [0.17, 0.14, 0.383],
    [-0.17, 0.14, 0.383],
    [0.17, -0.14, 0.383],
    [-0.17, -0.14, 0.383],
  ];

  boltPositions.forEach(([bx, by, bz]) => {
    const bolt = new THREE.Mesh(getSharedHexBoltGeo(), mats.darkMetal);
    bolt.name = 'corner-bolt';
    bolt.position.set(bx, by, bz);
    bolt.rotation.x = Math.PI / 2;
    busGroup.add(bolt);
  });

  root.add(busGroup);

  // --------------------------------------------------------------------------
  // 2. BILATERAL SOLAR WINGS (Shared navy panel material, NO full-width struts/cables)
  // --------------------------------------------------------------------------
  const solarWingGroup = new THREE.Group();
  const panelW = 0.62;
  const panelH = 0.50;
  const panelThick = 0.024; // thickness >= 0.02

  [-1, 1].forEach((side) => {
    const wing = new THREE.Group();
    const xMount = side * 0.24;
    const panelCenterX = side * 0.44;

    // A. Root hinge bracket connecting bus to wing (no full-width strut)
    const hinge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 0.12, 12),
      mats.darkMetal
    );
    hinge.rotation.z = Math.PI / 2;
    hinge.position.set(xMount + side * 0.06, 0, 0);
    wing.add(hinge);

    // B. Graphite panel backing plate
    const backing = new THREE.Mesh(
      new THREE.BoxGeometry(panelW, panelH, panelThick),
      mats.bodyGraphite
    );
    backing.position.set(panelCenterX, 0, 0);
    wing.add(backing);

    // C. Photovoltaic active faces (Front & Back) - shared navy panel material
    const solarPlaneGeo = new THREE.PlaneGeometry(panelW * 0.94, panelH * 0.92);

    const solarFront = new THREE.Mesh(solarPlaneGeo, mats.solarPanel);
    solarFront.position.set(panelCenterX, 0, panelThick * 0.52);
    wing.add(solarFront);

    const solarBack = new THREE.Mesh(solarPlaneGeo, mats.solarPanel);
    solarBack.position.set(panelCenterX, 0, -panelThick * 0.52);
    solarBack.rotation.y = Math.PI;
    wing.add(solarBack);

    solarWingGroup.add(wing);
  });

  // Ignore pointer events on wings so spherical raycast proxy remains primary click target
  solarWingGroup.traverse((child) => {
    child.raycast = () => null;
  });
  root.add(solarWingGroup);

  // --------------------------------------------------------------------------
  // 3. BASE-MOUNTED DETAIL (Rear thruster & propulsion gimbal housing)
  // --------------------------------------------------------------------------
  const aftHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.070, 0.08, 14),
    mats.darkMetal
  );
  aftHousing.rotation.x = Math.PI / 2;
  aftHousing.position.set(0, 0, -0.42);
  root.add(aftHousing);

  // --------------------------------------------------------------------------
  // 4. PER-SERVICE PRIMARY INSTRUMENT (~35% of Bus Length ~0.27) & EXTRA DETAIL
  // --------------------------------------------------------------------------
  const payloadGroup = new THREE.Group();

  switch (config.payloadType) {
    // ------------------------------------------------------------------------
    // 01: WEBSITE DESIGN
    // Primary: Rectangular optical lens on short barrel with champagne bezel
    // Accent (#d8c3a0): Bezel and indicator
    // Extra detail: Small square display plate on front face
    // Thin parts count: 1 (top probe = 1)
    // ------------------------------------------------------------------------
    case 'website-design': {
      const instrumentGroup = new THREE.Group();
      instrumentGroup.position.set(0, 0, 0.38);

      // Short barrel: length 0.20, radius 0.11
      const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.105, 0.115, 0.20, 16),
        mats.darkMetal
      );
      barrel.rotation.x = Math.PI / 2;
      barrel.position.z = 0.10;
      instrumentGroup.add(barrel);

      // Champagne bezel (accent #d8c3a0): rectangular bezel frame
      const bezelFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.20, 0.04),
        mats.accent
      );
      bezelFrame.position.z = 0.22;
      instrumentGroup.add(bezelFrame);

      // Rectangular optical lens: dark tinted glass recessed inside bezel
      const lens = new THREE.Mesh(
        new THREE.BoxGeometry(0.20, 0.16, 0.022),
        mats.darkGlass
      );
      lens.position.z = 0.242;
      instrumentGroup.add(lens);

      payloadGroup.add(instrumentGroup);

      // Extra detail: Small square display plate on the front face (accent border)
      const displayPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.08, 0.022),
        mats.accent
      );
      displayPlate.position.set(-0.13, -0.06, 0.388);
      payloadGroup.add(displayPlate);

      // 1 thin part: short sensor probe (diameter 0.024 >= 0.02)
      const probe = createBeamMesh([0.15, 0.19, 0.15], [0.15, 0.38, 0.15], mats.darkMetal, 0.012);
      payloadGroup.add(probe);

      // Indicator LED (intensity <= 0.3)
      const led = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.008, 10),
        mats.indicatorLED
      );
      led.rotation.x = Math.PI / 2;
      led.position.set(-0.13, 0.06, 0.388);
      payloadGroup.add(led);
      break;
    }

    // ------------------------------------------------------------------------
    // 02: WEB DEVELOPMENT
    // Primary: Compact computing box with 4 cooling fins on one side
    // Accent (#9fc7e8): Computing box rim / trim
    // Extra detail: Two small status dots on the bus
    // Thin parts count: 5 (4 cooling fins + 1 heat conduit = 5)
    // ------------------------------------------------------------------------
    case 'web-development': {
      const instrumentGroup = new THREE.Group();
      instrumentGroup.position.set(0, 0, 0.38);

      // Compact computing box: length 0.26 (~35% of bus length), width 0.22, height 0.20
      const cpuBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.20, 0.26),
        mats.darkMetal
      );
      cpuBox.position.z = 0.13;
      instrumentGroup.add(cpuBox);

      // Accent front rim on computing box (#9fc7e8)
      const cpuRim = new THREE.Mesh(
        new THREE.BoxGeometry(0.23, 0.21, 0.022),
        mats.accent
      );
      cpuRim.position.z = 0.265;
      instrumentGroup.add(cpuRim);

      // 4 cooling fins on one side (+X): each fin thickness 0.022 (>= 0.02), height 0.16, width 0.06
      for (let i = 0; i < 4; i++) {
        const fin = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.16, 0.022),
          mats.darkMetal
        );
        fin.position.set(0.14, 0, 0.04 + i * 0.055);
        instrumentGroup.add(fin);
      }

      // Heat conduit pipe (diameter 0.024 >= 0.02)
      const heatPipe = createBeamMesh([-0.11, 0.11, 0.02], [-0.11, 0.11, 0.24], mats.darkMetal, 0.012);
      instrumentGroup.add(heatPipe);

      payloadGroup.add(instrumentGroup);

      // Extra detail: Two small status dots on the bus (accent #9fc7e8)
      const dot1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.008, 10),
        mats.accent
      );
      dot1.rotation.x = Math.PI / 2;
      dot1.position.set(-0.14, 0.08, 0.388);

      const dot2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.008, 10),
        mats.accent
      );
      dot2.rotation.x = Math.PI / 2;
      dot2.position.set(-0.14, -0.04, 0.388);
      payloadGroup.add(dot1, dot2);

      // Indicator LED
      const led = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.008, 10),
        mats.indicatorLED
      );
      led.rotation.x = Math.PI / 2;
      led.position.set(0, 0, 0.65);
      payloadGroup.add(led);
      break;
    }

    // ------------------------------------------------------------------------
    // 03: SEARCH ENGINE OPTIMISATION
    // Primary: Parabolic dish (LatheGeometry) on a short boom
    // Accent (#7fb5b0): Parabolic dish rim
    // Extra detail: Sensor lens beside the dish
    // Thin parts count: 4 (1 boom + 3 dish feed struts = 4)
    // ------------------------------------------------------------------------
    case 'seo': {
      const dishGroup = new THREE.Group();
      dishGroup.position.set(0.12, 0.08, 0.38);

      // Short boom (diameter 0.026 >= 0.02, length 0.14)
      const boom = createBeamMesh([0, 0, 0], [0.06, 0.04, 0.14], mats.darkMetal, 0.013);
      dishGroup.add(boom);

      // Parabolic dish (LatheGeometry): diameter 0.28, length ~0.26
      const dish = new THREE.Mesh(getSeoDishGeometry(), mats.darkMetal);
      dish.position.set(0.06, 0.04, 0.14);
      dishGroup.add(dish);

      // Accent rim around parabolic dish (#7fb5b0)
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.14, 0.011, 8, 24),
        mats.accent
      );
      rim.position.set(0.06, 0.04, 0.26);
      dishGroup.add(rim);

      // 3 feed struts (each diameter 0.022 >= 0.02)
      const strut1 = createBeamMesh([0.06, 0.14, 0.24], [0.06, 0.04, 0.32], mats.darkMetal, 0.011);
      const strut2 = createBeamMesh([0.00, -0.04, 0.24], [0.06, 0.04, 0.32], mats.darkMetal, 0.011);
      const strut3 = createBeamMesh([0.12, -0.04, 0.24], [0.06, 0.04, 0.32], mats.darkMetal, 0.011);
      dishGroup.add(strut1, strut2, strut3);

      payloadGroup.add(dishGroup);

      // Extra detail: Sensor lens beside the dish
      const sensorHousing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.065, 0.08, 14),
        mats.darkMetal
      );
      sensorHousing.rotation.x = Math.PI / 2;
      sensorHousing.position.set(-0.12, -0.04, 0.42);
      payloadGroup.add(sensorHousing);

      const sensorBezel = new THREE.Mesh(
        new THREE.TorusGeometry(0.058, 0.009, 8, 20),
        mats.accent
      );
      sensorBezel.position.set(-0.12, -0.04, 0.462);
      payloadGroup.add(sensorBezel);

      const sensorGlass = new THREE.Mesh(
        new THREE.SphereGeometry(0.048, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.45),
        mats.darkGlass
      );
      sensorGlass.position.set(-0.12, -0.04, 0.462);
      payloadGroup.add(sensorGlass);

      // Indicator LED
      const led = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.008, 10),
        mats.indicatorLED
      );
      led.rotation.x = Math.PI / 2;
      led.position.set(-0.12, 0.08, 0.388);
      payloadGroup.add(led);
      break;
    }

    // ------------------------------------------------------------------------
    // 04: DIGITAL MARKETING
    // Primary: Short radio mast with two compact antennas
    // Accent (#9a8cc4): Mast collar & antenna tips
    // Extra detail: Small RF horn on the bus front
    // Thin parts count: 3 (1 mast + 2 antennas = 3)
    // ------------------------------------------------------------------------
    case 'digital-marketing': {
      const mastGroup = new THREE.Group();
      mastGroup.position.set(0.10, 0.19, 0.15);

      // Short radio mast: height 0.27 (~35% of bus length), diameter 0.028 (>= 0.02)
      const mast = createBeamMesh([0, 0, 0], [0, 0.27, 0], mats.darkMetal, 0.014);
      mastGroup.add(mast);

      // Accent collar on mast (#9a8cc4)
      const collar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.020, 0.020, 0.025, 12),
        mats.accent
      );
      collar.position.set(0, 0.18, 0);
      mastGroup.add(collar);

      // Two compact antennas: each diameter 0.022 (>= 0.02), width 0.14
      const antenna1 = createBeamMesh([-0.07, 0.24, 0], [0.07, 0.24, 0], mats.accent, 0.011);
      const antenna2 = createBeamMesh([0, 0.24, -0.07], [0, 0.24, 0.07], mats.accent, 0.011);
      mastGroup.add(antenna1, antenna2);

      payloadGroup.add(mastGroup);

      // Extra detail: Small RF horn on the bus front
      const hornHousing = new THREE.Mesh(
        new THREE.ConeGeometry(0.045, 0.09, 14, 1, true),
        mats.darkMetal
      );
      hornHousing.rotation.x = Math.PI / 2;
      hornHousing.position.set(-0.06, -0.02, 0.43);
      payloadGroup.add(hornHousing);

      // RF horn accent rim (#9a8cc4)
      const hornRim = new THREE.Mesh(
        new THREE.TorusGeometry(0.044, 0.008, 8, 18),
        mats.accent
      );
      hornRim.position.set(-0.06, -0.02, 0.475);
      payloadGroup.add(hornRim);

      // Indicator LED
      const led = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.008, 10),
        mats.indicatorLED
      );
      led.rotation.x = Math.PI / 2;
      led.position.set(-0.12, 0.10, 0.388);
      payloadGroup.add(led);
      break;
    }

    // ------------------------------------------------------------------------
    // 05: BRANDING AND CONTENT
    // Primary: Short optical barrel with a warm bronze ring
    // Accent (#c49a6c): Warm bronze ring
    // Extra detail: Thin frame-shaped plate on the bus side
    // Thin parts count: 1 (mount strut = 1)
    // ------------------------------------------------------------------------
    case 'branding-content': {
      const barrelGroup = new THREE.Group();
      barrelGroup.position.set(0, 0, 0.38);

      // Short optical barrel: length 0.26 (~35% of bus length), diameter 0.24
      const mainBarrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.115, 0.125, 0.24, 20),
        mats.darkMetal
      );
      mainBarrel.rotation.x = Math.PI / 2;
      mainBarrel.position.z = 0.12;
      barrelGroup.add(mainBarrel);

      // Warm bronze ring (accent #c49a6c)
      const bronzeRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.122, 0.014, 10, 24),
        mats.accent
      );
      bronzeRing.position.z = 0.24;
      barrelGroup.add(bronzeRing);

      // Optical glass lens front
      const glass = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.45),
        mats.darkGlass
      );
      glass.position.z = 0.24;
      barrelGroup.add(glass);

      payloadGroup.add(barrelGroup);

      // Extra detail: Thin frame-shaped plate on the bus side (accent #c49a6c)
      const sideFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.022, 0.14, 0.18),
        mats.accent
      );
      sideFrame.position.set(-0.246, 0.02, 0.08);
      payloadGroup.add(sideFrame);

      // 1 thin mount strut on bus flank (diameter 0.024 >= 0.02)
      const spar = createBeamMesh([-0.24, 0.12, 0.18], [-0.24, 0.12, 0.34], mats.darkMetal, 0.012);
      payloadGroup.add(spar);

      // Indicator LED
      const led = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.008, 10),
        mats.indicatorLED
      );
      led.rotation.x = Math.PI / 2;
      led.position.set(0.14, 0.08, 0.388);
      payloadGroup.add(led);
      break;
    }

    // ------------------------------------------------------------------------
    // 06: CARE AND GROWTH
    // Primary: Telemetry dish, slightly smaller than SEO's
    // Accent (#8fae8b): Telemetry dish rim & sensor rings
    // Extra detail: Two small diagnostic sensors on the bus
    // Note: Only satellite allowed a secondary dish if needed
    // Thin parts count: 3 (1 boom + 1 feed rod + 1 probe = 3)
    // ------------------------------------------------------------------------
    case 'care-growth':
    default: {
      const dishGroup = new THREE.Group();
      dishGroup.position.set(0.10, 0.06, 0.38);

      // Telemetry dish boom (diameter 0.026 >= 0.02, length 0.12)
      const boom = createBeamMesh([0, 0, 0], [0.04, 0.03, 0.12], mats.darkMetal, 0.013);
      dishGroup.add(boom);

      // Telemetry dish (LatheGeometry): diameter 0.22, length ~0.24 (smaller than SEO 0.28)
      const telDish = new THREE.Mesh(getCareDishGeometry(), mats.darkMetal);
      telDish.position.set(0.04, 0.03, 0.12);
      dishGroup.add(telDish);

      // Accent rim (#8fae8b) around telemetry dish
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.11, 0.010, 8, 20),
        mats.accent
      );
      rim.position.set(0.04, 0.03, 0.215);
      dishGroup.add(rim);

      // Feed rod (diameter 0.022 >= 0.02)
      const feed = createBeamMesh([0.04, 0.03, 0.14], [0.04, 0.03, 0.25], mats.darkMetal, 0.011);
      dishGroup.add(feed);

      payloadGroup.add(dishGroup);

      // Extra detail: Two small diagnostic sensors on the bus
      const sensor1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.028, 0.035, 12),
        mats.accent
      );
      sensor1.rotation.x = Math.PI / 2;
      sensor1.position.set(-0.13, 0.08, 0.395);

      const sensor2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.028, 0.035, 12),
        mats.accent
      );
      sensor2.rotation.x = Math.PI / 2;
      sensor2.position.set(-0.13, -0.06, 0.395);
      payloadGroup.add(sensor1, sensor2);

      // 1 diagnostic probe on top (diameter 0.022 >= 0.02)
      const probe = createBeamMesh([-0.14, 0.19, 0.12], [-0.14, 0.36, 0.12], mats.darkMetal, 0.011);
      payloadGroup.add(probe);

      // Indicator LED
      const led = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.008, 10),
        mats.indicatorLED
      );
      led.rotation.x = Math.PI / 2;
      led.position.set(-0.13, 0.01, 0.398);
      payloadGroup.add(led);
      break;
    }
  }

  root.add(payloadGroup);
  return root;
}

// ============================================================================
// HELPER: Accurate Triangle Counter for verification
// ============================================================================
export function getSatelliteTriangleCount(group: THREE.Group): number {
  let triangles = 0;
  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.geometry) {
      const geo = obj.geometry;
      if (geo.index) {
        triangles += geo.index.count / 3;
      } else if (geo.attributes.position) {
        triangles += geo.attributes.position.count / 3;
      }
    }
  });
  return Math.round(triangles);
}
