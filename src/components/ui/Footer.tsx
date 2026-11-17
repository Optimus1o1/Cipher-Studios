import React from 'react';
import Link from 'next/link';
import { servicesData } from '@/data/services';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-veil border-t border-line text-mute text-[0.92rem] py-16">
      <div className="max-w-content mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand & Location */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-3 font-serif text-[1.18rem] text-ink hover:text-accent transition-colors"
            >
              <span
                className="relative block w-5 h-5 rounded-full bg-ink overflow-hidden"
                aria-hidden="true"
              >
                <span className="absolute inset-0 rounded-full bg-bg -translate-x-[36%]" />
              </span>
              <span className="font-light">Moon Sanctum Labs</span>
            </Link>
            <p className="text-accent-copper text-xs uppercase tracking-widest font-mono font-medium">
              Decode. Build. Evolve.
            </p>
            <p className="text-mute leading-relaxed">
              Kolkata, India. Working with founders and businesses worldwide.
            </p>
            <p className="pt-1">
              <Link
                href="/contact"
                className="text-ink hover:text-accent transition-colors font-medium"
              >
                Start a project inquiry &rarr;
              </Link>
            </p>
          </div>

          {/* Services Links */}
          <div className="space-y-3">
            <h4 className="text-ink text-[0.88rem] uppercase tracking-wider font-semibold">
              Services
            </h4>
            <ul className="space-y-2">
              {servicesData.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="hover:text-ink transition-colors block py-0.5"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-ink text-[0.88rem] uppercase tracking-wider font-semibold">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="hover:text-ink transition-colors block py-0.5">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/#process" className="hover:text-ink transition-colors block py-0.5">
                  Process
                </Link>
              </li>
              <li>
                <Link href="/#principles" className="hover:text-ink transition-colors block py-0.5">
                  Principles
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-ink transition-colors block py-0.5">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/website-review?utm_source=msl-site&utm_medium=internal&utm_campaign=footer-link"
                  className="text-accent hover:text-ink transition-colors block py-0.5 font-medium"
                >
                  Free Website Review
                </Link>
              </li>
            </ul>
            <div className="pt-4 text-xs text-mute/80 space-y-1">
              <p>&copy; {currentYear} Moon Sanctum Labs. All rights reserved.</p>
              <p>Procedural lunar topology generated with mathematical noise models.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
