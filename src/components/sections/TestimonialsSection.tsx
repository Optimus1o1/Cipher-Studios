"use client";

import React from "react";
import { TestimonialItem } from "@/types";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { Quote, Star } from "lucide-react";

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    author: "Stewart Sterling",
    role: "Chief Technology Officer",
    company: "Zenith Capital Markets",
    location: "London, UK",
    quote:
      "CIPHER did what three agencies failed to do: they understood our telemetry pipeline within 48 hours, delivered a flawless Next.js command center ahead of schedule, and achieved a 99 Lighthouse rating. Remarkable engineering caliber.",
    metric: "3.2x",
    metricLabel: "Query Speed Improvement",
  },
  {
    id: "2",
    author: "Dr. Elena Rostova",
    role: "Head of Computational Genomics",
    company: "Aether Biosystems",
    location: "Zurich, Switzerland",
    quote:
      "Aniket doesn’t just write code; he architected our entire scientific data viewer to feel like an aerospace tool. Clean, reliable, and without an ounce of bloat. CIPHER is our permanent engineering partner.",
    metric: "99/100",
    metricLabel: "Mobile Lighthouse Score",
  },
  {
    id: "3",
    author: "Marcus Lindqvist",
    role: "Founder & Creative Director",
    company: "Lumina Studio",
    location: "Stockholm, Sweden",
    quote:
      "Our mobile checkout conversions jumped 42% in the first 30 days after CIPHER rebuilt our headless store. Their three-phase Decode, Build, Evolve process took all the stress out of our launch.",
    metric: "+42%",
    metricLabel: "Conversion Lift",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto pb-14">
          <span className="text-xs font-mono text-copper uppercase tracking-widest">
            CLIENT ENDORSEMENTS
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-heading font-medium tracking-tight text-bone">
            Verified Partners. <br />
            <span className="text-slate-dark">No Fluff. Real Numbers.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <GlassCard
              key={item.id}
              tone="dark"
              tilt={true}
              interactive={true}
              className="p-5 sm:p-8 md:p-9 flex flex-col justify-between border border-white/10 hover:border-copper/40 group"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-1 text-copper">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-copper text-copper" />
                    ))}
                  </div>
                  <Quote className="size-5 text-white/20" />
                </div>

                <p className="mt-6 text-sm text-bone/90 leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-end justify-between">
                <div>
                  <p className="font-heading font-semibold text-bone text-sm">
                    {item.author}
                  </p>
                  <p className="text-xs text-slate-dark">{item.role}</p>
                  <p className="text-[11px] font-mono text-copper mt-0.5">
                    {item.company} &middot; {item.location}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xl font-heading font-semibold text-copper tabular-nums">
                    {item.metric}
                  </span>
                  <span className="block text-[10px] font-mono text-slate-dark uppercase">
                    {item.metricLabel}
                  </span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
