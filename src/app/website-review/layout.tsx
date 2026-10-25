import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free website review | Moon Sanctum Labs',
  description:
    'Send us your website address and a senior member of our team will review its speed, search visibility and enquiry flow, then tell you the three fixes worth doing first. Free, no obligation.',
  alternates: { canonical: '/website-review' },
  openGraph: {
    title: 'A free review of your website, from a senior team',
    description: 'Speed, search visibility and enquiries, reviewed by a person. Three fixes worth doing first.',
    type: 'website',
  },
};

export default function WebsiteReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
