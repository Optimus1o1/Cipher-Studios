import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Moon Sanctum Labs — Start a Project',
  description:
    'Start a direct conversation with Moon Sanctum Labs. Tell us about your project, timeline and goals. We review every enquiry personally and reply within one business day.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Moon Sanctum Labs — Start a Project',
    description:
      'Direct conversation with our engineering studio. Fixed price, clear timeline, zero agency layers.',
    url: '/contact',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
