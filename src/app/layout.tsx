import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import { GlassNav } from "@/components/ui/GlassNav";
import { Footer } from "@/components/ui/Footer";
import { FloatingColorEffect } from "@/components/ui/FloatingColorEffect";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cipherstudios.dev"),
  title: "CIPHER — Decode. Build. Evolve. | Web Design & Development Agency",
  description:
    "Bespoke digital product & engineering studio founded by Aniket Nandi. We decode what your business actually needs, build it properly, and keep it evolving.",
  keywords: [
    "CIPHER",
    "web development agency",
    "Next.js agency",
    "SaaS MVP development",
    "Aniket Nandi",
    "Kolkata web studio",
    "Decode Build Evolve",
  ],
  authors: [{ name: "Aniket Nandi" }],
  openGraph: {
    title: "CIPHER — Decode. Build. Evolve.",
    description:
      "Bespoke web apps, high-conversion digital flagships, and SaaS MVPs engineered without bloated templates or tech debt.",
    url: "https://cipherstudios.dev",
    siteName: "CIPHER",
    images: [
      {
        url: "/og-cover-1200x630.png",
        width: 1200,
        height: 630,
        alt: "CIPHER — Decode. Build. Evolve.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icon-192.png",
    apple: "/apple-icon-180.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F1013",
  width: "device-width",
  initialScale: 1,
};

import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import dynamic from "next/dynamic";

const GlobalSpaceBackground = dynamic(
  () => import("@/components/three/GlobalSpaceBackground"),
  { ssr: false }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${manrope.variable} dark`}>
      <body className="bg-ink text-bone font-body min-h-screen flex flex-col selection:bg-copper selection:text-ink">
        <SmoothScrollProvider>
          <GlobalSpaceBackground />
          <FloatingColorEffect />
          <GlassNav />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

