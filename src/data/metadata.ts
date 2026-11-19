export const SITE_URL = 'https://moonsanctumlabs.design';

export const siteConfig = {
  name: 'Moon Sanctum Labs',
  slogan: 'Decode. Build. Evolve.',
  legalName: 'Moon Sanctum Labs',
  url: SITE_URL,
  description:
    'Moon Sanctum Labs is an independent web engineering and design studio in Kolkata, India. We design, build, and scale fast, accessible websites for business owners and startups worldwide.',
  email: 'hello@moonsanctumlabs.design',
  founder: {
    name: 'Aniket Nandi',
    role: 'Founder & Engineer',
    location: 'Kolkata, India · IST (UTC+5:30)',
  },
  social: {
    github: 'https://github.com/moon-sanctum-labs',
  },
};

/**
 * Coherent Schema.org JSON-LD graph for Moon Sanctum Labs
 * Strictly includes verified public information:
 * - Organization: Moon Sanctum Labs (Decode. Build. Evolve.)
 * - Person: Aniket Nandi (Founder & Engineer)
 * - ProfessionalService: 6 Orbital disciplines
 * Zero invented ratings, fake reviews, physical street addresses, or opening hours.
 */
export function getRootJsonLdGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        slogan: siteConfig.slogan,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
        email: siteConfig.email,
        description: siteConfig.description,
        founder: {
          '@id': `${SITE_URL}/#founder`,
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Kolkata',
          addressRegion: 'West Bengal',
          addressCountry: 'IN',
        },
        knowsAbout: [
          'Web Engineering',
          'Next.js',
          'TypeScript',
          'UX/UI Architecture',
          'Technical SEO',
          'Web Performance & Core Web Vitals',
          'Web Accessibility (WCAG 2.2)',
          'AI Systems & Privacy',
        ],
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#founder`,
        name: siteConfig.founder.name,
        jobTitle: siteConfig.founder.role,
        worksFor: {
          '@id': `${SITE_URL}/#organization`,
        },
        url: `${SITE_URL}/#studio`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Kolkata',
          addressCountry: 'IN',
        },
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}/#service-practice`,
        name: 'Moon Sanctum Labs — Orbital Services Practice',
        url: `${SITE_URL}/services`,
        provider: {
          '@id': `${SITE_URL}/#organization`,
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Engineering & Design Disciplines',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Website Design',
                description: 'UX/UI Architecture, Design Token Systems, and Accessible Digital Ergonomics.',
                url: `${SITE_URL}/services/web-design`,
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Web Development',
                description: 'Semantic Next.js Architecture, Type-Safe Backends, and High-Performance Engineering.',
                url: `${SITE_URL}/services/web-development`,
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Search Engine Optimization (SEO)',
                description: 'Technical Crawlability, Core Web Vitals Optimization, and Structured Data Systems.',
                url: `${SITE_URL}/services/seo`,
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Digital Marketing',
                description: 'Attribution Architecture, Privacy-Conscious Analytics, and Conversion Systems.',
                url: `${SITE_URL}/services/digital-marketing`,
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Branding & Content',
                description: 'Technical Narrative Architecture, Typography Systems, and Cohesive Brand Assets.',
                url: `${SITE_URL}/services/branding-content`,
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Care & Growth Plans',
                description: 'Continuous Maintenance, Synthetic Health Monitoring, and Evolutionary Sprints.',
                url: `${SITE_URL}/services/care-growth`,
              },
            },
          ],
        },
      },
    ],
  };
}

export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}
