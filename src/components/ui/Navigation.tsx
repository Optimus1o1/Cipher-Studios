'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Menu, X } from 'lucide-react';

const HOMEPAGE_SECTIONS = ['hero', 'work', 'services', 'studio', 'process', 'principles'] as const;
type SectionKey = 'home' | 'work' | 'services' | 'studio' | 'process' | 'principles' | 'contact' | 'review';

interface NavItem {
  key: SectionKey;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'work', label: 'Selected Builds', href: '/#work' },
  { key: 'services', label: 'Services', href: '/services' },
  { key: 'studio', label: 'Studio', href: '/#studio' },
  { key: 'process', label: 'Process', href: '/#process' },
  { key: 'principles', label: 'Principles', href: '/#principles' },
];

const SCROLL_CANCEL_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  ' ',
]);

function resolveSectionFromHash(hash: string): SectionKey | null {
  const clean = hash.replace(/^#/, '').toLowerCase();
  if (clean === 'hero') return 'home';
  if (
    clean === 'work' ||
    clean === 'services' ||
    clean === 'studio' ||
    clean === 'process' ||
    clean === 'principles'
  ) {
    return clean;
  }
  return null;
}

function getScrollGeometry() {
  const headerOffset = window.innerWidth >= 768 ? 80 : 72;
  const focalLine = Math.max(headerOffset + 48, Math.min(window.innerHeight * 0.4, 340));
  const isAtBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24;
  return { headerOffset, focalLine, isAtBottom };
}

function computeSectionAtViewport(): SectionKey {
  if (window.scrollY <= 20) {
    return 'home';
  }
  const { focalLine, isAtBottom } = getScrollGeometry();
  if (isAtBottom) {
    return 'principles';
  }
  let current: SectionKey = 'home';
  for (const id of HOMEPAGE_SECTIONS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= focalLine) {
      current = id === 'hero' ? 'home' : id;
    }
  }
  return current;
}

function hasArrivedAtSection(target: SectionKey): boolean {
  if (target === 'home') {
    return window.scrollY <= 24;
  }
  const el = document.getElementById(target);
  if (!el) return true;
  const rect = el.getBoundingClientRect();
  const { headerOffset, focalLine, isAtBottom } = getScrollGeometry();
  if (isAtBottom && rect.top < window.innerHeight && rect.bottom > headerOffset) {
    return true;
  }
  return rect.top >= -40 && rect.top <= focalLine;
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>('home');
  const navTargetRef = useRef<SectionKey | null>(null);
  const pathname = usePathname();

  // Scroll depth tracking for header background styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Body scroll locking when mobile navigation drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Unified section tracking across click navigation, smooth scroll, manual scroll, hashchange, and popstate
  useEffect(() => {
    if (pathname === '/services' || pathname.startsWith('/services/')) {
      navTargetRef.current = null;
      setActiveSection('services');
      return;
    }
    if (pathname === '/contact') {
      navTargetRef.current = null;
      setActiveSection('contact');
      return;
    }
    if (pathname.startsWith('/website-review')) {
      navTargetRef.current = null;
      setActiveSection('review');
      return;
    }

    if (pathname !== '/') return;

    // Preserve target from hash during initial route transition / direct hash navigation
    const initialHashTarget =
      typeof window !== 'undefined' ? resolveSectionFromHash(window.location.hash) : null;
    if (initialHashTarget) {
      navTargetRef.current = initialHashTarget;
      setActiveSection(initialHashTarget);
    } else {
      navTargetRef.current = null;
      setActiveSection(computeSectionAtViewport());
    }

    let ticking = false;

    const updateActiveSection = () => {
      ticking = false;
      const pendingTarget = navTargetRef.current;
      if (pendingTarget) {
        if (hasArrivedAtSection(pendingTarget)) {
          navTargetRef.current = null;
          setActiveSection(pendingTarget);
        }
        return;
      }
      setActiveSection(computeSectionAtViewport());
    };

    const handleScrollSpy = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    const handleScrollEnd = () => {
      const pendingTarget = navTargetRef.current;
      if (pendingTarget) {
        navTargetRef.current = null;
        if (hasArrivedAtSection(pendingTarget)) {
          setActiveSection(pendingTarget);
          return;
        }
      }
      setActiveSection(computeSectionAtViewport());
    };

    const cancelProgrammaticLock = () => {
      if (navTargetRef.current) {
        navTargetRef.current = null;
        setActiveSection(computeSectionAtViewport());
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (SCROLL_CANCEL_KEYS.has(e.key)) {
        cancelProgrammaticLock();
      }
    };

    const syncFromLocation = (alignScroll: boolean) => {
      const nextTarget = resolveSectionFromHash(window.location.hash);
      if (nextTarget) {
        navTargetRef.current = nextTarget;
        setActiveSection(nextTarget);
        if (alignScroll) {
          const el = document.getElementById(nextTarget);
          if (el && !hasArrivedAtSection(nextTarget)) {
            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
          }
        }
      } else {
        navTargetRef.current = null;
        setActiveSection(computeSectionAtViewport());
      }
    };

    const handleHashChange = () => {
      setMobileOpen(false);
      syncFromLocation(false);
    };

    const handlePopState = () => {
      setMobileOpen(false);
      window.requestAnimationFrame(() => {
        if (window.location.pathname === '/') {
          syncFromLocation(true);
        }
      });
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    window.addEventListener('resize', handleScrollSpy, { passive: true });
    window.addEventListener('scrollend', handleScrollEnd, { passive: true });
    window.addEventListener('wheel', cancelProgrammaticLock, { passive: true });
    window.addEventListener('touchstart', cancelProgrammaticLock, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: true });
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('scroll', handleScrollSpy);
      window.removeEventListener('resize', handleScrollSpy);
      window.removeEventListener('scrollend', handleScrollEnd);
      window.removeEventListener('wheel', cancelProgrammaticLock);
      window.removeEventListener('touchstart', cancelProgrammaticLock);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname]);

  const handleNavClick = useCallback(
    (targetSection: SectionKey) => {
      setMobileOpen(false);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }

      if (targetSection === 'services') {
        navTargetRef.current = null;
        setActiveSection('services');
        return;
      }

      navTargetRef.current = targetSection;
      setActiveSection(targetSection);

      if (pathname === '/' && typeof window !== 'undefined') {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
        if (targetSection === 'home') {
          if (window.scrollY > 0 && window.location.hash === '') {
            window.scrollTo({ top: 0, behavior });
          }
        } else if (window.location.hash === `#${targetSection}`) {
          const el = document.getElementById(targetSection);
          if (el) {
            el.scrollIntoView({ behavior });
          }
        }
      }
    },
    [pathname]
  );

  const isNavItemActive = (key: SectionKey) =>
    activeSection === key && (key !== 'home' || pathname === '/');

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-bg/85 backdrop-blur-md border-b border-line shadow-sm'
          : 'bg-gradient-to-b from-bg/90 to-transparent'
      )}
    >
      <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-6 md:px-8">
        <nav className="flex items-center justify-between h-[68px] md:h-[72px]" aria-label="Main Navigation">
          <Link
            href="/"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 font-serif text-[1.18rem] tracking-tight text-ink hover:text-accent transition-colors shrink-0 whitespace-nowrap"
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
          <div className="hidden xl:flex items-center gap-6 2xl:gap-8 text-[0.93rem] shrink-0">
            {NAV_ITEMS.map((item) => {
              const active = isNavItemActive(item.key);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => handleNavClick(item.key)}
                  className={cn(
                    'relative py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper rounded-sm shrink-0 whitespace-nowrap',
                    active
                      ? 'text-ink font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent-copper after:rounded-full after:shadow-[0_0_8px_rgba(224,164,92,0.6)]'
                      : 'text-mute hover:text-ink'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
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
            className="xl:hidden p-2 text-ink hover:text-accent rounded-lg border border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
          className="xl:hidden border-b border-line bg-bg/95 backdrop-blur-xl px-5 sm:px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col space-y-2 text-[1.05rem]">
            {NAV_ITEMS.map((item) => {
              const active = isNavItemActive(item.key);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => handleNavClick(item.key)}
                  className={cn(
                    'px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper',
                    active
                      ? 'text-ink font-semibold bg-white/5 border-l-2 border-accent-copper'
                      : 'text-mute hover:text-ink'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 flex flex-col gap-2.5">
              <Button href="/contact" variant="primary" className="w-full justify-center" onClick={() => setMobileOpen(false)}>
                Start a project
              </Button>
              <Button
                href="/website-review?utm_source=msl-site&utm_medium=internal&utm_campaign=header-button"
                variant="secondary"
                className="w-full justify-center"
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
