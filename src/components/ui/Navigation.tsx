'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-bg/85 backdrop-blur-md border-b border-line shadow-sm'
          : 'bg-gradient-to-b from-bg/90 to-transparent'
      )}
    >
      <div className="max-w-content mx-auto px-6 md:px-8">
        <nav className="flex items-center justify-between h-[68px] md:h-[72px]" aria-label="Main Navigation">
          <Link
            href="/"
            className="flex items-center gap-3 font-serif text-[1.18rem] tracking-tight text-ink hover:text-accent transition-colors"
          >
            {/* Elegant Moon Crescent icon */}
            <span
              className="relative block w-5 h-5 rounded-full bg-ink overflow-hidden transition-transform duration-300 hover:rotate-12"
              aria-hidden="true"
            >
              <span className="absolute inset-0 rounded-full bg-bg -translate-x-[36%]" />
            </span>
            <span className="font-light tracking-[-0.01em]">Moon Sanctum Labs</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 text-[0.93rem]">
            <Link
              href="/"
              className={cn(
                'relative py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper rounded-sm',
                pathname === '/'
                  ? 'text-ink font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent-copper after:rounded-full after:shadow-[0_0_8px_rgba(224,164,92,0.6)]'
                  : 'text-mute hover:text-ink'
              )}
              aria-current={pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={cn(
                'relative py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper rounded-sm',
                pathname === '/services' || pathname.startsWith('/services/')
                  ? 'text-ink font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent-copper after:rounded-full after:shadow-[0_0_8px_rgba(224,164,92,0.6)]'
                  : 'text-mute hover:text-ink'
              )}
              aria-current={pathname === '/services' || pathname.startsWith('/services/') ? 'page' : undefined}
            >
              Services
            </Link>
            <Link
              href="/#work"
              className="text-mute hover:text-ink transition-colors duration-200 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper rounded-sm"
            >
              Selected Builds
            </Link>
            <Link
              href="/#process"
              className="text-mute hover:text-ink transition-colors duration-200 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper rounded-sm"
            >
              Process
            </Link>
            <Link
              href="/#principles"
              className="text-mute hover:text-ink transition-colors duration-200 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper rounded-sm"
            >
              Principles
            </Link>
            <div className="flex items-center gap-3">
              <Button href="/contact" size="sm" variant="primary">
                Start a project
              </Button>
              <Button
                href="/website-review?utm_source=msl-site&utm_medium=internal&utm_campaign=header-button"
                size="sm"
                variant="secondary"
              >
                Free website review
              </Button>
            </div>
          </div>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="md:hidden p-2 text-ink hover:text-accent rounded-lg border border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden border-b border-line bg-bg/95 backdrop-blur-xl px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col space-y-3 text-[1.05rem]">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'px-3 py-2 rounded-lg transition-colors flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper',
                pathname === '/'
                  ? 'text-ink font-semibold bg-white/5 border-l-2 border-accent-copper'
                  : 'text-mute hover:text-ink'
              )}
              aria-current={pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'px-3 py-2 rounded-lg transition-colors flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper',
                pathname === '/services' || pathname.startsWith('/services/')
                  ? 'text-ink font-semibold bg-white/5 border-l-2 border-accent-copper'
                  : 'text-mute hover:text-ink'
              )}
              aria-current={pathname === '/services' || pathname.startsWith('/services/') ? 'page' : undefined}
            >
              Services
            </Link>
            <Link
              href="/#work"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-mute hover:text-ink rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper"
            >
              Selected Builds
            </Link>
            <Link
              href="/#process"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-mute hover:text-ink rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper"
            >
              Process
            </Link>
            <Link
              href="/#principles"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-mute hover:text-ink rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper"
            >
              Principles
            </Link>
            <div className="pt-2 flex flex-col gap-2">
              <Button href="/contact" variant="primary" className="w-full" onClick={() => setMobileOpen(false)}>
                Start a project
              </Button>
              <Button
                href="/website-review?utm_source=msl-site&utm_medium=internal&utm_campaign=header-button"
                variant="secondary"
                className="w-full"
                onClick={() => setMobileOpen(false)}
              >
                Free website review
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
