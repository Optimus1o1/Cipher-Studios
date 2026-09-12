"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { useScrollBridge } from "@/hooks/useScrollBridge";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { ArrowRight, Menu, X, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#process", label: "Process" },
  { href: "/portal", label: "Client Portal" },
];


export function GlassNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isNavDocked = useScrollBridge((state) => state.isNavDocked);
  const tier = useDeviceTier();

  const isHome = pathname === "/";
  const showLogo = !isHome || isNavDocked || tier === "off" || scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 py-4 sm:py-5",
          scrolled ? "py-3 sm:py-3.5" : ""
        )}
      >
        <div className="relative max-w-7xl mx-auto flex items-center justify-between rounded-full transition-all duration-300 px-4 sm:px-6 py-2.5">
          {/* Crossfading Glass Backdrop */}
          <div
            id="nav-glass-backdrop"
            className={cn(
              "absolute inset-0 rounded-full transition-opacity duration-300 pointer-events-none -z-10",
              "glass-dark bg-ink/85 border border-white/15 shadow-glass backdrop-blur-md",
              scrolled || isNavDocked || !isHome || tier === "off"
                ? "opacity-100"
                : "opacity-0"
            )}
          />

          {/* Logo brand target for docking */}
          <Link
            href="/"
            id="nav-brand-logo"
            className={cn(
              "flex items-center gap-2 transition-opacity duration-200",
              showLogo ? "opacity-100" : "opacity-0"
            )}
            aria-label="CIPHER Agency Home"
          >
            <Logo size={34} tone="dark" withWordmark={true} />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors",
                    isActive
                      ? "text-copper bg-white/5"
                      : "text-slate-dark hover:text-bone hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Contact CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link href="/contact" className="hidden sm:inline-block">
              <Button size="sm" variant="primary" rightIcon={<ArrowRight className="size-3.5" />}>
                Start a Project
              </Button>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden grid min-w-[44px] min-h-[44px] size-11 place-items-center rounded-full bg-white/5 border border-white/10 text-bone hover:bg-white/10 active:scale-95 transition-transform"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-ink/95 backdrop-blur-xl pt-24 px-6 pb-10 flex flex-col justify-between animate-in fade-in duration-200">
          <div className="space-y-4">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-dark pb-2 border-b border-white/10">
              Navigation Menu
            </p>
            <div className="flex flex-col space-y-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-lg font-heading font-medium tracking-wide py-2 transition-colors",
                    pathname === link.href ? "text-copper" : "text-bone"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/styleguide"
                className="text-xs font-mono text-slate-dark py-2 hover:text-copper flex items-center gap-1.5"
              >
                <Terminal className="size-3.5" />
                <span>Design System Styleguide</span>
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <Link href="/contact" className="block w-full">
              <Button size="lg" variant="primary" className="w-full">
                Start a Project
              </Button>
            </Link>
            <p className="text-[11px] font-mono text-center text-slate-dark">
              CIPHER &middot; Kolkata, IST &middot; Decode. Build. Evolve.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
