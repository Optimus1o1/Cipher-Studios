export interface ServiceItem {
  slug: string;
  title: string;
  intro: string;
  bestFor: string;
  timeline: string;
  included: string[];
  outcomes: string[];
  faqs: { question: string; answer: string }[];
}

export const servicesData: ServiceItem[] = [
  {
    slug: 'web-design',
    title: 'Website design',
    intro: 'Layouts shaped around your brand and your customers, designed for phones first and ready for real content.',
    bestFor: 'Businesses launching a site or replacing one that no longer feels like them.',
    timeline: '2 to 4 weeks',
    included: [
      'Sitemap and page wireframes',
      'Custom visual design for desktop and mobile',
      'Clickable prototype to review before build',
      'Design system of colours, type and components',
      'Accessible contrast and focus states',
      'Image, icon and illustration sourcing',
    ],
    outcomes: [
      'A site that looks credible within five seconds',
      'Clear paths from visitor to enquiry',
      'Design files you own, ready for development',
    ],
    faqs: [
      {
        question: 'Do I need to write the content?',
        answer: 'No. Send us notes and we shape them into clear, polished copy with you.',
      },
      {
        question: 'How many revisions are included?',
        answer: 'Two structured rounds at each stage, with more available if the scope grows.',
      },
    ],
  },
  {
    slug: 'web-development',
    title: 'Web development',
    intro: 'Business sites, web apps and online stores built with clean code, solid security and pages that load fast on any phone.',
    bestFor: 'Founders and owners who need a site or product that works, scales and stays maintainable.',
    timeline: '3 to 8 weeks',
    included: [
      'Custom builds in modern frameworks or your preferred CMS',
      'Online stores and payment integration',
      'Forms, bookings, logins and dashboards',
      'Performance tuning for Core Web Vitals',
      'Security headers, backups and monitoring',
      'Deployment on hosting you own',
    ],
    outcomes: [
      'A fast site that is simple to update',
      'Code and accounts transferred to you',
      'Fewer plugins, fewer breakages, lower running costs',
    ],
    faqs: [
      {
        question: 'Can you work with our existing site?',
        answer: 'Yes. We audit what you have, then rebuild or improve it, whichever costs you less.',
      },
      {
        question: 'Will I be able to edit it myself?',
        answer: 'Yes. We set up a simple editor and show you how to use it.',
      },
    ],
  },
  {
    slug: 'seo',
    title: 'Search engine optimisation',
    intro: 'Technical fixes, research and content that help people searching for what you sell find you on Google.',
    bestFor: 'Businesses that rely on being found locally or online and want steady, compounding traffic.',
    timeline: 'First results in 3 to 6 months',
    included: [
      'Technical audit of speed, crawling and indexing',
      'Keyword and competitor research',
      'On-page optimisation of titles, headings and content',
      'Local SEO and Google Business Profile setup',
      'Content plan and article writing',
      'Monthly ranking and traffic reports',
    ],
    outcomes: [
      'More of the right visitors, not just more visitors',
      'A site search engines can read and trust',
      'Reports that connect rankings to enquiries',
    ],
    faqs: [
      {
        question: 'How long does SEO take?',
        answer: 'Expect early movement within a few months and stronger results as content and authority build.',
      },
      {
        question: 'Do you guarantee page one?',
        answer: 'No honest agency can. We commit to the work, the reporting and the improvements we can measure.',
      },
    ],
  },
  {
    slug: 'digital-marketing',
    title: 'Digital marketing',
    intro: 'Google and social ads, email and landing pages set up to bring in enquiries you can measure.',
    bestFor: 'Owners ready to turn a good website into a steady flow of leads or sales.',
    timeline: 'Live in 1 to 2 weeks',
    included: [
      'Strategy, audience and budget planning',
      'Google Ads and Meta ad campaigns',
      'Conversion-focused landing pages',
      'Email and WhatsApp follow-up sequences',
      'Conversion tracking and analytics setup',
      'Weekly optimisation and monthly reporting',
    ],
    outcomes: [
      'Every rupee or dollar tracked to a result',
      'Landing pages tested against real traffic',
      'A funnel that improves month after month',
    ],
    faqs: [
      {
        question: 'What ad budget do I need?',
        answer: 'We recommend a starting budget after reviewing your market, then adjust based on results.',
      },
      {
        question: 'Do you manage the ad accounts?',
        answer: 'Yes, inside accounts that stay in your name, so you keep full ownership and access.',
      },
    ],
  },
  {
    slug: 'branding-content',
    title: 'Branding and content',
    intro: 'Logos, colours, copywriting and graphics, so your website and everything around it look like one confident business.',
    bestFor: 'New businesses and growing brands that look inconsistent or have no clear voice yet.',
    timeline: '2 to 5 weeks',
    included: [
      'Brand positioning and voice',
      'Logo and visual identity',
      'Colour palette and typography system',
      'Website and marketing copywriting',
      'Social media templates and graphics',
      'Brand guidelines document',
    ],
    outcomes: [
      'A recognisable, consistent identity',
      'Words that explain what you do and why it matters',
      'Assets ready for web, print and social',
    ],
    faqs: [
      {
        question: 'Can you refresh our existing brand?',
        answer: 'Yes. We keep what already works and modernise what does not.',
      },
      {
        question: 'Who owns the final files?',
        answer: 'You do, including all source files and the licences we set up for you.',
      },
    ],
  },
  {
    slug: 'care-growth',
    title: 'Care and growth',
    intro: 'Hosting, updates, backups and monthly improvements, so your site stays fast, secure and moving forward after launch.',
    bestFor: 'Businesses that want a reliable team on call instead of a site that quietly ages.',
    timeline: 'Monthly, cancel anytime',
    included: [
      'Managed hosting, updates and backups',
      'Uptime and security monitoring',
      'Small design and content changes each month',
      'Speed and conversion improvements',
      'Analytics review in plain English',
      'Priority support by email',
    ],
    outcomes: [
      'A site that never falls behind',
      'Problems fixed before customers notice',
      'A regular partner who knows your business',
    ],
    faqs: [
      {
        question: 'Is there a long contract?',
        answer: 'No. Care plans run month to month.',
      },
      {
        question: 'What if something breaks?',
        answer: 'We monitor continuously and fix issues quickly, with priority support for plan clients.',
      },
    ],
  },
];
