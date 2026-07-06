import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo'

/**
 * The CMS admin and API are kept out of the index, with one carve-out:
 * Payload serves media (incl. news OG images) from `/api/media/file/*`, and
 * the longest-match rule lets crawlers keep fetching those.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/media/file/'],
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
