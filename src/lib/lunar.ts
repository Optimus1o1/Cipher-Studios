/**
 * Real-time astronomical lunar calculations.
 * Computes exact synodic cycle, illumination fraction, phase names,
 * and directional lighting vector for true real-time celestial rendering.
 */

export interface LunarPhaseData {
  phase: number; // 0 to 1 (0 = New, 0.25 = First Quarter, 0.5 = Full, 0.75 = Last Quarter)
  ageDays: number; // 0 to 29.5306
  illumination: number; // Percentage: 0 to 100
  phaseName: string;
  phaseSymbol: string;
  sunAngle: number; // Radians 0 to 2*PI for solar lighting vector
  libration: {
    lon: number; // Subtle longitude wobble (radians)
    lat: number; // Subtle latitude wobble (radians)
  };
}

// Synodic month in milliseconds: 29.53058867 days
const SYNODIC_MONTH_MS = 29.53058867 * 86400 * 1000;

// Known precise reference New Moon epoch: 2024-01-11 11:57:00 UTC
const REFERENCE_NEW_MOON_MS = Date.UTC(2024, 0, 11, 11, 57, 0);

// Draconic / Anomaly period for libration estimation (~27.55 days)
const ANOMALISTIC_MONTH_MS = 27.554551 * 86400 * 1000;
const NODICAL_MONTH_MS = 27.212220 * 86400 * 1000;

export function getLunarPhase(date: Date = new Date()): LunarPhaseData {
  const time = date.getTime();
  const diff = time - REFERENCE_NEW_MOON_MS;

  // Normalized phase from 0.0 to 1.0
  const phase = ((diff % SYNODIC_MONTH_MS) + SYNODIC_MONTH_MS) % SYNODIC_MONTH_MS / SYNODIC_MONTH_MS;
  const ageDays = phase * 29.53058867;

  // Exact geometric illumination fraction: (1 - cos(2*pi*phase)) / 2
  const illumination = Math.round(((1 - Math.cos(phase * Math.PI * 2)) / 2) * 1000) / 10;

  // Solar angle around the Y axis
  // At phase = 0 (New Moon): Sun is behind the Moon (angle = PI), casting shadow on Earth-facing side.
  // At phase = 0.25 (First Quarter): Sun is at 90 deg (illuminating right hemisphere).
  // At phase = 0.5 (Full Moon): Sun is aligned with observer/Earth (angle = 0), fully illuminating near side.
  // At phase = 0.75 (Last Quarter): Sun is at 270 deg (illuminating left hemisphere).
  const sunAngle = (phase * Math.PI * 2) - Math.PI;

  // Libration approximations (lunar wobble visible from Earth, up to ~7 degrees)
  const librationLon = Math.sin(((time % ANOMALISTIC_MONTH_MS) / ANOMALISTIC_MONTH_MS) * Math.PI * 2) * 0.085;
  const librationLat = Math.sin(((time % NODICAL_MONTH_MS) / NODICAL_MONTH_MS) * Math.PI * 2) * 0.075;

  let phaseName = 'New Moon';
  let phaseSymbol = '🌑';

  if (ageDays < 1.84566) {
    phaseName = 'New Moon';
    phaseSymbol = '🌑';
  } else if (ageDays < 5.53699) {
    phaseName = 'Waxing Crescent';
    phaseSymbol = '🌒';
  } else if (ageDays < 9.22831) {
    phaseName = 'First Quarter';
    phaseSymbol = '🌓';
  } else if (ageDays < 12.91963) {
    phaseName = 'Waxing Gibbous';
    phaseSymbol = '🌔';
  } else if (ageDays < 16.61096) {
    phaseName = 'Full Moon';
    phaseSymbol = '🌕';
  } else if (ageDays < 20.30228) {
    phaseName = 'Waning Gibbous';
    phaseSymbol = '🌖';
  } else if (ageDays < 23.99360) {
    phaseName = 'Last Quarter';
    phaseSymbol = '🌗';
  } else if (ageDays < 27.68493) {
    phaseName = 'Waning Crescent';
    phaseSymbol = '🌘';
  } else {
    phaseName = 'New Moon';
    phaseSymbol = '🌑';
  }

  return {
    phase,
    ageDays: Math.round(ageDays * 10) / 10,
    illumination,
    phaseName,
    phaseSymbol,
    sunAngle,
    libration: {
      lon: librationLon,
      lat: librationLat,
    },
  };
}
