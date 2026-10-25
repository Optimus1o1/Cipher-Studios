import React from 'react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/glass/GlassCard';
import { StatCard } from '@/components/ui/glass/StatCard';
import { Zap, Shield, Sparkles, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Styleguide | Moon Sanctum Labs',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StyleguidePage() {
  return (
    <div className="w-full pt-32 pb-24 px-6 md:px-12 max-w-content mx-auto space-y-16">
      <div>
        <span className="text-accent text-xs font-mono uppercase tracking-widest">
          Design System & Tokens
        </span>
        <h1 className="font-serif text-[3.2rem] font-light text-ink mt-2">
          Moon Sanctum Labs Styleguide
        </h1>
        <p className="text-mute text-lg mt-2">
          Apple-inspired typography, curated dark palette, glassmorphism tokens, and interactive components.
        </p>
      </div>

      {/* Palette Tokens */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl text-ink font-light border-b border-line pb-3">
          1. Color Palette Tokens
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <div className="h-20 rounded-input bg-[#05060d] border border-line" />
            <p className="text-xs font-mono text-ink">Background (#05060d)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-input bg-[#eceef4]" />
            <p className="text-xs font-mono text-ink">Ink (#eceef4)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-input bg-[#8e95aa]" />
            <p className="text-xs font-mono text-ink">Mute (#8e95aa)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-input bg-[#d8c3a0]" />
            <p className="text-xs font-mono text-ink">Accent Gold (#d8c3a0)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-input bg-[#e0a45c]" />
            <p className="text-xs font-mono text-ink">Accent Copper (#e0a45c)</p>
          </div>
        </div>
      </section>

      {/* Typography scale */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl text-ink font-light border-b border-line pb-3">
          2. Typography Hierarchy
        </h2>
        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono text-mute block mb-1">Display (Fraunces Light)</span>
            <p className="font-serif text-5xl md:text-6xl text-ink font-light">
              Decode. Build. Evolve.
            </p>
          </div>
          <div>
            <span className="text-xs font-mono text-mute block mb-1">Headline (Fraunces Light)</span>
            <p className="font-serif text-3xl md:text-4xl text-ink font-light">
              Websites that make your business easy to find.
            </p>
          </div>
          <div>
            <span className="text-xs font-mono text-mute block mb-1">Subhead (Fraunces)</span>
            <p className="font-serif text-2xl text-ink font-light">
              Six services, one team, one standard.
            </p>
          </div>
          <div>
            <span className="text-xs font-mono text-mute block mb-1">Body Text (Inter Regular)</span>
            <p className="font-sans text-[1.05rem] text-mute leading-relaxed max-w-[65ch]">
              We design and build fast, beautiful websites for business owners and startups, then bring in the search traffic and customers to fill them.
            </p>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl text-ink font-light border-b border-line pb-3">
          3. Button Variants & States
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary Pill</Button>
          <Button variant="secondary">Secondary Outline</Button>
          <Button variant="glass">Glass Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </section>

      {/* Glass UI Components */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl text-ink font-light border-b border-line pb-3">
          4. Glass UI Cards & Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard tone="dark" noise interactive>
            <h3 className="font-serif text-xl text-ink mb-2">Dark Glass Card</h3>
            <p className="text-mute text-sm leading-relaxed">
              Subtle background noise, 18px blur, inset top highlight and soft drop shadow.
            </p>
          </GlassCard>

          <StatCard
            icon={<Zap className="size-5" />}
            label="Mobile Performance"
            value="100"
            unit="/100"
            dots={{ filled: 5, total: 5 }}
          />

          <StatCard
            icon={<Sparkles className="size-5" />}
            label="Average Sprint"
            value="2–4"
            unit="Wks"
            dots={{ filled: 4, total: 5 }}
            href="/services"
          />
        </div>
      </section>
    </div>
  );
}
