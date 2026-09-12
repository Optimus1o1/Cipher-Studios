import React from "react";
import Link from "next/link";
import { BackgroundScene } from "@/components/ui/glass/BackgroundScene";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { AccentCard } from "@/components/ui/glass/AccentCard";
import { Button } from "@/components/ui/Button";
import {
  Layers,
  Sparkles,
  Cpu,
  ShoppingBag,
  Zap,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Services & Pricing Floor | CIPHER",
  description:
    "Explore CIPHER's bespoke engineering offerings: SaaS MVPs, Web Apps, High-Conversion Landing Pages, and Retainers.",
};

const SERVICES = [
  {
    id: "saas-mvp",
    title: "SaaS MVPs & Full-Stack Web Apps",
    badge: "FLAGSHIP",
    timeline: "3–6 Weeks",
    pricing: { usd: "$4,500 – $12,000", inr: "₹3,50,000 – ₹9,50,000" },
    tagline: "From zero to production-ready multi-tenant software with clean code",
    deliverables: [
      "Next.js App Router & strict TypeScript architecture",
      "PostgreSQL database setup (Supabase or Neon) with Prisma ORM",
      "Authentication (Auth.js or Clerk) with role-based access control",
      "Stripe / Razorpay payment integration & webhook management",
      "Automated email notifications via Resend",
      "Deploy-ready CI/CD configuration on Render or Vercel",
    ],
    icon: <Layers className="size-6 text-copper" />,
    isFlagship: true,
  },
  {
    id: "landing-pages",
    title: "High-Conversion Digital Flagships",
    badge: "PERFORMANCE",
    timeline: "7–14 Days",
    pricing: { usd: "$1,800 – $3,500", inr: "₹1,40,000 – ₹2,80,000" },
    tagline: "Laser-focused landing pages engineered for maximum conversion velocity",
    deliverables: [
      "Mobile-first bespoke layout with zero WordPress bloat",
      "Sub-second First Contentful Paint & Lighthouse 95+ score",
      "Custom micro-interactions and Framer Motion choreography",
      "Lead intake form with server actions, honeypot & validation",
      "Open Graph assets, JSON-LD structured data, and SEO optimization",
    ],
    icon: <Sparkles className="size-6 text-copper" />,
  },
  {
    id: "dashboards",
    title: "Internal Tooling & Command Centers",
    badge: "ENTERPRISE",
    timeline: "2–4 Weeks",
    pricing: { usd: "$3,200 – $7,500", inr: "₹2,50,000 – ₹6,00,000" },
    tagline: "Custom telemetry dashboards that replace messy spreadsheets",
    deliverables: [
      "Real-time WebSocket / polling data synchronization",
      "High-density data tables with sorting, filtering, and CSV export",
      "Granular permission controls & session logging",
      "Custom glass UI command cockpit ergonomics",
    ],
    icon: <Cpu className="size-6 text-copper" />,
  },
  {
    id: "ecommerce",
    title: "Headless E-Commerce Flagships",
    badge: "COMMERCE",
    timeline: "3–5 Weeks",
    pricing: { usd: "$3,800 – $8,500", inr: "₹3,00,000 – ₹6,80,000" },
    tagline: "Blazing fast storefronts designed to convert mobile shoppers",
    deliverables: [
      "Shopify Storefront API or bespoke cart/checkout pipeline",
      "Instant page transitions and client-side cart drawer",
      "Custom product configurators and high-resolution media galleries",
      "Abandoned checkout tracking and automated recovery emails",
    ],
    icon: <ShoppingBag className="size-6 text-copper" />,
  },
  {
    id: "speed",
    title: "Speed Audits & Architectural Redesigns",
    badge: "RECOVERY",
    timeline: "5–10 Days",
    pricing: { usd: "$1,500 – $3,000", inr: "₹1,20,000 – ₹2,40,000" },
    tagline: "Transforming sluggish sites into sub-second revenue machines",
    deliverables: [
      "Comprehensive Core Web Vitals diagnostic & bottleneck trace",
      "Asset optimization, font reduction, and dynamic code splitting",
      "Server-side caching strategies and edge distribution",
      "Guaranteed Lighthouse mobile improvement to 90+",
    ],
    icon: <Zap className="size-6 text-copper" />,
  },
  {
    id: "retainer",
    title: "Monthly Evolution & Engineering Retainer",
    badge: "CONTINUOUS",
    timeline: "Ongoing",
    pricing: { usd: "$1,200 – $2,500 / mo", inr: "₹95,000 – ₹1,95,000 / mo" },
    tagline: "Dedicated senior engineering bandwidth to keep compounding your product",
    deliverables: [
      "Dedicated weekly sprint hours for feature additions",
      "Proactive performance monitoring & security updates",
      "Conversion rate optimization experiments & A/B testing",
      "Direct Slack / WhatsApp channel with Aniket Nandi",
    ],
    icon: <RefreshCw className="size-6 text-copper" />,
  },
];

export default function ServicesPage() {
  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <BackgroundScene intensity="normal" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-mono text-copper uppercase tracking-widest">
            CLEAR TIERS &middot; TRANSPARENT FLOORS
          </span>
          <h1 className="mt-4 text-4xl sm:text-6xl font-heading font-semibold text-bone tracking-tight leading-[1.1]">
            Engineered Offerings. <br />
            <span className="text-slate-dark">Fixed Scopes. Zero Surprises.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-dark leading-relaxed">
            We never quote below our pricing floor because quality engineering cannot be discounted without compromising performance, accessibility, or security. Every engagement includes complete source code ownership.
          </p>
        </div>

        {/* Services List */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((srv) => (
            <GlassCard
              key={srv.id}
              id={srv.id}
              tone={srv.isFlagship ? "accent" : "dark"}
              className="p-6 sm:p-10 flex flex-col justify-between border border-white/15 hover-lift"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="p-3 rounded-full bg-white/5 border border-white/10">
                    {srv.icon}
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-copper bg-copper/10 px-3 py-1 rounded-full border border-copper/25">
                    {srv.badge}
                  </span>
                </div>

                <h2 className="mt-6 text-2xl sm:text-3xl font-heading font-semibold text-bone">
                  {srv.title}
                </h2>
                <p className="mt-2 text-sm text-slate-dark font-medium">
                  {srv.tagline}
                </p>

                {/* Timeline & Pricing Pill */}
                <div className="mt-6 p-4 rounded-glass-sm bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-slate-dark">
                    <Clock className="size-3.5 text-copper" />
                    <span>Timeline:</span>
                    <strong className="text-bone">{srv.timeline}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-copper font-semibold">{srv.pricing.usd}</span>
                    <span className="text-slate-dark ml-1">({srv.pricing.inr})</span>
                  </div>
                </div>

                {/* Deliverables List */}
                <div className="mt-6 space-y-2.5">
                  <p className="text-xs font-mono uppercase tracking-wider text-bone font-medium">
                    What&apos;s Included:
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-dark">
                    {srv.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-copper shrink-0 mt-0.5" />
                        <span className="text-bone/85">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs font-mono text-slate-dark">
                  Ready to spec this?
                </span>
                <Link href={`/contact?service=${encodeURIComponent(srv.title)}`} className="w-full sm:w-auto">
                  <Button size="sm" variant={srv.isFlagship ? "primary" : "glass"} className="w-full sm:w-auto justify-center">
                    Book Consultation
                  </Button>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Guarantees Box */}
        <div className="mt-16 p-8 sm:p-10 rounded-glass glass-dark border border-white/15">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="size-6 text-copper" />
            <h3 className="text-xl font-heading font-semibold text-bone">
              The CIPHER Engineering Guarantee
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-dark">
            <div>
              <strong className="text-bone block mb-1">100% Code Ownership</strong>
              You receive full administrative rights to your GitHub repository and cloud accounts on final payment.
            </div>
            <div>
              <strong className="text-bone block mb-1">Lighthouse 95+ Standard</strong>
              Every page is audited on a throttled mobile profile before delivery. We do not ship slow websites.
            </div>
            <div>
              <strong className="text-bone block mb-1">30-Day Post-Launch Warranty</strong>
              We fix any bug or regression discovered within 30 days of production deployment at zero additional charge.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
