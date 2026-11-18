export interface PhilosophyPillar {
  number: string;
  phase: string;
  title: string;
  tagline: string;
  description: string;
  deliverablesSummary: string;
}

export interface EngineeringPrinciple {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: 'Compass' | 'Layers' | 'ShieldCheck' | 'KeyRound';
}

export interface LifecycleStage {
  number: string;
  title: string;
  timeframe: string;
  summary: string;
  activities: string[];
}

export interface FounderData {
  name: string;
  role: string;
  studio: string;
  location: string;
  timezone: string;
  slogan: string;
  headline: string;
  leadParagraph: string;
  secondaryParagraph: string;
  philosophy: PhilosophyPillar[];
  principles: EngineeringPrinciple[];
  lifecycle: LifecycleStage[];
  portrait: {
    src: string;
    alt: string;
    aspectRatio: string;
    caption: string;
    status: string;
    recordId: string;
  };
}

export const founderData: FounderData = {
  name: 'Aniket Nandi',
  role: 'Founder & Engineer',
  studio: 'Moon Sanctum Labs',
  location: 'Kolkata, India',
  timezone: 'IST (UTC+5:30)',
  slogan: 'Decode. Build. Evolve.',
  headline: 'Crafting resilient web systems that refuse to be ordinary.',
  leadParagraph:
    'I founded Moon Sanctum Labs to build web applications, digital systems, and client platforms with deep technical conviction. In an industry increasingly saturated with disposable templates, fragile abstractions, and unverified marketing claims, we operate with a singular commitment: engineering discipline paired with thoughtful, enduring design.',
  secondaryParagraph:
    'My work spans full-stack web engineering, 3D WebGL interfaces, and responsible AI system architecture. I believe the best digital products emerge when engineering curiosity, systems-level problem decomposition, and human ergonomics converge into a coherent, living whole.',
  philosophy: [
    {
      number: '01',
      phase: 'DECODE',
      title: 'Deconstruct First',
      tagline: 'Understanding the problem before writing code',
      description:
        'We decode what a client’s business actually needs by unpacking revenue drivers, technical constraints, user psychology, and performance bottlenecks before drafting a single interface.',
      deliverablesSummary:
        'System architecture blueprint, user journey mapping, technical constraint audit.',
    },
    {
      number: '02',
      phase: 'BUILD',
      title: 'Architectural Craft',
      tagline: 'Disciplined engineering with zero bloat',
      description:
        'We engineer fast, accessible web applications using modern frameworks (Next.js, React, TypeScript), strict component boundaries, and semantic HTML5. We target Google’s 75th-percentile field thresholds (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.10) and WCAG 2.2 AA accessibility.',
      deliverablesSummary:
        'Strictly-typed codebase, semantic component library, automated build checks.',
    },
    {
      number: '03',
      phase: 'EVOLVE',
      title: 'Continuous Stewardship',
      tagline: 'Software is a living commercial asset',
      description:
        'Launch is the beginning of the lifecycle, not the end. Through 24/7 automated synthetic uptime and performance monitoring, regular dependency security audits, and structured maintenance sprints, we keep client systems resilient as their businesses scale.',
      deliverablesSummary:
        'Synthetic telemetry reporting, vulnerability patching, scheduled evolution sprints.',
    },
  ],
  principles: [
    {
      number: '01',
      title: 'Technical Curiosity & Rigor',
      subtitle: 'Architecture over framework churn',
      description:
        'We evaluate every technology from first principles. Dependencies are scrutinized for runtime cost, bundle weight, and security posture rather than temporary industry hype.',
      iconName: 'Compass',
    },
    {
      number: '02',
      title: 'Thoughtful Human Ergonomics',
      subtitle: 'Clarity, typography and accessibility',
      description:
        'High typographic discipline, visible keyboard focus indicators, and 8-pt spatial rhythm. Interfaces should be immediately intuitive and comfortable across mobile, tablet, and desktop.',
      iconName: 'Layers',
    },
    {
      number: '03',
      title: 'Responsible AI & Systems Integrity',
      subtitle: 'Deterministic guardrails and privacy boundaries',
      description:
        'We integrate machine learning and AI capabilities only where they solve tangible problems, backed by deterministic fallbacks and rigorous data sanitization (proven in our PRIVGUARD AI flagship).',
      iconName: 'ShieldCheck',
    },
    {
      number: '04',
      title: 'Transparent Client Ownership',
      subtitle: 'No vendor lock-in or hostage hosting',
      description:
        'Source-code handover, infrastructure access, and account ownership are defined transparently in the engagement agreement. Clients own their code, domain, and data from day one, respecting third-party and open-source licenses.',
      iconName: 'KeyRound',
    },
  ],
  lifecycle: [
    {
      number: '01',
      title: 'Investigation & Architecture',
      timeframe: 'Week 1',
      summary: 'Decomposing requirements and defining technical benchmarks.',
      activities: [
        'Business workflow & user constraint analysis',
        'Data modeling & technology stack selection',
        'Target Core Web Vitals & accessibility benchmarks',
      ],
    },
    {
      number: '02',
      title: 'Design Systems & Prototyping',
      timeframe: 'Weeks 1–3',
      summary: 'Establishing typography, responsive spatial grids, and interactive states.',
      activities: [
        'Editorial typographic hierarchy & color contrast auditing',
        'Interactive wireframe & high-fidelity prototype reviews',
        'Design token definitions and component state inventory',
      ],
    },
    {
      number: '03',
      title: 'Full-Stack Engineering & Hardening',
      timeframe: 'Weeks 3–6',
      summary: 'Writing typed, semantic Next.js code with strict security enforcement.',
      activities: [
        'Semantic HTML5 and strict TypeScript implementation',
        'Security headers, CSP configuration, and input sanitization',
        'Automated multi-device browser verification and security test runs',
      ],
    },
    {
      number: '04',
      title: 'Launch Telemetry & Evolution',
      timeframe: 'Post-Launch',
      summary: 'Production deployment cutover and ongoing system monitoring.',
      activities: [
        'DNS and cloud infrastructure cutover to client-owned accounts',
        'Synthetic 24/7 uptime & Core Web Vitals field telemetry',
        'Structured maintenance sprints and dependency security updates',
      ],
    },
  ],
  portrait: {
    src: '/images/founder/aniket_nandi.jpg',
    alt: 'Aniket Nandi, Founder & Engineer at Moon Sanctum Labs, in a denim shirt against an architectural hallway backdrop in Kolkata',
    aspectRatio: '3/4',
    caption: 'Founder & Engineer · Moon Sanctum Labs',
    status: 'ACTIVE STUDIO RECORD',
    recordId: 'MSL-FNDR-01',
  },
};
