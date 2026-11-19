import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/metadata';

/**
 * Next.js Dynamic robots.txt
 * Authorizes crawling across all pages so search engines can access required Next.js assets
 * and discover noindex directives on utility pages.
 * Strictly disallows internal API routes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
