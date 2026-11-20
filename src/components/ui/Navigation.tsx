'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
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

  // Section Tracking via IntersectionObserver on homepage
  useEffect(() => {
    if (pathname === '/services' || pathname.startsWith('/services/')) {
      setActiveSection('services');
      return;
    }
    if (pathname === '/contact') {
      setActiveSection('contact');
      return;
    }
    if (pathname === '/website-review') {
      setActiveSection('review');
      return;
    }

    if (pathname !== '/') return;

    // Set initial section from hash if present
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (['work', 'studio', 'process', 'principles', 'services'].includes(hash)) {
        setActiveSection(hash);
      }
    }

    const sectionIds = ['hero', 'work', 'services', 'studio', 'process', 'principles'];
    let ticking = false;

    const updateActiveSection = () => {
      // If user has scrolled near the bottom of the page, activate the final section
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        setActiveSection('principles');
        ticking = false;
        return;
      }

      // Responsive focal threshold: section is active when its top enters within upper 40% of viewport
      const threshold = Math.min(window.innerHeight * 0.45, 360);
      let current = 'home';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold) {
            current = id === 'hero' ? 'home' : id;
          }
        }
      }
      setActiveSection(current);
      ticking = false;
    };

    const handleScrollSpy = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    updateActiveSection();

    const handleHashChange = () => {
      const h = window.location.hash.replace('#', '');
      if (h) {
        setActiveSection(h === 'hero' ? 'home' : h);
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('scroll', handleScrollSpy);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [pathname]);

  const handleNavClick = useCallback(
    (targetSection: string) => {
      setActiveSection(targetSection);
      setMobileOpen(false);
    },
    []
  );

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
            <Link
              href="/"
              onClick={() => handleNavClick('home')}
              className={cn(
                'relative py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper rounded-sm shrink-0 whitespace-nowrap',
                activeSection === 'home' && pathname === '/'
                  ? 'text-ink font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent-copper after:rounded-full after:shadow-[0_0_8px_rgba(224,164,92,0.6)]'
                  : 'text-mute hover:text-ink'
              )}
              aria-current={activeSection === 'home' && pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            <Link
              href="/#work"
              onClick={() => handleNavClick('work')}
              className={cn(
                'relative py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper rounded-sm shrink-0 whitespace-nowrap',
                activeSection === 'work'
                  ? 'text-ink font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent-copper after:rounded-full after:shadow-[0_0_8px_rgba(224,164,92,0.6)]'
                  : 'text-mute hover:text-ink'
              )}
              aria-current={activeSection === 'work' ? 'page' : undefined}
            >
              Selected Builds
            </Link>
            <Link
              href="/services"
              onClick={() => handleNavClick('services')}
              className={cn(
                'relative py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper rounded-sm shrink-0 whitespace-nowrap',
                activeSection === 'services'
                  ? 'text-ink font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent-copper after:rounded-full after:shadow-[0_0_8px_rgba(224,164,92,0.6)]'
                  : 'text-mute hover:text-ink'
              )}
              aria-current={activeSection === 'services' ? 'page' : undefined}
            >
              Services
            </Link>
            <Link
              href="/#studio"
              onClick={() => handleNavClick('studio')}
              className={cn(
                'relative py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper rounded-sm shrink-0 whitespace-nowrap',
                activeSection === 'studio'
                  ? 'text-ink font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent-copper after:rounded-full after:shadow-[0_0_8px_rgba(224,164,92,0.6)]'
                  : 'text-mute hover:text-ink'
              )}
              aria-current={activeSection === 'studio' ? 'page' : undefined}
            >
              Studio
            </Link>
            <Link
              href="/#process"
              onClick={() => handleNavClick('process')}
              className={cn(
                'relative py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper rounded-sm shrink-0 whitespace-nowrap',
                activeSection === 'process'
                  ? 'text-ink font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent-copper after:rounded-full after:shadow-[0_0_8px_rgba(224,164,92,0.6)]'
                  : 'text-mute hover:text-ink'
              )}
              aria-current={activeSection === 'process' ? 'page' : undefined}
            >
              Process
            </Link>
            <Link
              href="/#principles"
              onClick={() => handleNavClick('principles')}
              className={cn(
                'relative py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper rounded-sm shrink-0 whitespace-nowrap',
                activeSection === 'principles'
                  ? 'text-ink font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent-copper after:rounded-full after:shadow-[0_0_8px_rgba(224,164,92,0.6)]'
                  : 'text-mute hover:text-ink'
              )}
              aria-current={activeSection === 'principles' ? 'page' : undefined}
            >
              Principles
            </Link>
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
            <Link
              href="/"
              onClick={() => handleNavClick('home')}
              className={cn(
                'px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper',
                activeSection === 'home' && pathname === '/'
                  ? 'text-ink font-semibold bg-white/5 border-l-2 border-accent-copper'
                  : 'text-mute hover:text-ink'
              )}
              aria-current={activeSection === 'home' && pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            <Link
              href="/#work"
              onClick={() => handleNavClick('work')}
              className={cn(
                'px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper',
                activeSection === 'work'
                  ? 'text-ink font-semibold bg-white/5 border-l-2 border-accent-copper'
                  : 'text-mute hover:text-ink'
              )}
              aria-current={activeSection === 'work' ? 'page' : undefined}
            >
              Selected Builds
            </Link>
            <Link
              href="/services"
              onClick={() => handleNavClick('services')}
              className={cn(
                'px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper',
                activeSection === 'services'
                  ? 'text-ink font-semibold bg-white/5 border-l-2 border-accent-copper'
                  : 'text-mute hover:text-ink'
              )}
              aria-current={activeSection === 'services' ? 'page' : undefined}
            >
              Services
            </Link>
            <Link
              href="/#studio"
              onClick={() => handleNavClick('studio')}
              className={cn(
                'px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper',
                activeSection === 'studio'
                  ? 'text-ink font-semibold bg-white/5 border-l-2 border-accent-copper'
                  : 'text-mute hover:text-ink'
              )}
              aria-current={activeSection === 'studio' ? 'page' : undefined}
            >
              Studio
            </Link>
            <Link
              href="/#process"
              onClick={() => handleNavClick('process')}
              className={cn(
                'px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper',
                activeSection === 'process'
                  ? 'text-ink font-semibold bg-white/5 border-l-2 border-accent-copper'
                  : 'text-mute hover:text-ink'
              )}
              aria-current={activeSection === 'process' ? 'page' : undefined}
            >
              Process
            </Link>
            <Link
              href="/#principles"
              onClick={() => handleNavClick('principles')}
              className={cn(
                'px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-copper',
                activeSection === 'principles'
                  ? 'text-ink font-semibold bg-white/5 border-l-2 border-accent-copper'
                  : 'text-mute hover:text-ink'
              )}
              aria-current={activeSection === 'principles' ? 'page' : undefined}
            >
              Principles
            </Link>
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
