export interface SatelliteConfig {
  id: number;
  slug: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  accentColor: string;
  emissiveColor: string;
  orbitPlane: 0 | 1;
  orbitRadius: number;
  baseAngle: number;
  orbitSpeed: number;
  layoutQuadrant: 'top-left' | 'top-right' | 'mid-right' | 'bottom-right' | 'bottom-left' | 'mid-left';
  iconType: 'design' | 'dev' | 'seo' | 'branding' | 'marketing' | 'care';
}

export const SATELLITE_CONFIGS: SatelliteConfig[] = [
  {
    id: 0,
    slug: 'web-design',
    number: '01',
    title: 'Website design',
    tagline: 'Beautiful. Functional. Yours.',
    description: 'Thoughtful, conversion-focused designs shaped around your brand, your customers, and the way your business works.',
    accentColor: '#d8c3a0',
    emissiveColor: '#cbb58d',
    orbitPlane: 0,
    orbitRadius: 3.1,
    baseAngle: 2.35, // Upper-left
    orbitSpeed: 0.038,
    layoutQuadrant: 'top-left',
    iconType: 'design',
  },
  {
    id: 1,
    slug: 'web-development',
    number: '02',
    title: 'Web development',
    tagline: 'Clean Code. Scalable Solutions.',
    description: 'Fast, reliable websites and web applications built with clean code, solid security, and room to grow.',
    accentColor: '#8eafd8',
    emissiveColor: '#5f8bc9',
    orbitPlane: 1,
    orbitRadius: 3.25,
    baseAngle: 0.85, // Upper-right
    orbitSpeed: 0.034,
    layoutQuadrant: 'top-right',
    iconType: 'dev',
  },
  {
    id: 2,
    slug: 'seo',
    number: '03',
    title: 'Search engine optimisation',
    tagline: 'More Visibility. More Growth.',
    description: 'Technical improvements, research, and useful content that help the right customers discover your business.',
    accentColor: '#83b8aa',
    emissiveColor: '#5aa392',
    orbitPlane: 0,
    orbitRadius: 3.35,
    baseAngle: 0.12, // Mid-right
    orbitSpeed: 0.036,
    layoutQuadrant: 'mid-right',
    iconType: 'seo',
  },
  {
    id: 3,
    slug: 'digital-marketing',
    number: '04',
    title: 'Digital marketing',
    tagline: 'Reach. Engage. Convert.',
    description: 'Targeted campaigns and digital experiences designed to increase reach, generate enquiries, and support measurable growth.',
    accentColor: '#9a83c9',
    emissiveColor: '#8265bd',
    orbitPlane: 1,
    orbitRadius: 3.05,
    baseAngle: 5.35, // Lower-right
    orbitSpeed: 0.035,
    layoutQuadrant: 'bottom-right',
    iconType: 'marketing',
  },
  {
    id: 4,
    slug: 'branding-content',
    number: '05',
    title: 'Branding and content',
    tagline: 'Stories. Designs. Impact.',
    description: 'Consistent visual identities, thoughtful messaging, and compelling content that make your business recognisable.',
    accentColor: '#d0a36f',
    emissiveColor: '#bd8c50',
    orbitPlane: 0,
    orbitRadius: 3.15,
    baseAngle: 3.95, // Lower-left
    orbitSpeed: 0.037,
    layoutQuadrant: 'bottom-left',
    iconType: 'branding',
  },
  {
    id: 5,
    slug: 'care-growth',
    number: '06',
    title: 'Care and growth',
    tagline: 'Support. Maintain. Scale.',
    description: 'Reliable hosting, maintenance, monitoring, and ongoing improvements that keep your digital presence moving forward.',
    accentColor: '#9eae8b',
    emissiveColor: '#84996e',
    orbitPlane: 1,
    orbitRadius: 3.3,
    baseAngle: 3.1, // Mid-left
    orbitSpeed: 0.033,
    layoutQuadrant: 'mid-left',
    iconType: 'care',
  },
];
