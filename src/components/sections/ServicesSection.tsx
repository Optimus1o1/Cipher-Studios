"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  Zap,
  RefreshCw,
  ArrowRight,
  Lock,
  CheckCircle2,
  Clock,
  Cpu,
} from "lucide-react";
import { StatCard } from "@/components/ui/glass/StatCard";
import { AccentCard } from "@/components/ui/glass/AccentCard";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { Button } from "@/components/ui/Button";

interface ServiceItem {
  id: string;
  title: string;
  badge: string;
  timeline: string;
  pricing: { usd: string; inr: string };
  tagline: string;
  deliverables: string[];
  icon: React.ReactNode;
  isFlagship?: boolean;
}

const DETAILED_SERVICES: ServiceItem[] = [
  {
    id: "clinic-intake",
    title: "Clinic Booking & Patient Intake Backends",
    badge: "HEALTHCARE FLAGSHIP",
    timeline: "3–4 Weeks",
    pricing: { usd: "$3,800 – $8,500", inr: "₹3,00,000 – ₹6,80,000" },
    tagline: "High-security booking engines, encrypted patient intake forms, and role-based staff permissions",
    deliverables: [
      "Next.js 14 App Router with zero third-party tracking scripts",
      "Encrypted patient intake pipeline with CSRF & rate limit protection",
      "Custom calendar synchronization & multi-provider schedule management",
      "Strict HIPAA/PHI data hygiene and sanitized server actions",
      "Sub-second mobile first-contentful paint & WCAG AA contrast standard",
      "Direct staff administrative cockpit with audit log trails",
    ],
    icon: <Lock className="size-6 text-copper" />,
    isFlagship: true,
  },
  {
    id: "saas-mvp",
    title: "SaaS MVPs & Full-Stack Web Apps",
    badge: "SOFTWARE MVP",
    timeline: "3–6 Weeks",
    pricing: { usd: "$4,500 – $12,000", inr: "₹3,50,000 – ₹9,50,000" },
    tagline: "From zero to production-ready multi-tenant software with clean code and zero technical debt",
    deliverables: [
      "Next.js App Router & strict TypeScript modular architecture",
      "PostgreSQL database setup (Supabase or Neon) with Prisma ORM",
      "Authentication (Auth.js or Clerk) with role-based access control",
      "Stripe / Razorpay payment integration & webhook management",
      "Automated transactional emails via Resend",
      "Deploy-ready CI/CD configuration on Vercel or Render",
    ],
    icon: <Layers className="size-6 text-copper" />,
  },
  {
    id: "landing-pages",
    title: "High-Conversion Digital Flagships",
    badge: "HIGH VELOCITY",
    timeline: "7–14 Days",
    pricing: { usd: "$1,800 – $3,500", inr: "₹1,40,000 – ₹2,80,000" },
    tagline: "Laser-focused landing pages engineered for maximum conversion velocity and sub-second load times",
    deliverables: [
      "Mobile-first bespoke layout with zero WordPress bloat",
      "Sub-second First Contentful Paint & Lighthouse 95+ score floor",
      "Custom 3D micro-interactions and Framer Motion choreography",
      "Lead intake form with server actions, honeypots & XSS validation",
      "Open Graph assets, JSON-LD structured data, and technical SEO",
    ],
    icon: <Sparkles className="size-6 text-copper" />,
  },
  {
    id: "dashboards",
    title: "Internal Tooling & Command Centers",
    badge: "ENTERPRISE",
    timeline: "2–4 Weeks",
    pricing: { usd: "$3,200 – $7,500", inr: "₹2,50,000 – ₹6,00,000" },
    tagline: "Custom telemetry dashboards that replace messy spreadsheets with real-time clarity",
    deliverables: [
      "Real-time WebSocket / polling data synchronization",
      "High-density data tables with sorting, filtering, and CSV export",
      "Granular permission controls & session activity audit logging",
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
    tagline: "Blazing fast storefronts designed to eliminate mobile cart drop-off and accelerate checkout",
    deliverables: [
      "Shopify Storefront API or bespoke cart/checkout pipeline",
      "Instant page transitions and client-side cart drawer persistence",
      "Custom product configurators and high-resolution media galleries",
      "Abandoned checkout tracking and automated recovery integrations",
    ],
    icon: <ShoppingBag className="size-6 text-copper" />,
  },
  {
    id: "speed-audit",
    title: "Speed Audits & Architecture Overhauls",
    badge: "REMEDIATION",
    timeline: "5–10 Days",
    pricing: { usd: "$1,500 – $3,000", inr: "₹1,20,000 – ₹2,40,000" },
    tagline: "Transforming sluggish sites into sub-second revenue engines with guaranteed Core Web Vitals passes",
    deliverables: [
      "Comprehensive Core Web Vitals diagnostic & bottleneck trace",
      "Asset optimization, font reduction, and dynamic code splitting",
      "Security header remediation (HSTS, CSP, X-Frame-Options)",
      "Before/After Lighthouse audit report with reproducible measurements",
    ],
    icon: <Zap className="size-6 text-copper" />,
  },
];

export function ServicesSection() {
  const [currency, setCurrency] = useState<"usd" | "inr">("usd");
  const [showAllDetails, setShowAllDetails] = useState(true);

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-copper mb-3">
              <ShieldCheck className="size-3.5" />
              <span>Security-First Engineering Offerings</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-medium tracking-tight text-bone">
              Infrastructure for High-Trust Practices. <br />
              <span className="text-slate-dark">Built Clean. Built to Last.</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-slate font-sans leading-relaxed">
              We security-review every client platform the way we review our own: role-based access, zero-leak API routing, strict CSP/HSTS policies, and sub-second mobile page loads.
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="p-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrency("usd")}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                  currency === "usd"
                    ? "bg-copper text-ink font-semibold shadow-sm"
                    : "text-slate-dark hover:text-bone"
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("inr")}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                  currency === "inr"
                    ? "bg-copper text-ink font-semibold shadow-sm"
                    : "text-slate-dark hover:text-bone"
                }`}
              >
                INR (₹)
              </button>
            </div>
          </div>
        </div>

        {/* Highlight Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AccentCard
            label="Clinic Booking & Patient Intake"
            badge="FLAGSHIP"
            value="3–4"
            unit="Weeks Typical"
            subtext="Private intake forms, calendar integration, role-based staff permissions, and zero third-party data tracking. Fast on mobile."
            icon={<Lock className="size-5 text-copper" />}
            ring={95}
            href="#clinic-intake"
          />

          <StatCard
            label="High-Conversion Practice Sites"
            value="3–5%"
            unit="Target CVR"
            icon={<Sparkles className="size-5" />}
            status="ok"
            dots={{ filled: 5, total: 5 }}
            href="#landing-pages"
          />

          <StatCard
            label="Security Audits & Hardening"
            value="100%"
            unit="Sanitized APIs"
            icon={<ShieldCheck className="size-5" />}
            status="ok"
            bars={[60, 75, 85, 90, 95, 100]}
            href="#speed-audit"
          />
        </div>

        {/* Detailed Scopes, Deliverables & Transparent Pricing Floors */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-copper">
                COMPLETE SCOPE CATALOG &amp; PRICING FLOORS
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-semibold text-bone mt-1">
                Transparent Fixed Pricing. No Hidden Hourly Surprises.
              </h3>
            </div>
            <p className="text-xs font-mono text-slate-dark">
              Pricing Floor per Service &middot; Never quoted below
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DETAILED_SERVICES.map((srv) => (
              <GlassCard
                key={srv.id}
                tone={srv.isFlagship ? "accent" : "dark"}
                className={`p-6 sm:p-8 flex flex-col justify-between border ${
                  srv.isFlagship ? "border-copper/40 shadow-copper-glow" : "border-white/10"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-copper px-2.5 py-1 rounded-full bg-copper/10 border border-copper/30">
                      {srv.badge}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-dark">
                      <Clock className="size-3 text-copper" />
                      <span>{srv.timeline}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="p-2.5 rounded-full bg-white/5 border border-white/10 shrink-0">
                      {srv.icon}
                    </div>
                    <h4 className="font-heading font-semibold text-bone text-lg leading-snug">
                      {srv.title}
                    </h4>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
                    {srv.tagline}
                  </p>

                  {/* Pricing Floor */}
                  <div className="py-3 px-4 rounded-glass-sm bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-dark block">
                      Scope Investment Floor
                    </span>
                    <span className="text-lg font-heading font-semibold text-copper">
                      {currency === "usd" ? srv.pricing.usd : srv.pricing.inr}
                    </span>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-mono text-slate-dark uppercase tracking-wider block">
                      Key Deliverables
                    </span>
                    <ul className="space-y-2 text-xs text-slate font-sans">
                      {srv.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="size-3.5 text-copper shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10">
                  <Link href="/contact" className="block w-full">
                    <Button
                      size="sm"
                      variant={srv.isFlagship ? "primary" : "glass"}
                      className="w-full justify-center"
                      rightIcon={<ArrowRight className="size-3.5" />}
                    >
                      Book Discovery Sprint
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
