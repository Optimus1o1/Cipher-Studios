export type SatellitePayloadType =
  | 'website-design'
  | 'web-development'
  | 'seo'
  | 'branding-content'
  | 'digital-marketing'
  | 'care-growth';

export interface SatelliteServiceConfig {
  id: number;
  slug: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  route: string;
  accentColor: string;
  emissiveColor: string;
  orbitPlane: 0 | 1;
  orbitRadius: number;
  baseAngle: number;
  orbitSpeed: number;
  layoutQuadrant: 'top-left' | 'top-right' | 'mid-right' | 'bottom-right' | 'bottom-left' | 'mid-left';
  payloadType: SatellitePayloadType;
  iconType: 'design' | 'dev' | 'seo' | 'branding' | 'marketing' | 'care';
}

export const SATELLITE_CONFIGS: SatelliteServiceConfig[] = [
  {
    id: 0,
    slug: 'web-design',
    number: '01',
    title: 'Website design',
    tagline: 'Beautiful. Functional. Yours.',
    description: 'Thoughtful, conversion-focused designs shaped around your brand, your customers, and the way your business works.',
    route: '/services/web-design',
    accentColor: '#d8c3a0', // Champagne
    emissiveColor: '#d8c3a0',
    orbitPlane: 0,
    orbitRadius: 2.95, // Tuned for >=60px right viewport clearance (Issue 2)
    baseAngle: 0.20, // Right-flank staggered phase
    orbitSpeed: 0.038,
    layoutQuadrant: 'top-left',
    payloadType: 'website-design',
    iconType: 'design',
  },
  {
    id: 1,
    slug: 'web-development',
    number: '02',
    title: 'Web development',
    tagline: 'Clean Code. Scalable Solutions.',
    description: 'Fast, reliable websites and web applications built with clean code, solid security, and room to grow.',
    route: '/services/web-development',
    accentColor: '#9fc7e8', // Ice Blue
    emissiveColor: '#9fc7e8',
    orbitPlane: 1,
    orbitRadius: 3.55,
    baseAngle: 0.70, // Staggered to clear headline right edge (Issue 1)
    orbitSpeed: 0.034,
    layoutQuadrant: 'top-right',
    payloadType: 'web-development',
    iconType: 'dev',
  },
  {
    id: 2,
    slug: 'seo',
    number: '03',
    title: 'Search engine optimisation',
    tagline: 'More Visibility. More Growth.',
    description: 'Technical improvements, research, and useful content that help the right customers discover your business.',
    route: '/services/seo',
    accentColor: '#7fb5b0', // Teal
    emissiveColor: '#7fb5b0',
    orbitPlane: 0,
    orbitRadius: 3.62,
    baseAngle: 2.38, // Modest shift to left to clear 'Six' headline & Moon upper limb (Issue 1)
    orbitSpeed: 0.036,
    layoutQuadrant: 'mid-right',
    payloadType: 'seo',
    iconType: 'seo',
  },
  {
    id: 3,
    slug: 'digital-marketing',
    number: '04',
    title: 'Digital marketing',
    tagline: 'Reach. Engage. Convert.',
    description: 'Targeted campaigns and digital experiences designed to increase reach, generate enquiries, and support measurable growth.',
    route: '/services/digital-marketing',
    accentColor: '#9a8cc4', // Violet
    emissiveColor: '#9a8cc4',
    orbitPlane: 1,
    orbitRadius: 2.92, // Tuned for >=60px left viewport clearance (Issue 3)
    baseAngle: 3.25, // Left-flank staggered phase
    orbitSpeed: 0.035,
    layoutQuadrant: 'bottom-right',
    payloadType: 'digital-marketing',
    iconType: 'marketing',
  },
  {
    id: 4,
    slug: 'branding-content',
    number: '05',
    title: 'Branding and content',
    tagline: 'Stories. Designs. Impact.',
    description: 'Consistent visual identities, thoughtful messaging, and compelling content that make your business recognisable.',
    route: '/services/branding-content',
    accentColor: '#c49a6c', // Warm Bronze
    emissiveColor: '#c49a6c',
    orbitPlane: 0,
    orbitRadius: 3.52,
    baseAngle: 4.15, // Lower-left shoulder staggered phase
    orbitSpeed: 0.037,
    layoutQuadrant: 'bottom-left',
    payloadType: 'branding-content',
    iconType: 'branding',
  },
  {
    id: 5,
    slug: 'care-growth',
    number: '06',
    title: 'Care and growth',
    tagline: 'Support. Maintain. Scale.',
    description: 'Reliable hosting, maintenance, monitoring, and ongoing improvements that keep your digital presence moving forward.',
    route: '/services/care-growth',
    accentColor: '#8fae8b', // Sage Green
    emissiveColor: '#8fae8b',
    orbitPlane: 1,
    orbitRadius: 3.48, // Tuned for >=60px viewport clearance on right flank and >=20px Moon outline separation (Issue 2 & 4)
    baseAngle: 5.50, // Lower-right shoulder phase for 20px Moon clearance without limb overlap
    orbitSpeed: 0.033,
    layoutQuadrant: 'mid-left',
    payloadType: 'care-growth',
    iconType: 'care',
  },
];
