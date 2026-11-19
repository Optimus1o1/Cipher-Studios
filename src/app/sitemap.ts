import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/metadata';

/**
 * Next.js Dynamic XML Sitemap
 * Strictly contains the 10 canonical, public, indexable pages.
 * Internal utilities (/styleguide), thank-you pages, error handlers, and API endpoints are strictly excluded.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const publicRoutes: {
    path: string;
    priority: number;
    changeFrequency: 'weekly' | 'monthly' | 'yearly';
  }[] = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/services', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/services/web-design', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services/web-development', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services/seo', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services/digital-marketing', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services/branding-content', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services/care-growth', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/website-review', priority: 0.9, changeFrequency: 'monthly' },
  ];

  return publicRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
