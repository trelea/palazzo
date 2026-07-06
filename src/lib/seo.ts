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
 * Canonical + hreflang alternates for one locale-agnostic path. Relative URLs
 * — resolved against `metadataBase` (set in the locale layout).
 */
export function languageAlternates(locale: string, path: string): Metadata['alternates'] {
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, localePath(l, path)])),
      'x-default': localePath(routing.defaultLocale, path),
    },
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
}: {
  locale: string
  /** Locale-agnostic path, e.g. `/contacts`. */
  path: string
  title: string
  description: string
  /** Override the default brand OG image (e.g. a news cover). */
  ogImage?: string
}): Metadata {
  const ogTitle = `${title} — ${SITE_NAME}`
  const images = ogImage ? [ogImage] : [OG_IMAGE]
  return {
    title,
    description,
    alternates: languageAlternates(locale, path),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: ogTitle,
      description,
      url: localePath(locale, path),
      locale: OG_LOCALE[locale],
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: ogImage ? [ogImage] : [OG_IMAGE.url],
    },
  }
}
