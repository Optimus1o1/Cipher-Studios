"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/glass/GlassCard";

export function FinalCtaSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <GlassCard
          tone="accent"
          tilt={true}
          maxTilt={4}
          className="p-6 sm:p-12 md:p-16 rounded-glass-lg border border-copper/50 text-center flex flex-col items-center"
        >
          <span className="text-xs font-mono font-semibold tracking-widest uppercase text-copper px-3 py-1 rounded-full bg-copper/20 border border-copper/30">
            START YOUR DISCOVERY SPRINT
          </span>

          <h2 className="mt-5 sm:mt-6 text-2xl sm:text-5xl md:text-6xl font-heading font-semibold tracking-tight text-bone max-w-3xl leading-[1.12]">
            Ready to decode what your product actually needs?
          </h2>

          <p className="mt-5 sm:mt-6 text-sm sm:text-base text-bone/80 max-w-xl leading-relaxed">
            We are currently booking 2 client engineering slots for Q3/Q4. Fast discovery, locked budgets, zero technical debt.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto justify-center" rightIcon={<ArrowRight className="size-4" />}>
                Submit Project Brief
              </Button>
            </Link>

            <a href="mailto:contact@cipherstudios.dev" className="w-full sm:w-auto">
              <Button size="lg" variant="glass" className="w-full sm:w-auto justify-center">
                Direct Email Inquiry
              </Button>
            </a>
          </div>

          <div className="mt-10 pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-bone/70">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-copper" />
              <span>Free 30-min discovery call</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-copper" />
              <span>Full IP &amp; repository ownership</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-copper" />
              <span>Transparent pricing floor</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
