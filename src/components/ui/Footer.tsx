"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ArrowUpRight, Clock, Globe, ShieldCheck } from "lucide-react";

export function Footer() {
  const [kolkataTime, setKolkataTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        setKolkataTime(timeStr);
      } catch (e) {
        setKolkataTime("IST (UTC+5:30)");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative border-t border-white/10 bg-ink pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-bone overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <Link href="/" className="inline-block" aria-label="CIPHER Home">
            <Logo size={36} tone="dark" withWordmark={true} />
          </Link>

          <p className="text-sm font-heading font-medium text-copper">
            Decode. Build. Evolve.
          </p>

          <p className="text-xs sm:text-sm text-slate-dark max-w-sm leading-relaxed">
            A bespoke digital product & engineering studio founded by Aniket Nandi. We build web apps, SaaS MVPs, and digital flagships engineered for speed, conversion, and longevity.
          </p>

          {/* Location & IST Telemetry pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-dark">
            <Globe className="size-3.5 text-copper" />
            <span>Kolkata, India</span>
            <span className="text-white/20">&bull;</span>
            <Clock className="size-3 text-copper" />
            <span className="text-bone">{kolkataTime || "12:00:00 PM IST"}</span>
          </div>
        </div>

        {/* Links Navigation */}
        <div className="md:col-span-2 space-y-3">
          <p className="text-xs font-mono uppercase tracking-wider text-bone font-medium">
            Navigation
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-dark">
            <li>
              <Link href="/services" className="hover:text-copper transition-colors">
                Services & Pricing
              </Link>
            </li>
            <li>
              <Link href="/work" className="hover:text-copper transition-colors">
                Case Studies
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-copper transition-colors">
                About the Studio
              </Link>
            </li>
            <li>
              <Link href="/#process" className="hover:text-copper transition-colors">
                Methodology
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-copper transition-colors">
                Project Intake
              </Link>
            </li>
          </ul>
        </div>

        {/* Client & Utility */}
        <div className="md:col-span-2 space-y-3">
          <p className="text-xs font-mono uppercase tracking-wider text-bone font-medium">
            Portals
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-dark">
            <li>
              <Link href="/portal" className="hover:text-copper transition-colors flex items-center gap-1">
                <span>Client Portal</span>
                <ArrowUpRight className="size-3 text-copper" />
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-copper transition-colors flex items-center gap-1">
                <span>Agency Admin</span>
                <ArrowUpRight className="size-3 text-copper" />
              </Link>
            </li>
            <li>
              <Link href="/styleguide" className="hover:text-copper transition-colors">
                Design System
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Guarantees */}
        <div className="md:col-span-3 space-y-3">
          <p className="text-xs font-mono uppercase tracking-wider text-bone font-medium">
            Direct Inquiries
          </p>
          <p className="text-xs text-slate-dark leading-relaxed">
            Accepting select client engagements for Q3/Q4. Full code ownership, zero lock-in, Lighthouse 95+ performance guarantee.
          </p>
          <a
            href="mailto:contact@cipherstudios.dev"
            className="inline-block text-xs font-mono text-copper hover:underline"
          >
            contact@cipherstudios.dev
          </a>

          <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-dark">
            <ShieldCheck className="size-3.5 text-copper" />
            <span>WCAG AA &amp; Core Web Vitals Guaranteed</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-dark font-mono">
        <p>
          &copy; {new Date().getFullYear()} CIPHER Studios. All rights reserved. Slogan: Decode. Build. Evolve.
        </p>
        <p>
          Lead Engineer &amp; Designer: Aniket Nandi
        </p>
      </div>
    </footer>
  );
}
