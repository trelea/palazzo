import type { MetadataRoute } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { routing } from '@/i18n/routing'
import { SITE_URL, hreflangLanguages, localePath } from '@/lib/seo'

/** Locale-agnostic static frontend routes. */
const STATIC_PATHS = ['/', '/about-us', '/phytoaestetica', '/phytotherapy', '/news', '/shop', '/contacts']

/** One sitemap entry per locale URL, each carrying the full hreflang set. */
function entriesFor(
  path: string,
  lastModified?: Date,
  hints: { changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency']; priority?: number } = {},
): MetadataRoute.Sitemap {
  const languages = hreflangLanguages(path, SITE_URL)
  return routing.locales.map((locale) => ({
    url: `${SITE_URL}${localePath(locale, path)}`,
    lastModified,
    changeFrequency: hints.changeFrequency,
    priority: hints.priority,
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
  const products = await payload.find({
    collection: 'products',
    depth: 0,
    limit: 1000,
    select: { slug: true, updatedAt: true },
  })

  return [
    ...STATIC_PATHS.flatMap((path) =>
      entriesFor(path, undefined, {
        changeFrequency: 'weekly',
        priority: path === '/' ? 1 : 0.8,
      }),
    ),
    ...news.docs.flatMap((doc) =>
      entriesFor(`/news/${doc.id}`, new Date(doc.updatedAt), {
        changeFrequency: 'monthly',
        priority: 0.6,
      }),
    ),
    ...products.docs.flatMap((doc) =>
      entriesFor(`/shop/${doc.slug}`, new Date(doc.updatedAt), {
        changeFrequency: 'monthly',
        priority: 0.7,
      }),
    ),
  ]
}
