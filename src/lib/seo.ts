import type { Metadata } from 'next'

import { routing } from '@/i18n/routing'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://palazzoaesthetics.md'
export const SITE_NAME = 'Palazzo Aesthetics'

/** Open Graph locale tags for the supported next-intl locales. */
export const OG_LOCALE: Record<string, string> = { ro: 'ro_RO', en: 'en_US', ru: 'ru_RU' }

/** Default Open Graph/Twitter card image (brand lockup, 1200×630). */
export const OG_IMAGE = { url: '/og.png', width: 1200, height: 630, alt: SITE_NAME }

/** Locale-prefixed path, e.g. `localePath('ro', '/contacts')` → `/ro/contacts`. */
export function localePath(locale: string, path: string): string {
  return `/${locale}${path === '/' ? '' : path}`
}

/**
 * Word-boundary excerpt of at most `max` characters, with an ellipsis when it
 * has to cut — safe for meta descriptions (never splits a word mid-way).
 */
export function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const at = cut.lastIndexOf(' ')
  return `${(at > 0 ? cut.slice(0, at) : cut).trimEnd()}…`
}

/**
 * hreflang map (ro/en/ru + x-default → default locale) for one locale-agnostic
 * path. Shared by the head metadata (relative URLs, resolved against
 * `metadataBase`) and the sitemap (`base = SITE_URL` for absolute URLs).
 */
export function hreflangLanguages(path: string, base = ''): Record<string, string> {
  return {
    ...Object.fromEntries(routing.locales.map((l) => [l, `${base}${localePath(l, path)}`])),
    'x-default': `${base}${localePath(routing.defaultLocale, path)}`,
  }
}

/**
 * Canonical + hreflang alternates for one locale-agnostic path. Relative URLs
 * — resolved against `metadataBase` (set in the locale layout).
 */
export function languageAlternates(locale: string, path: string): Metadata['alternates'] {
  return {
    canonical: localePath(locale, path),
    languages: hreflangLanguages(path),
  }
}

/**
 * Full per-page metadata: templated title (the locale layout appends
 * `— Palazzo Aesthetics`), description, canonical/hreflang and self-contained
 * Open Graph + Twitter cards. Next.js replaces (not deep-merges) the
 * `openGraph` object, so the helper re-states the shared bits from the layout.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  ogImage,
  article,
  fullTitle,
}: {
  locale: string
  /** Locale-agnostic path, e.g. `/contacts`. */
  path: string
  title: string
  description: string
  /** Override the default brand OG image (e.g. a news cover). */
  ogImage?: string
  /** Set for article-style pages so OG reports `article` + publish/modified times. */
  article?: { publishedTime: string; modifiedTime?: string }
  /** `title` already includes the brand (the homepage has no title template). */
  fullTitle?: boolean
}): Metadata {
  const ogTitle = fullTitle ? title : `${title} — ${SITE_NAME}`
  const images = ogImage ? [{ url: ogImage, alt: title }] : [OG_IMAGE]
  const alternateLocale = routing.locales
    .filter((l) => l !== locale)
    .map((l) => OG_LOCALE[l])
  return {
    title,
    description,
    alternates: languageAlternates(locale, path),
    openGraph: {
      type: article ? 'article' : 'website',
      siteName: SITE_NAME,
      title: ogTitle,
      description,
      url: localePath(locale, path),
      locale: OG_LOCALE[locale],
      alternateLocale,
      images,
      ...(article
        ? {
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime ?? article.publishedTime,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: ogImage ? [ogImage] : [OG_IMAGE.url],
    },
  }
}
