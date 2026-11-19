export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  details?: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: 'Listen',
    description: 'We learn your business, customers and goals, then agree scope, timeline and price in writing.',
    details: 'Every project starts with a direct conversation with our engineering studio. We unpack your objectives, identify edge cases, and define clear deliverables before committing.',
  },
  {
    number: 2,
    title: 'Design',
    description: 'You see your pages take shape and give feedback before any code is written.',
    details: 'We build interactive Figma prototypes and design systems tailored to your industry, ensuring high contrast, clean typography, and seamless phone layouts.',
  },
  {
    number: 3,
    title: 'Build',
    description: 'We develop, test on real phones and set up search foundations, so launch holds no surprises.',
    details: 'Written in clean Next.js and TypeScript, optimized for sub-second Core Web Vitals, fully responsive, and secured with strict headers and data validation.',
  },
  {
    number: 4,
    title: 'Grow',
    description: 'After launch we track results, fix what slows you down and keep improving.',
    details: 'Continuous monitoring, search engine index verification, performance audits, and straightforward monthly reporting in plain English.',
  },
];
