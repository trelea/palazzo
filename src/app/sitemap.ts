import type { MetadataRoute } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { routing } from '@/i18n/routing'
import { SITE_URL, hreflangLanguages, localePath } from '@/lib/seo'

/** Locale-agnostic static frontend routes. */
const STATIC_PATHS = ['/', '/about-us', '/phytoaestetica', '/phytotherapy', '/news', '/contacts']

/** One sitemap entry per locale URL, each carrying the full hreflang set. */
function entriesFor(path: string, lastModified?: Date): MetadataRoute.Sitemap {
  const languages = hreflangLanguages(path, SITE_URL)
  return routing.locales.map((locale) => ({
    url: `${SITE_URL}${localePath(locale, path)}`,
    lastModified,
    alternates: { languages },
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  const news = await payload.find({
    collection: 'news',
    depth: 0,
    limit: 1000,
    select: { updatedAt: true },
  })

  return [
    ...STATIC_PATHS.flatMap((path) => entriesFor(path)),
    ...news.docs.flatMap((doc) => entriesFor(`/news/${doc.id}`, new Date(doc.updatedAt))),
  ]
}
