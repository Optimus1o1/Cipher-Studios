"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Logo } from "@/components/brand/Logo";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { Button } from "@/components/ui/Button";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { FallbackGrid } from "@/components/three/FallbackGrid";
import { heroProgressRef, scrollProgressRef, useScrollBridge } from "@/hooks/useScrollBridge";
import { ArrowRight, Code2, Lock, Calendar } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroSection() {
  const tier = useDeviceTier();
  const sectionRef = useRef<HTMLElement>(null);
  const pinnedWrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayMarkRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const headlineCardRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  const setNavDocked = useScrollBridge((state) => state.setNavDocked);

  // Measure dynamic destination coordinates from GlassNav's real rendered logo
  const calculateNavDockTarget = () => {
    const navLogoEl = document.getElementById("nav-brand-logo");
    const overlayEl = overlayRef.current;
    if (!navLogoEl || !overlayEl) {
      return { deltaX: 0, deltaY: 0, targetScale: 0.36 };
    }

    const navRect = navLogoEl.getBoundingClientRect();
    const overlayRect = overlayEl.getBoundingClientRect();

    const navCenterX = navRect.left + navRect.width / 2;
    const navCenterY = navRect.top + navRect.height / 2;

    const baseCenterX = window.innerWidth / 2;
    const baseCenterY = window.innerHeight / 2;

    const deltaX = navCenterX - baseCenterX;
    const deltaY = navCenterY - baseCenterY;

    // Dynamic scale based on the real rendered width ratio between nav logo and overlay lockup
    const targetScale = navRect.width / (overlayRect.width || 360);

    return { deltaX, deltaY, targetScale };
  };

  useEffect(() => {
    if (tier === "off") {
      setNavDocked(true);
      return;
    }

    if (
      !sectionRef.current ||
      !pinnedWrapperRef.current ||
      !overlayRef.current ||
      !overlayMarkRef.current ||
      !wordmarkRef.current ||
      !headlineCardRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(overlayRef.current, {
        opacity: 1,
        scale: 1,
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        transformOrigin: "center center",
      });
      gsap.set(overlayMarkRef.current, { opacity: 0 });
      gsap.set(wordmarkRef.current, { opacity: 0, scale: 0.9 });
      gsap.set(headlineCardRef.current, { opacity: 0, y: 35 });

      // Unified pinned timeline scrubbed across 160% viewport height
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * 1.6,
          pin: pinnedWrapperRef.current,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            heroProgressRef.current = p;
            scrollProgressRef.current = p;

            if (scrollCueRef.current) {
              scrollCueRef.current.style.opacity = p > 0.06 ? "0" : "1";
            }

            if (headlineCardRef.current) {
              headlineCardRef.current.style.pointerEvents = p >= 0.72 ? "auto" : "none";
            }
          },
          onLeave: () => {
            heroProgressRef.current = 1.0;
            scrollProgressRef.current = 1.0;
            setNavDocked(true);
            if (overlayRef.current) {
              overlayRef.current.style.opacity = "0";
            }
          },
          onEnterBack: () => {
            setNavDocked(false);
            if (overlayRef.current) {
              overlayRef.current.style.opacity = "1";
            }
          },
        },
      });

      // 1. Scroll cue fades out quickly (0 -> 0.08)
      if (scrollCueRef.current) {
        tl.to(scrollCueRef.current, { opacity: 0, duration: 0.08, ease: "power1.out" }, 0);
      }

      // 2. Wordmark fades and scales in beside 3D mark (0 -> 0.30)
      tl.fromTo(
        wordmarkRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1.0,
          ease: "power2.out",
          duration: 0.30,
        },
        0
      );

      // 3. Mark crossfade: DOM mark fades in as 3D mark arrives at position (0.26 -> 0.32)
      tl.fromTo(
        overlayMarkRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.06,
          ease: "power1.inOut",
        },
        0.26
      );

      // 4. Complete Lockup translates & shrinks to navbar target (0.30 -> 0.72)
      tl.to(
        overlayRef.current,
        {
          x: () => calculateNavDockTarget().deltaX,
          y: () => calculateNavDockTarget().deltaY,
          scale: () => calculateNavDockTarget().targetScale,
          ease: "power2.inOut",
          duration: 0.42,
        },
        0.30
      );

      // 6. Crossfade GlassNav's glass background in underneath (0.38 -> 0.72)
      const navBackdrop = document.getElementById("nav-glass-backdrop");
      if (navBackdrop) {
        tl.fromTo(
          navBackdrop,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "power1.inOut",
            duration: 0.34,
          },
          0.38
        );
      }

      // 7. Hero Headline Card flows into view (0.48 -> 0.74)
      tl.fromTo(
        headlineCardRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.26,
        },
        0.48
      );

      // 8. Dock handoff (0.72 -> 0.75): real nav logo reveals, overlay hides
      const navLogo = document.getElementById("nav-brand-logo");
      if (navLogo) {
        tl.fromTo(
          navLogo,
          { opacity: 0 },
          { opacity: 1, duration: 0.03, ease: "none" },
          0.72
        );
      }
      tl.fromTo(
        overlayRef.current,
        { opacity: 1 },
        { opacity: 0, duration: 0.03, ease: "none" },
        0.72
      );
    }, sectionRef);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, [tier, setNavDocked]);

  // Reduced motion / Off tier: render static immediately without pin or extra scroll
  if (tier === "off") {
    return (
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <FallbackGrid tier="off" />
        <div className="relative z-10 max-w-4xl mx-auto w-full">
          <HeroHeadlineCard />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative w-full">
      {/* Brand Lockup Overlay: fixed full viewport, outside pinnedWrapper so it's always in pure viewport coordinates */}
      <div
        ref={overlayRef}
        id="hero-wordmark-overlay"
        className="fixed left-1/2 top-1/2 pointer-events-none z-40 select-none flex items-center justify-center will-change-transform"
        style={{
          transform: "translate(-50%, -50%)",
          gap: 140 * 0.38,
        }}
        aria-hidden="true"
      >
        {/* 3x3 Mark in the lockup */}
        <div
          ref={overlayMarkRef}
          id="hero-overlay-mark"
          className="shrink-0 flex items-center opacity-0"
        >
          <Logo size={140} tone="dark" withWordmark={false} />
        </div>
        {/* Wordmark "CIPHER" */}
        <div ref={wordmarkRef} className="shrink-0 flex items-center opacity-0">
          <span
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 600,
              fontSize: 140 * 0.75,
              lineHeight: 1,
              letterSpacing: "0.1em",
            }}
            className="text-bone tracking-widest select-none leading-none"
          >
            CIPHER
          </span>
        </div>
      </div>

      {/* 1. Pinned Cinematic Hero Stage */}
      <div
        ref={pinnedWrapperRef}
        className="h-screen w-full relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        {/* Subtle Scroll Cue Indicator on page load (visible only at p < 0.08) */}
        <div
          ref={scrollCueRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs font-mono text-slate-dark transition-opacity duration-300 pointer-events-none select-none z-20"
        >
          <span className="tracking-wider uppercase text-[10px] text-bone/60">Scroll to Explore</span>
          <span className="text-copper animate-bounce text-sm">&darr;</span>
        </div>

        {/* Hero Headline Card: flows into view during p: 0.52 -> 0.82 */}
        <div
          ref={headlineCardRef}
          id="hero-headline-card-container"
          className="relative z-20 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 opacity-0 pointer-events-none"
          style={{ transform: "translateY(35px)" }}
        >
          <HeroHeadlineCard />
        </div>
      </div>
    </section>
  );
}

// Extracted Headline Card Component
function HeroHeadlineCard() {
  return (
    <GlassCard
      tone="dark"
      tilt={true}
      maxTilt={2.5}
      className="p-6 sm:p-8 md:p-10 border border-white/15 shadow-glass-hover bg-ink/85 backdrop-blur-md"
    >
      {/* Top pill with animated Logo mark and Agency Slogan */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-copper">
          <Logo size={16} tone="dark" withWordmark={false} />
          <span className="tracking-wide text-bone/90 font-medium">CIPHER</span>
          <span className="text-copper font-bold">•</span>
          <span className="text-bone/80 tracking-wider">Decode. Build. Evolve.</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-copper/10 border border-copper/20 text-[11px] font-mono text-copper">
          <span className="size-1.5 rounded-full bg-copper animate-ping inline-block" />
          <span>Interactive 3D Matrix Online</span>
        </div>
      </div>

      {/* H1 Heading */}
      <h1 className="mt-5 sm:mt-6 text-2xl sm:text-4xl md:text-5xl font-heading font-medium tracking-tight text-bone leading-[1.12] break-words">
        We <span className="text-copper font-semibold">decode</span> what your practice actually needs,{" "}
        <span className="text-bone font-semibold">build</span> it properly, and keep it{" "}
        <span className="text-copper font-semibold">evolving</span>.
      </h1>

      {/* Subheading */}
      <p className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-base text-slate-dark leading-relaxed max-w-xl">
        Bespoke patient booking engines, private operational backends, and high-conversion web platforms for boutique clinics. Security-reviewed by default. Fast on every device. Zero template bloat.
      </p>

      {/* Action CTAs */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <Link href="#audit-tool" className="w-full sm:w-auto">
          <Button size="md" variant="primary" className="w-full sm:w-auto justify-center" rightIcon={<ArrowRight className="size-4" />}>
            Audit Your Current Website
          </Button>
        </Link>

        <Link href="/work" className="w-full sm:w-auto">
          <Button size="md" variant="glass" className="w-full sm:w-auto justify-center">
            Explore Case Studies
          </Button>
        </Link>
      </div>

      {/* Value Badges Floor */}
      <div className="mt-6 sm:mt-8 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-[11px] font-mono text-slate-dark">
        <div className="flex items-center gap-2">
          <Code2 className="size-3.5 text-copper shrink-0" />
          <span>Next.js &amp; TypeScript</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="size-3.5 text-copper shrink-0" />
          <span>Strict Security Hygiene</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="size-3.5 text-copper shrink-0" />
          <span>Booking Next Month</span>
        </div>
      </div>
    </GlassCard>
  );
}

export default HeroSection;
