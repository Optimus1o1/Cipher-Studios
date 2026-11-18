export type ProjectAssetType =
  | 'live-production'
  | 'local-qualified-build'
  | 'architecture-diagram';

export interface ProjectAsset {
  type: ProjectAssetType;
  src: string;
  alt: string;
  caption: string;
  sourceUrl?: string;
  sourceCommit?: string;
  capturedAt: string;
  viewport: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
  unit?: string;
  variant?: 'emerald' | 'copper' | 'cyan' | 'default';
}

export interface ProjectCapability {
  title: string;
  description: string;
}

export interface ProjectEquation {
  name: string;
  formula: string;
  units: string;
  note: string;
}

export interface ProjectBuild {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  classification: {
    label: string;
    variant: 'studio' | 'research' | 'space';
  };
  summary: string;
  provenance: {
    commit: string;
    status: 'LIVE' | 'QUALIFIED' | 'SUBMISSION';
    liveUrl?: string;
    repoUrl?: string;
    healthUrl?: string;
  };
  keyEquation?: ProjectEquation;
  secondaryEquation?: ProjectEquation;
  capabilities: ProjectCapability[];
  metrics: ProjectMetric[];
  techStack: string[];
  assets: {
    desktop: ProjectAsset;
    mobile?: ProjectAsset;
  };
}

export const selectedProjects: ProjectBuild[] = [
  {
    id: 'privguard-ai',
    slug: 'privguard-ai',
    title: 'Privguard AI',
    tagline: 'Autonomous AI Privacy & Security Gateway',
    classification: {
      label: 'FLAGSHIP STUDIO BUILD · AI SECURITY INFRASTRUCTURE',
      variant: 'studio',
    },
    summary:
      'An independent security and privacy enforcement layer positioned between client applications, untrusted data sources, foundation models, and autonomous agent tools.',
    provenance: {
      commit: 'e6880ff',
      status: 'QUALIFIED',
      repoUrl:
        'https://github.com/Optimus1o1/RIVA-AI-Intelligent-AI-Security-Privacy-Infrastructure.git',
    },
    capabilities: [
      {
        title: 'Reversible PII Minimization',
        description:
          'Scans prompts and redacts 14 personal identifiable entity types with ephemeral cryptographic placeholders (<EMAIL_1>), restoring them on response without storing plaintext.',
      },
      {
        title: 'Prompt Injection Defense',
        description:
          'Deterministic heuristic filtering and untrusted context boundary sanitization containing adversarial prompt extraction and distribution drift.',
      },
      {
        title: 'MCP 2026 Security Gateway',
        description:
          'Zero-trust enforcement mediating autonomous AI agent tool execution, destination SSRF validation, and stdio execution sandboxing.',
      },
      {
        title: 'Encrypted Personal Memory Vault',
        description:
          'User-controlled personal memory protected by AES-256-GCM envelope encryption, staged human consent proposals, and irreversible cryptographic erasure.',
      },
    ],
    metrics: [
      {
        label: 'TESTS',
        value: '406',
        unit: 'PASSING',
        variant: 'emerald',
      },
      {
        label: 'APP ROUTES',
        value: '32',
        unit: 'APP',
        variant: 'copper',
      },
      {
        label: 'DATA STORAGE',
        value: 'ZERO',
        unit: 'PLAINTEXT',
        variant: 'default',
      },
    ],
    techStack: [
      'Python 3.12',
      'FastAPI',
      'Next.js 16',
      'TypeScript',
      'PostgreSQL RLS',
      'Redis 7',
      'Docker Compose',
    ],
    assets: {
      desktop: {
        type: 'local-qualified-build',
        src: '/images/projects/privguard_overview_desktop.png',
        alt: 'PRIVGUARD AI Local Qualified Build — Telemetry Dashboard and Policy Overview',
        caption: 'Application Screenshot · Local Qualified Build (Commit: e6880ff)',
        sourceCommit: 'e6880ff',
        capturedAt: '2026-11-17',
        viewport: '1440x900',
      },
      mobile: {
        type: 'local-qualified-build',
        src: '/images/projects/privguard_overview_mobile.png',
        alt: 'PRIVGUARD AI Local Qualified Build — Mobile Overview Dashboard',
        caption: 'Application Screenshot · Mobile View (390px)',
        sourceCommit: 'e6880ff',
        capturedAt: '2026-11-17',
        viewport: '390x844',
      },
    },
  },
  {
    id: 'fireline',
    slug: 'fireline',
    title: 'Fireline',
    tagline: 'Fire Intelligence & Research Evidence Linkage Engine',
    classification: {
      label: 'NASA SPACE APPS 2026 SUBMISSION · MICROGRAVITY SI',
      variant: 'space',
    },
    summary:
      'Microgravity combustion research decision-support platform engineered for the NASA Space Apps Challenge 2026 (Flame in Freefall), linking primary NASA Physical Sciences Informatics (PSI) flight records to human spaceflight safety.',
    provenance: {
      commit: 'd018b6b',
      status: 'LIVE',
      liveUrl: 'https://fireline-rmr2.onrender.com',
      repoUrl: 'https://github.com/Optimus1o1/fireline.git',
      healthUrl: 'https://fireline-rmr2.onrender.com/api/health',
    },
    capabilities: [
      {
        title: 'NASA PSI Evidence Linkage',
        description:
          'Direct ingestion and multi-dimensional filtering of validated microgravity flight experiments (Saffire-I PSI-98, BASS-II PSI-25, FLEX PSI-69) with full DOI provenance.',
      },
      {
        title: '7 Physical Comparability Gates',
        description:
          'Evaluates combustion run pairs across Regime, Material, Sample Geometry, Forced Convection, Pressure, O2 Enrichment, and Burn Orientation to prevent invalid thermodynamic extrapolation.',
      },
      {
        title: 'Exploration Atmospheric Risk Evaluation',
        description:
          'Assesses combustion regimes in Artemis Lunar Habitat (34% O2 at 56.5 kPa / 8.2 psia) and candidate Martian habitat simulation scenarios (28% O2 at 56.0 kPa / 8.1 psia).',
      },
      {
        title: 'Grounded SI Copilot',
        description:
          'Natural-language inquiry governed by deterministic citation validation and explicit epistemic classification (SUPPORTED, INFERRED, EVIDENCE_GAP).',
      },
    ],
    metrics: [
      {
        label: 'TESTS',
        value: '69',
        unit: 'PASSING',
        variant: 'emerald',
      },
      {
        label: 'GATES',
        value: '7',
        unit: 'PHYSICAL',
        variant: 'cyan',
      },
      {
        label: 'DEPLOYMENT',
        value: 'LIVE',
        unit: 'RENDER',
        variant: 'copper',
      },
    ],
    techStack: [
      'Next.js 15',
      'Python 3.12',
      'FastAPI',
      'Three.js',
      'Google Gemini',
      'NASA PSI Data',
      'Render',
    ],
    assets: {
      desktop: {
        type: 'live-production',
        src: '/images/projects/fireline_live_desktop.png',
        alt: 'FIRELINE Live Production Deployment — NASA PSI Microgravity Evidence Platform',
        caption: 'Application Screenshot · Live Production Deployment (Render)',
        sourceUrl: 'https://fireline-rmr2.onrender.com',
        sourceCommit: 'd018b6b',
        capturedAt: '2026-11-17',
        viewport: '1440x900',
      },
      mobile: {
        type: 'live-production',
        src: '/images/projects/fireline_live_mobile.png',
        alt: 'FIRELINE Live Production Deployment — Mobile Mission Risk Interface',
        caption: 'Application Screenshot · Mobile View (390px)',
        sourceUrl: 'https://fireline-rmr2.onrender.com',
        sourceCommit: 'd018b6b',
        capturedAt: '2026-11-17',
        viewport: '390x844',
      },
    },
  },
  {
    id: 'jalnetra',
    slug: 'jalnetra',
    title: 'Jalnetra',
    tagline: 'Urban Rainwater Intelligence & Circular Water Digital Twin',
    classification: {
      label: 'CIRCULAR WATER DIGITAL TWIN · MUNICIPAL GEOSPATIAL INTELLIGENCE',
      variant: 'research',
    },
    summary:
      'High-resolution hydrological digital twin transforming monsoon stormwater liabilities into distributed circular water assets for the Kolkata Metropolitan Basin.',
    provenance: {
      commit: '3cc89f8',
      status: 'LIVE',
      liveUrl: 'https://jalnetra-b0ab.onrender.com',
      repoUrl: 'https://github.com/Optimus1o1/JalNetra.git',
    },
    keyEquation: {
      name: 'Harvestable Volume Potential',
      formula: 'V = P × A × C × η',
      units: 'P (mm) · A (m²) · C [0,1] · η [0,1] → Litres (1 mm × 1 m² = 1 L)',
      note: 'Model validation reference: SSKM Hospital Campus (A = 32,500 m², P = 65 mm, concrete C = 0.90, silt-trap η = 0.88 → 1,673,100 L with zero algorithmic divergence).',
    },
    secondaryEquation: {
      name: 'Rational Method Peak Discharge',
      formula: 'Qp = (C × I × A) / 3.6',
      units: 'I (mm/h) · A (km²) · C [0,1] → Qp (m³/s)',
      note: 'Estimates peak stormwater runoff reduction relieving outfall lockups at Palmer’s Bridge, Ballygunge, and Dhapa pumping stations.',
    },
    capabilities: [
      {
        title: 'Harvestable Volume Potential',
        description:
          'Dimensionally proven volumetric yield calculations (1 mm × 1 m² = 1 L) for municipal catchments and industrial campuses.',
      },
      {
        title: 'Peak Runoff Discharge Abatement',
        description:
          'Rational Method hydrological peak discharge calculations estimating pumping station outfall relief during high-intensity monsoons.',
      },
      {
        title: 'Dynamic Mass-Balance Storage Sizing',
        description:
          'Simulates cistern sizing, dry-season drawdown, and uncaptured overflow across historical Kolkata precipitation series.',
      },
      {
        title: 'Multi-Criteria Recharge Indexing',
        description:
          'Geospatial evaluation of aquifer permeability, depth to water table, and soil transmissivity for safe groundwater injection.',
      },
    ],
    metrics: [
      {
        label: 'YIELD',
        value: '1 mm × 1 m²',
        unit: '= 1 L',
        variant: 'cyan',
      },
      {
        label: 'MODEL VALIDATION',
        value: 'SSKM CAMPUS',
        unit: 'ZERO DIVERGENCE',
        variant: 'emerald',
      },
      {
        label: 'DEPLOYMENT',
        value: 'LIVE',
        unit: 'RENDER',
        variant: 'copper',
      },
    ],
    techStack: [
      'Next.js 16',
      'PostgreSQL 17',
      'PostGIS 3.3',
      'MapLibre GL',
      'Prisma ORM',
      'Three.js',
      'Render',
    ],
    assets: {
      desktop: {
        type: 'live-production',
        src: '/images/projects/jalnetra_live_desktop.png',
        alt: 'JALNETRA Live Production Deployment — Kolkata Urban Water Digital Twin',
        caption: 'Application Screenshot · Live Production Deployment (Render)',
        sourceUrl: 'https://jalnetra-b0ab.onrender.com',
        sourceCommit: '3cc89f8',
        capturedAt: '2026-11-17',
        viewport: '1440x900',
      },
      mobile: {
        type: 'live-production',
        src: '/images/projects/jalnetra_live_mobile.png',
        alt: 'JALNETRA Live Production Deployment — Mobile Circular Water Dashboard',
        caption: 'Application Screenshot · Mobile View (390px)',
        sourceUrl: 'https://jalnetra-b0ab.onrender.com',
        sourceCommit: '3cc89f8',
        capturedAt: '2026-11-17',
        viewport: '390x844',
      },
    },
  },
];
