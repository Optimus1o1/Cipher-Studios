import React from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { BackgroundScene } from "@/components/ui/glass/BackgroundScene";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { Button } from "@/components/ui/Button";
import {
  Code,
  Compass,
  Cpu,
  Globe,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "About CIPHER | Decode. Build. Evolve.",
  description:
    "Learn about CIPHER, an independent web engineering and design studio led by Aniket Nandi based in Kolkata, India.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <BackgroundScene intensity="normal" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <div className="mb-4 inline-block">
            <Logo size={44} tone="dark" withWordmark={true} />
          </div>
          <br />
          <span className="text-xs font-mono text-copper uppercase tracking-widest">
            THE STUDIO
          </span>
          <h1 className="mt-4 text-4xl sm:text-6xl font-heading font-semibold text-bone tracking-tight leading-[1.1]">
            Decode. Build. Evolve. <br />
            <span className="text-slate-dark">The Name is the Promise.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-dark leading-relaxed">
            CIPHER is a web design and full-stack engineering studio operated by Aniket Nandi from Kolkata, India. We build high-speed websites, SaaS MVPs, and complex web applications for founders and global businesses who care about performance, design rigor, and business outcomes.
          </p>
        </div>

        {/* Narrative Cards */}
        <div className="mt-16 space-y-8">
          <GlassCard tone="dark" className="p-8 sm:p-12 border border-white/15">
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-bone">
              Why We Say <span className="text-copper">Decode. Build. Evolve.</span>
            </h2>
            <div className="mt-6 space-y-4 text-sm sm:text-base text-slate-dark leading-relaxed">
              <p>
                Most agency clients come to us after being burned by traditional software firms. They were handed bloated WordPress themes packed with 40 plugins, fragile no-code setups that broke on minor updates, or codebases with zero documentation and massive technical debt.
              </p>
              <p>
                We operate under three unwavering principles:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="p-5 rounded-glass-sm bg-white/5 border border-white/10 space-y-2">
                  <h3 className="font-heading font-semibold text-bone text-lg">
                    01. Decode.
                  </h3>
                  <p className="text-xs text-slate-dark">
                    We discover what your business actually needs before writing a single line of code. We clarify unit economics, user journeys, and architectural constraints.
                  </p>
                </div>
                <div className="p-5 rounded-glass-sm bg-white/5 border border-white/10 space-y-2">
                  <h3 className="font-heading font-semibold text-copper text-lg">
                    02. Build.
                  </h3>
                  <p className="text-xs text-slate-dark">
                    We build properly using clean Next.js, strict TypeScript, and modular design tokens. Zero lorem ipsum, sub-second speeds, and WCAG AA contrast.
                  </p>
                </div>
                <div className="p-5 rounded-glass-sm bg-white/5 border border-white/10 space-y-2">
                  <h3 className="font-heading font-semibold text-bone text-lg">
                    03. Evolve.
                  </h3>
                  <p className="text-xs text-slate-dark">
                    Launch day is not the finish line. We monitor real-user metrics, fix edge cases proactively, and provide continuous engineering support to help your product compound.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Standards & Non-Negotiables */}
          <GlassCard tone="dark" className="p-8 sm:p-12 border border-white/15">
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-bone">
              Our Engineering Floor
            </h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-full bg-copper/10 border border-copper/25 text-copper shrink-0">
                  <Zap className="size-5" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-bone text-base">
                    Lighthouse &ge; 90 on Mobile
                  </h4>
                  <p className="mt-1 text-xs text-slate-dark leading-relaxed">
                    We test every page under throttled mobile conditions. If a page doesn&apos;t load in sub-second time, it doesn&apos;t ship.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-full bg-copper/10 border border-copper/25 text-copper shrink-0">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-bone text-base">
                    WCAG AA Accessibility
                  </h4>
                  <p className="mt-1 text-xs text-slate-dark leading-relaxed">
                    Visible focus rings, screen reader labels, high contrast ratios, and complete `prefers-reduced-motion` compliance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-full bg-copper/10 border border-copper/25 text-copper shrink-0">
                  <Terminal className="size-5" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-bone text-base">
                    Strict Type Safety
                  </h4>
                  <p className="mt-1 text-xs text-slate-dark leading-relaxed">
                    TypeScript with zero `any` shortcuts. Shared Zod validation across frontend and backend boundaries.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-full bg-copper/10 border border-copper/25 text-copper shrink-0">
                  <Globe className="size-5" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-bone text-base">
                    Full Client Ownership
                  </h4>
                  <p className="mt-1 text-xs text-slate-dark leading-relaxed">
                    No agency proprietary lock-in. You own the repository, the domain, the hosting, and every line of code.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Founder Section */}
          <GlassCard tone="accent" className="p-8 sm:p-12 border border-copper/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-copper">
                  FOUNDER &amp; LEAD ENGINEER
                </span>
                <h3 className="mt-2 text-2xl sm:text-3xl font-heading font-semibold text-bone">
                  Aniket Nandi
                </h3>
                <p className="text-xs font-mono text-copper mt-1">
                  Kolkata, India &middot; IST (UTC+5:30)
                </p>
                <p className="mt-4 text-xs sm:text-sm text-bone/80 max-w-lg leading-relaxed">
                  Leading full-stack engineering, 3D spatial interface design, and client engagements at CIPHER. Available for select new client builds and long-term technical advisory.
                </p>
              </div>

              <div className="shrink-0">
                <Link href="/contact">
                  <Button size="lg" variant="primary">
                    Initiate Direct Inquiry
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
