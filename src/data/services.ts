export interface ServiceTechnicalSpec {
  frameworks: string[];
  standards: string[];
  ownership: string;
  deployment: string;
}

export interface ServicePhase {
  phase: string;
  title: string;
  items: string[];
}

export interface ServiceItem {
  slug: string;
  number: string;
  title: string;
  tagline: string;
  intro: string;
  bestFor: string;
  timeline: string;
  keyDeliverables: string[];
  phasedDeliverables: ServicePhase[];
  technicalSpec: ServiceTechnicalSpec;
  included: string[];
  outcomes: string[];
  faqs: { question: string; answer: string }[];
}

export const servicesData: ServiceItem[] = [
  {
    slug: 'web-design',
    number: '01',
    title: 'Website design',
    tagline: 'UX/UI Architecture & Scalable Design Systems',
    intro:
      'Conversion-focused interfaces, design token architectures, and accessible design systems tailored to your brand, your users, and modern mobile ergonomics.',
    bestFor:
      'Businesses launching a digital product, redesigning legacy sites, or establishing a coherent cross-platform design system.',
    timeline: '2 to 4 weeks according to sitemap scope',
    keyDeliverables: [
      'Interactive clickable prototype in Figma with mobile-first layouts',
      'Design token system spanning typography, colors, and 8-pt spatial grid',
      'WCAG 2.2 Level AA contrast and keyboard navigation architecture',
    ],
    phasedDeliverables: [
      {
        phase: 'Phase 01',
        title: 'Information Architecture & Wireframes',
        items: [
          'Sitemap structuring and user flow mapping',
          'Low-fidelity desktop and mobile wireframes',
          'Content hierarchy and typography scale definition',
          'Accessible contrast palette and design token foundations',
        ],
      },
      {
        phase: 'Phase 02',
        title: 'High-Fidelity UI & Design System Handover',
        items: [
          'Interactive clickable prototype in Figma',
          'Production-ready vector assets (SVG icons, badges, illustrations)',
          'Component library with responsive layout constraints',
          'Developer handover documentation and design specifications',
        ],
      },
    ],
    technicalSpec: {
      frameworks: ['Figma', 'Tokens Studio', 'Vector SVG', 'Auto Layout'],
      standards: [
        'WCAG 2.2 Level AA Target',
        '8-pt Spatial Layout Grid',
        'Space Grotesk / Inter Pairing',
      ],
      ownership:
        'Direct Figma source file handover with commercial usage rights defined in agreement',
      deployment: 'Design token specs ready for frontend engineering implementation',
    },
    included: [
      'Sitemap and information architecture wireframes',
      'Custom visual design for desktop, tablet, and mobile viewports',
      'Clickable prototype for stakeholder review prior to development',
      'Design token system for typography, colors, and spatial rhythm',
      'WCAG 2.2 Level AA accessible contrast and visible focus states',
      'Vector icon, logo, and illustration sourcing and optimization',
    ],
    outcomes: [
      'A credible, memorable first impression within the first five seconds of user arrival',
      'Clear, friction-free conversion funnels from visitor curiosity to commercial enquiry',
      'Modular design tokens that accelerate frontend development and eliminate layout drift',
    ],
    faqs: [
      {
        question: 'Do I need to write all the website copy beforehand?',
        answer:
          'No. You provide raw notes, value propositions, and service details; we edit and shape them into clear, brand-aligned editorial copy.',
      },
      {
        question: 'How do design revisions work?',
        answer:
          'Every engagement includes two structured revision cycles at both wireframe and high-fidelity prototype stages, ensuring alignment before code is written.',
      },
      {
        question: 'What accessibility level do you target?',
        answer:
          'We target WCAG 2.2 Level AA criteria across contrast ratios, visible focus indicators, and touch target sizing for all agreed template scope.',
      },
    ],
  },
  {
    slug: 'web-development',
    number: '02',
    title: 'Web development',
    tagline: 'High-Performance Web Engineering',
    intro:
      'Fast, accessible web applications and commercial sites built with modern frameworks, strict type safety, zero unnecessary bloat, and pages that load predictably on every device.',
    bestFor:
      'Founders, business owners, and product teams requiring reliable, scalable web infrastructure without proprietary vendor lock-in.',
    timeline: '3 to 8 weeks depending on integration complexity',
    keyDeliverables: [
      'Semantic Next.js (App Router) or modern framework build with strict TypeScript',
      'Sub-2.5s LCP and sub-200ms INP Core Web Vitals targets at the 75th percentile',
      'Strict security configuration including CSP, HSTS, and input sanitization',
    ],
    phasedDeliverables: [
      {
        phase: 'Phase 01',
        title: 'Core Architecture & Frontend Engineering',
        items: [
          'Semantic HTML5 component architecture with zero bloat',
          'Strict TypeScript configuration and end-to-end type safety',
          'Responsive styling via utility CSS and 8-pt spatial rhythm',
          'Accessibility tree verification and visible focus state testing',
        ],
      },
      {
        phase: 'Phase 02',
        title: 'Integrations, Security & Repository Handover',
        items: [
          'Scope-dependent database or headless CMS integrations',
          'Security header enforcement (CSP, HSTS, X-Content-Type)',
          'Automated CI/CD deployment pipeline configuration',
          'Direct Git repository transfer with complete operational documentation',
        ],
      },
    ],
    technicalSpec: {
      frameworks: ['Next.js (App Router)', 'TypeScript', 'Tailwind CSS', 'React'],
      standards: [
        'Core Web Vitals Targets (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1)',
        'Strict CSP & Security Headers',
      ],
      ownership:
        'Complete repository access and source-code handover defined in engagement agreement',
      deployment:
        'Configured for Vercel, Render, or client-owned cloud infrastructure with automated CI/CD',
    },
    included: [
      'Custom builds in modern frameworks (Next.js/React) or your preferred CMS',
      'Core Web Vitals optimization targeting 75th-percentile field thresholds',
      'Accessible, keyboard-navigable form flows, modals, and navigation drawers',
      'Security headers, automated build linting, and input sanitization',
      'Cross-browser verification across modern Chrome, Safari, Firefox, and Edge',
      'Deployment on client-owned hosting with complete documentation',
    ],
    outcomes: [
      'Predictable, fast page rendering that keeps bounce rates low across mobile networks',
      'Clean, maintainable code with strict typing that reduces ongoing technical debt',
      'Full client ownership of repositories and hosting environments with documented handover',
    ],
    faqs: [
      {
        question: 'Can you work with an existing codebase or CMS?',
        answer:
          'Yes. We conduct a preliminary architectural audit and either modernize the existing codebase or perform a clean replatforming, depending on cost efficiency.',
      },
      {
        question: 'How is client code handed over?',
        answer:
          'The Git repository is transferred directly to your organization account, with deployment scripts, environment variables documentation, and zero proprietary lock-in.',
      },
      {
        question: 'What performance metrics do you target?',
        answer:
          'We engineer for Google recommended 75th-percentile Core Web Vitals: LCP ≤ 2.5s, INP ≤ 200ms, and CLS ≤ 0.1 on real-user field data.',
      },
    ],
  },
  {
    slug: 'seo',
    number: '03',
    title: 'Search engine optimisation',
    tagline: 'Technical Architecture & Search Growth',
    intro:
      'Technical indexation audits, structured data architecture (JSON-LD), and semantic search improvements that help high-intent customers find your business on Google.',
    bestFor:
      'Businesses wanting steady, compounding organic traffic without relying exclusively on paid ad auctions.',
    timeline: 'Technical remediation in 2 to 4 weeks; ranking compounding over 3 to 6 months',
    keyDeliverables: [
      'Full technical audit covering crawlability, indexation, speed, and mobile usability',
      'Semantic HTML5 structure and custom Schema.org (JSON-LD) implementation',
      'Keyword clustering, search intent architecture, and content gap roadmap',
    ],
    phasedDeliverables: [
      {
        phase: 'Phase 01',
        title: 'Technical Crawlability & Indexation Audit',
        items: [
          'Crawl error identification, redirect chain resolution, and canonicalization',
          'Robots.txt, XML sitemap generation, and search console verification',
          'Semantic schema markup (Organization, WebSite, BreadcrumbList)',
          'Core Web Vitals audit and page experience remediation',
        ],
      },
      {
        phase: 'Phase 02',
        title: 'Search Architecture & Performance Telemetry',
        items: [
          'High-intent keyword clustering and search intent mapping',
          'On-page title tag, heading hierarchy, and meta description optimization',
          'Local business schema and Google Business Profile alignment where applicable',
          'Transparent monthly search console reporting linking impressions to inquiries',
        ],
      },
    ],
    technicalSpec: {
      frameworks: [
        'Google Search Console',
        'Schema.org (JSON-LD)',
        'Semantic HTML5',
        'Screaming Frog',
      ],
      standards: [
        'Technical Crawlability & Indexing Hygiene',
        'Open Graph & Twitter Card Metadata',
      ],
      ownership:
        'All search console properties, tracking setups, and strategy documents owned by client',
      deployment: 'Integrated directly into frontend codebase or CMS template metadata',
    },
    included: [
      'Comprehensive technical audit of speed, crawlability, and indexation',
      'Keyword and competitor research mapped to real user search intent',
      'On-page optimization of semantic headings, titles, and body content',
      'Schema.org structured data implementation (JSON-LD)',
      'Google Search Console configuration and search telemetry tracking',
      'Clear, jargon-free monthly ranking and search traffic reporting',
    ],
    outcomes: [
      'A technically sound website that search engine crawlers can index without bottlenecks',
      'Higher search visibility for relevant, high-intent buyer searches rather than vanity traffic',
      'Transparent monthly search telemetry linking queries to impressions, clicks, and inquiries',
    ],
    faqs: [
      {
        question: 'Do you guarantee #1 ranking on Google?',
        answer:
          'No reputable engineering studio guarantees specific algorithmic rankings. We commit to technical crawlability, structured data compliance, and verifiable monthly telemetry.',
      },
      {
        question: 'How quickly does SEO produce results?',
        answer:
          'Technical indexing fixes register within weeks, while keyword ranking compounding typically develops over 3 to 6 months as domain authority builds.',
      },
      {
        question: 'Do all websites need crawl budget optimization?',
        answer:
          'No. Crawl-budget optimization is applied to large-scale websites with thousands of dynamic URLs; standard business sites focus on technical crawlability and semantic data.',
      },
    ],
  },
  {
    slug: 'digital-marketing',
    number: '04',
    title: 'Digital marketing',
    tagline: 'Performance & Attribution Infrastructure',
    intro:
      'Server-side tracking, dedicated low-latency landing page architectures, and disciplined multi-channel ad campaigns structured to generate measurable customer enquiries.',
    bestFor:
      'Established businesses ready to convert validated web assets into predictable, attributable customer inquiries.',
    timeline: 'Attribution setup and initial campaigns live in 1 to 2 weeks',
    keyDeliverables: [
      'Technical conversion tracking and Google Tag Manager architecture',
      'Low-latency, conversion-focused dedicated landing pages with zero redirect lag',
      'Targeted Google Ads and Meta campaign architecture with verified UTM taxonomy',
    ],
    phasedDeliverables: [
      {
        phase: 'Phase 01',
        title: 'Attribution Setup & Landing Page Architecture',
        items: [
          'Google Tag Manager container setup and custom event triggers',
          'GA4 conversion event definition and attribution modeling',
          'Fast, single-purpose landing page deployment with zero redirect delay',
          'Consistent UTM taxonomy and campaign link tagging protocols',
        ],
      },
      {
        phase: 'Phase 02',
        title: 'Campaign Deployment & Funnel Optimization',
        items: [
          'Search and social campaign configuration in client-owned accounts',
          'Automated lead notification webhooks (email/CRM integration)',
          'Scope-dependent server-side conversion API (CAPI) implementation',
          'Weekly campaign budget optimization and monthly attribution reporting',
        ],
      },
    ],
    technicalSpec: {
      frameworks: [
        'Google Tag Manager',
        'GA4',
        'Meta Ads Manager',
        'Google Ads',
        'Server-Side CAPI',
      ],
      standards: [
        'UTM Taxonomy Hygiene',
        'Server-Side Conversion Tracking',
        'First-Party Attribution',
      ],
      ownership:
        'All advertising accounts, pixels, and analytics properties remain in client legal name',
      deployment:
        'Media budget paid directly to ad platforms; zero hidden agency markups',
    },
    included: [
      'Campaign strategy, target audience profiling, and budget structuring',
      'Google Ads search and Meta performance campaign setup',
      'High-converting, mobile-optimized landing page architecture',
      'Conversion tracking, pixel verification, and analytics setup',
      'Automated email and webhook lead notification sequences',
      'Disciplined weekly campaign optimization and monthly attribution reports',
    ],
    outcomes: [
      'Complete visibility into customer acquisition cost (CAC) and conversion pathways',
      'High-converting landing pages engineered to load with zero redirect latency',
      'Transparent ad accounts that remain your property with historical performance data preserved',
    ],
    faqs: [
      {
        question: 'How is ad spend handled?',
        answer:
          'You pay the ad platforms directly from your billing profile. We do not markup media spend; you pay only our agreed engineering and management fee.',
      },
      {
        question: 'Who owns the advertising accounts and analytics data?',
        answer:
          'You own 100% of the ad accounts, GTM containers, and GA4 properties. Moon Sanctum Labs is granted manager access.',
      },
      {
        question: 'Do you implement server-side tracking (CAPI)?',
        answer:
          'Yes, where campaign volume and browser tracking limitations warrant server-side event deduplication.',
      },
    ],
  },
  {
    slug: 'branding-content',
    number: '05',
    title: 'Branding and content',
    tagline: 'Editorial Identity & Narrative Systems',
    intro:
      'Distinctive vector visual identities, tone of voice specifications, and editorial copywriting that establish an unmistakable, confident digital presence.',
    bestFor:
      'Founders launching a new venture or established companies modernizing an inconsistent visual identity.',
    timeline: '2 to 5 weeks from initial positioning to final asset delivery',
    keyDeliverables: [
      'Master vector logo system (primary mark, wordmark, dark/light variations)',
      'Color palette, variable typography pairing, and digital brand guidelines PDF',
      'Full-length editorial copywriting for core pages with zero lorem ipsum',
    ],
    phasedDeliverables: [
      {
        phase: 'Phase 01',
        title: 'Brand Positioning & Visual Direction',
        items: [
          'Industry and competitor visual audit to identify whitespace',
          'Core brand narrative, positioning statement, and tone of voice tenets',
          'Typographic pairing exploration and accessible palette formulation',
          'Two divergent conceptual identity directions for stakeholder review',
        ],
      },
      {
        phase: 'Phase 02',
        title: 'Identity Finalization & Asset Production',
        items: [
          'Final vector mark refinement, optical sizing, and geometry lockups',
          'Comprehensive brand guidelines manual (PDF and web-ready)',
          'Digital asset kit (favicons, SVG lockups, Open Graph templates)',
          'Editorial web copywriting for primary navigation pages',
        ],
      },
    ],
    technicalSpec: {
      frameworks: ['Vector SVG', 'Figma', 'Adobe Illustrator', 'Variable Fonts'],
      standards: [
        'Resolution-Independent Vector Standards',
        'WCAG AA Contrast Compliant Palettes',
      ],
      ownership:
        'Full commercial usage rights and master vector source files delivered upon settlement',
      deployment:
        'Exported as optimized SVGs, web font configurations, and social asset kits',
    },
    included: [
      'Brand positioning statement and editorial tone of voice tenets',
      'Master logo lockup and standalone mark for light and dark backgrounds',
      'Accessible color palette and web-optimized typography pairing',
      'High-impact editorial copywriting for core website pages',
      'Digital social template kit and vector favicon packages',
      'Comprehensive brand guidelines document defining clear usage rules',
    ],
    outcomes: [
      'A consistent, sophisticated visual identity that sets you apart from template-driven competitors',
      'Clear, compelling copy that articulates what you build and why it matters to customers',
      'Comprehensive asset library ready for immediate web, social, and print deployment',
    ],
    faqs: [
      {
        question: 'Can you refresh an existing logo without starting over?',
        answer:
          'Yes. We preserve established brand equity while modernizing geometry, typography, and contrast for modern screens.',
      },
      {
        question: 'Who owns the copyright to the logo and brand assets?',
        answer:
          'You own the final approved trademarks, vector files, and copy outright upon final milestone settlement.',
      },
      {
        question: 'Do you provide actual written copy for our website?',
        answer:
          'Yes. We write real, tailored editorial copy for every key page, avoiding generic placeholder text.',
      },
    ],
  },
  {
    slug: 'care-growth',
    number: '06',
    title: 'Care and growth',
    tagline: 'Continuous Stability & Cloud Maintenance',
    intro:
      'Automated endpoint uptime monitoring, regular security dependency patching, scheduled database backup audits, and monthly improvement sprints to keep your digital platform secure and evolving.',
    bestFor:
      'Growing businesses wanting an experienced technical team on call to maintain site security, speed, and continuous enhancements.',
    timeline: 'Ongoing month-to-month agreement; cancel anytime with 14-day notice',
    keyDeliverables: [
      'Automated 24/7 endpoint health and uptime monitoring with instant alert dispatch',
      'Monthly software, framework, and security dependency updates',
      'Dedicated development hours for proactive design, SEO, and feature improvements',
    ],
    phasedDeliverables: [
      {
        phase: 'Phase 01',
        title: 'Monitoring Setup & Operational Baseline',
        items: [
          'Automated endpoint pinging setup with multi-region latency checks',
          'SSL certificate expiration tracking and security header verification',
          'Dependency vulnerability scanning via automated tooling',
          'Initial health audit and backup configuration review',
        ],
      },
      {
        phase: 'Phase 02',
        title: 'Continuous Maintenance & Feature Sprints',
        items: [
          'Scheduled monthly package updates tested in staging before production release',
          'Scope-dependent database backup snapshot and restoration testing',
          'Monthly performance and Core Web Vitals regression audits',
          'Allocated engineering hours for continuous design, SEO, or feature tasks',
        ],
      },
    ],
    technicalSpec: {
      frameworks: [
        'Uptime Kuma / Better Stack',
        'GitHub Dependabot',
        'Vercel / Render CLI',
        'Playwright',
      ],
      standards: [
        'Automated 24/7 Endpoint Monitoring',
        'Continuous Security Dependency Patching',
      ],
      ownership:
        'Maintained directly inside client-owned repositories and cloud hosting accounts',
      deployment:
        'Documented staging-to-production deployment pipeline with rollback capability',
    },
    included: [
      'Managed cloud hosting configuration, routine updates, and backup oversight',
      'Automated 24/7 endpoint uptime and performance monitoring',
      'Dedicated engineering hours each month for small feature or content updates',
      'Proactive Core Web Vitals checks and security dependency patching',
      'Straightforward monthly performance and analytics summaries in plain English',
      'Priority email and asynchronous developer support during studio business hours',
    ],
    outcomes: [
      'Confidence that your web presence is continuously monitored and protected against vulnerabilities',
      'A site that stays technically current with new browser standards and search crawler updates',
      'An engineering partner who knows your architecture and resolves issues before users notice',
    ],
    faqs: [
      {
        question: 'What is the operational boundary for 24/7 monitoring vs support?',
        answer:
          'Automated monitoring tools ping endpoints 24/7 and trigger system alerts. Human engineering response and support are provided during agreed studio business hours (IST), with critical downtime prioritized.',
      },
      {
        question: 'Are backups tested for restoration?',
        answer:
          'Yes. For plans that include database management, backup snapshots are periodically tested in staging environments to verify data integrity.',
      },
      {
        question: 'Is there a long-term lock-in contract?',
        answer:
          'No. Care plans operate on a flexible month-to-month basis with cancel-anytime terms upon two weeks written notice.',
      },
    ],
  },
];
