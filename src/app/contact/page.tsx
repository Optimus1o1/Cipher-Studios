"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BackgroundScene } from "@/components/ui/glass/BackgroundScene";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe,
  Mail,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

function ContactFormContent() {
  const searchParams = useSearchParams();
  const defaultService = searchParams.get("service") || "SaaS MVP & Web App";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    serviceType: defaultService,
    budgetRange: "$5,000 – $10,000 (₹4L – ₹8L)",
    timeline: "3–6 Weeks",
    message: "",
    honeypot: "", // Bot trap
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Honeypot check
    if (formData.honeypot) {
      setIsSuccess(true);
      return;
    }

    if (!formData.fullName || !formData.email || !formData.message) {
      setErrorMsg("Please fill in your name, email, and project message.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit project inquiry.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please email directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard tone="dark" className="p-5 sm:p-10 border border-white/15">
      {isSuccess ? (
        <div className="py-12 text-center space-y-4 animate-in fade-in">
          <div className="size-14 rounded-full bg-copper/20 border border-copper/40 text-copper grid place-items-center mx-auto">
            <CheckCircle2 className="size-7" />
          </div>
          <h3 className="text-2xl font-heading font-semibold text-bone">
            Inquiry Received
          </h3>
          <p className="text-sm text-slate-dark max-w-md mx-auto leading-relaxed">
            Thank you, <span className="text-bone font-medium">{formData.fullName}</span>. Aniket Nandi will personally review your brief and reply within 24 hours with an initial evaluation.
          </p>
          <div className="pt-4">
            <Button
              variant="glass"
              onClick={() => {
                setIsSuccess(false);
                setFormData({ ...formData, message: "" });
              }}
            >
              Submit Another Message
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field (hidden from humans, catches bots) */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="honeypot"
              tabIndex={-1}
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
            />
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-glass-sm bg-red-500/15 border border-red-500/30 text-xs text-red-300">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-bone/80 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                required
                placeholder="Stewart Sterling"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-glass-sm bg-white/5 border border-white/15 text-bone text-sm placeholder:text-white/30 focus:border-copper focus:bg-white/10 transition-colors outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-bone/80 mb-2">
                Work Email *
              </label>
              <input
                type="email"
                required
                placeholder="stewart@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-glass-sm bg-white/5 border border-white/15 text-bone text-sm placeholder:text-white/30 focus:border-copper focus:bg-white/10 transition-colors outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-bone/80 mb-2">
                Company / Organization
              </label>
              <input
                type="text"
                placeholder="Acme Technologies Inc."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 rounded-glass-sm bg-white/5 border border-white/15 text-bone text-sm placeholder:text-white/30 focus:border-copper focus:bg-white/10 transition-colors outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-bone/80 mb-2">
                Service Offering
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full px-4 py-3 rounded-glass-sm bg-ink border border-white/15 text-bone text-sm focus:border-copper transition-colors outline-none"
              >
                <option value="SaaS MVP & Web App">SaaS MVP &amp; Full-Stack Web App</option>
                <option value="High-Conversion Landing Page">High-Conversion Landing Page</option>
                <option value="Internal Dashboard & Command Center">Internal Dashboard &amp; Tooling</option>
                <option value="Headless E-Commerce">Headless E-Commerce Flagship</option>
                <option value="Speed Audit & Redesign">Speed Audit &amp; Performance Redesign</option>
                <option value="Monthly Evolution Retainer">Monthly Evolution Retainer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-bone/80 mb-2">
                Estimated Budget
              </label>
              <select
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                className="w-full px-4 py-3 rounded-glass-sm bg-ink border border-white/15 text-bone text-sm focus:border-copper transition-colors outline-none"
              >
                <option value="$2,000 – $5,000 (₹1.5L – ₹4L)">$2,000 – $5,000 (₹1.5L – ₹4L)</option>
                <option value="$5,000 – $10,000 (₹4L – ₹8L)">$5,000 – $10,000 (₹4L – ₹8L)</option>
                <option value="$10,000+ (₹8L+)">$10,000+ (₹8L+)</option>
                <option value="Monthly Retainer Tier">Monthly Retainer Tier</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-bone/80 mb-2">
                Desired Launch
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full px-4 py-3 rounded-glass-sm bg-ink border border-white/15 text-bone text-sm focus:border-copper transition-colors outline-none"
              >
                <option value="Immediate (Next 2 Weeks)">Immediate (Next 2 Weeks)</option>
                <option value="3–6 Weeks">Standard (3–6 Weeks)</option>
                <option value="Flexible / Q3 Planning">Flexible / Q3 Planning</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-bone/80 mb-2">
              Project Goals &amp; Context *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe what your product aims to achieve, who your customers are, and any specific technical constraints..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-glass-sm bg-white/5 border border-white/15 text-bone text-sm placeholder:text-white/30 focus:border-copper focus:bg-white/10 transition-colors outline-none"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full"
              rightIcon={<ArrowRight className="size-4" />}
            >
              Send Project Inquiry
            </Button>
          </div>
        </form>
      )}
    </GlassCard>
  );
}

export default function ContactPage() {
  return (
    <div className="relative min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <BackgroundScene intensity="normal" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-mono text-copper uppercase tracking-widest">
            START A CONVERSATION
          </span>
          <h1 className="mt-4 text-4xl sm:text-6xl font-heading font-semibold text-bone tracking-tight leading-[1.1]">
            Let&apos;s Decode Your <br />
            <span className="text-slate-dark">Next Digital Product.</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-dark leading-relaxed">
            Tell us about your product goals, timeline, and constraints. We review every submission within 24 hours and provide an initial architectural assessment and scope outline.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Contact Form inside Suspense boundary */}
          <div className="lg:col-span-7">
            <Suspense
              fallback={
                <GlassCard tone="dark" className="p-8 sm:p-10 border border-white/15 text-center text-slate-dark font-mono text-xs">
                  Loading form...
                </GlassCard>
              }
            >
              <ContactFormContent />
            </Suspense>
          </div>

          {/* Right: Direct Information & Fast Track */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard tone="dark" className="p-8 border border-white/15 space-y-6">
              <h3 className="text-xl font-heading font-semibold text-bone">
                Direct Communication
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="size-4 text-copper shrink-0 mt-1" />
                  <div>
                    <span className="text-slate-dark block">Direct Engineering Email</span>
                    <a
                      href="mailto:contact@cipherstudios.dev"
                      className="text-bone hover:text-copper transition-colors font-mono"
                    >
                      contact@cipherstudios.dev
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="size-4 text-copper shrink-0 mt-1" />
                  <div>
                    <span className="text-slate-dark block">Operating Hours</span>
                    <span className="text-bone">10:00 AM – 8:00 PM IST (Monday – Saturday)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="size-4 text-copper shrink-0 mt-1" />
                  <div>
                    <span className="text-slate-dark block">Studio Base</span>
                    <span className="text-bone">Kolkata, West Bengal, India</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-dark block mb-2">
                  Prefer Instant Chat?
                </span>
                <a
                  href="https://wa.me/919876543210?text=Hi%20Aniket%2C%20I%20would%20like%20to%20discuss%20a%20CIPHER%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono text-copper hover:underline"
                >
                  <MessageSquare className="size-3.5" />
                  <span>Open WhatsApp Direct Chat &rarr;</span>
                </a>
              </div>
            </GlassCard>

            <GlassCard tone="accent" className="p-8 border border-copper/40 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-copper" />
                <h4 className="font-heading font-semibold text-bone text-base">
                  What Happens Next?
                </h4>
              </div>
              <ol className="space-y-2.5 text-xs text-bone/85 leading-relaxed list-decimal list-inside">
                <li>We review your submission against technical feasibility.</li>
                <li>We reply within 24h with initial thoughts and questions.</li>
                <li>We schedule a 30-minute discovery video call.</li>
                <li>You receive a fixed-scope proposal with milestones.</li>
              </ol>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
