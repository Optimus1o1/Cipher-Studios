import type { Metadata } from 'next';
import { Inter, Fraunces, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { TopChrome, BottomChrome } from '@/components/ui/SiteChrome';
import { OrbitalProvider } from '@/context/OrbitalContext';
import { SITE_URL, getRootJsonLdGraph } from '@/data/metadata';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500'],
  variable: '--font-fraunces',
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Moon Sanctum Labs | Web Design, Development, SEO & Growth',
  description:
    'Moon Sanctum Labs is an independent web engineering and design studio in Kolkata, India. We design, build and scale fast, beautiful websites for business owners and startups worldwide.',
  keywords: [
    'web design',
    'web development',
    'SEO',
    'digital marketing',
    'branding',
    'Kolkata web studio',
    'Moon Sanctum Labs',
  ],
  authors: [{ name: 'Moon Sanctum Labs' }],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Moon Sanctum Labs — Decode. Build. Evolve.',
    description:
      'Websites that make your business easy to find and hard to forget. Independent web design, development and search growth.',
    siteName: 'Moon Sanctum Labs',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Moon Sanctum Labs | Independent Web Engineering Studio',
    description:
      'Websites that make your business easy to find and hard to forget.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script type="application/ld+json">
          {JSON.stringify(getRootJsonLdGraph())}
        </script>
      </head>
      <body className="bg-bg text-ink min-h-screen flex flex-col selection:bg-accent selection:text-bg">
        <OrbitalProvider>
          {/* Skip to main content for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[9999] px-4 py-2 bg-accent text-bg font-semibold rounded-pill shadow-lg focus:outline-none"
          >
            Skip to main content
          </a>

          {/* 3D moon + navigation (hidden on landing pages such as /website-review) */}
          <TopChrome />

          {/* Main Content Area */}
          <main id="main-content" className="relative z-10 flex-grow pointer-events-none">
            {children}
          </main>

          {/* Footer (hidden on landing pages) */}
          <BottomChrome />
        </OrbitalProvider>
      </body>
    </html>
  );
}
