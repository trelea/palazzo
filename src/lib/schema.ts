/**
 * schema.org JSON-LD builders, rendered via `<JsonLd>` from
 * `@/components/json-ld`. The business block lives in the locale layout (every
 * page carries it); news articles add an `Article` block referencing it by id.
 */

import { lexicalExcerpt } from '@/lib/lexical'
import { newsDesc, newsTitle, type AppLocale } from '@/lib/news'
import { OG_IMAGE, SITE_NAME, SITE_URL, localePath } from '@/lib/seo'
import { CONTACT, LOGO_SRC, OPENING_HOURS } from '@/lib/site'
import type { News } from '@/payload-types'

const BUSINESS_ID = `${SITE_URL}/#business`

/** True for real profile URLs, false for the bare-domain placeholders in `CONTACT.social`. */
function isRealSocialUrl(url: string): boolean {
  return new URL(url).pathname.length > 1
}

/**
 * LocalBusiness block for the clinic. `HealthAndBeautyBusiness` (not
 * `MedicalBusiness`) — phyto-aesthetics is wellness/beauty care, and the
 * medical types carry YMYL expectations the site shouldn't claim. Phone and
 * social profiles are still placeholders in `CONTACT` and are omitted until
 * the real values land there.
 */
export function localBusinessJsonLd(locale: string, description: string) {
  const sameAs = Object.values(CONTACT.social).filter(isRealSocialUrl)
  return {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': BUSINESS_ID,
    name: SITE_NAME,
    description,
    url: `${SITE_URL}${localePath(locale, '/')}`,
    image: `${SITE_URL}${OG_IMAGE.url}`,
    logo: `${SITE_URL}${LOGO_SRC}`,
    email: CONTACT.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.address,
      addressLocality: 'Chișinău',
      addressCountry: 'MD',
    },
    openingHoursSpecification: OPENING_HOURS.map((window) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: window.opens,
      closes: window.closes,
    })),
    ...(CONTACT.phone ? { telephone: CONTACT.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }
}

/** NewsArticle block for `/news/[id]`, built from the same doc the page renders. */
export function newsArticleJsonLd(doc: News, locale: AppLocale, coverUrl?: string) {
  const url = `${SITE_URL}${localePath(locale, `/news/${doc.id}`)}`
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: newsTitle(doc, locale),
    description: lexicalExcerpt(newsDesc(doc, locale)),
    datePublished: doc.createdAt,
    dateModified: doc.updatedAt,
    inLanguage: locale,
    mainEntityOfPage: url,
    // Payload media URLs are host-relative (`/api/media/file/…`) — make absolute.
    ...(coverUrl ? { image: [coverUrl.startsWith('http') ? coverUrl : `${SITE_URL}${coverUrl}`] } : {}),
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@id': BUSINESS_ID },
  }
}
