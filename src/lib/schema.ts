/**
 * schema.org JSON-LD builders, rendered via `<JsonLd>` from
 * `@/components/json-ld`. The business block lives in the locale layout (every
 * page carries it); news articles add an `Article` block referencing it by id.
 */

import { lexicalExcerpt } from '@/lib/lexical'
import { newsDesc, newsTitle, type AppLocale } from '@/lib/news'
import { productLongDesc, productName, productShortDesc, productTypeLabel } from '@/lib/products'
import { OG_IMAGE, SITE_NAME, SITE_URL, localePath } from '@/lib/seo'
import { AGENCY, CONTACT, LOGO_SRC, OPENING_HOURS } from '@/lib/site'
import type { News, Product } from '@/payload-types'

const BUSINESS_ID = `${SITE_URL}/#business`

/**
 * Shared entity ids for the Devalon attribution. `agencyJsonLd` and
 * `websiteJsonLd` both use them, so the two blocks' entities link by
 * `@id` instead of duplicating.
 */
const AGENCY_ORG_ID = `${AGENCY.url}#organization`
const AGENCY_PERSON_ID = `${AGENCY.url}#person`
const WEBSITE_ID = `${SITE_URL}#website`

/** True for real profile URLs, false for the bare-domain placeholders in `CONTACT.social`. */
function isRealSocialUrl(url: string): boolean {
  return new URL(url).pathname.length > 1
}

/**
 * LocalBusiness block for the clinic. `HealthAndBeautyBusiness` (not
 * `MedicalBusiness`) — phyto-aesthetics is wellness/beauty care, and the
 * medical types carry YMYL expectations the site shouldn't claim. The phone
 * number is still pending in `CONTACT` and is omitted until the real value
 * lands there.
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

/** Product block for `/shop/[slug]`, built from the same doc the page renders. */
export function productJsonLd(doc: Product, locale: AppLocale, imageUrls: string[] = []) {
  const url = `${SITE_URL}${localePath(locale, `/shop/${doc.slug}`)}`
  const absoluteImages = imageUrls
    .filter(Boolean)
    .map((src) => (src.startsWith('http') ? src : `${SITE_URL}${src}`))
  const category = productTypeLabel(doc.product_type, locale)
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName(doc, locale),
    description:
      productShortDesc(doc, locale) || lexicalExcerpt(productLongDesc(doc, locale)),
    sku: doc.slug,
    ...(category ? { category } : {}),
    url,
    mainEntityOfPage: url,
    inLanguage: locale,
    ...(absoluteImages.length ? { image: absoluteImages } : {}),
    brand: { '@type': 'Brand', name: SITE_NAME },
  }
}

/**
 * BreadcrumbList block for a page. `trail` paths are locale-agnostic (same
 * form `pageMetadata`/the sitemap use); URLs are made absolute here.
 */
export function breadcrumbJsonLd(locale: string, trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: step.name,
      item: `${SITE_URL}${localePath(locale, step.path)}`,
    })),
  }
}

/** ItemList block for the `/shop` listing — ordered product URLs. */
export function productListJsonLd(products: { name: string; slug: string }[], locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: product.name,
      url: `${SITE_URL}${localePath(locale, `/shop/${product.slug}`)}`,
    })),
  }
}

/**
 * Creator/developer attribution — the Devalon agency and its founder, plus a
 * WebSite block crediting them. Emitted once in the locale layout so every
 * page carries the attribution.
 */
export function agencyJsonLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': AGENCY_ORG_ID,
        name: AGENCY.name,
        url: AGENCY.url,
        description: AGENCY.description,
        email: AGENCY.email,
        telephone: AGENCY.phone,
        sameAs: [AGENCY.person.linkedin],
        founder: { '@id': AGENCY_PERSON_ID },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: AGENCY.email,
            telephone: AGENCY.phone,
            availableLanguage: ['ro', 'en', 'ru'],
          },
        ],
      },
      {
        '@type': 'Person',
        '@id': AGENCY_PERSON_ID,
        name: AGENCY.person.name,
        jobTitle: AGENCY.person.role,
        url: AGENCY.person.linkedin,
        sameAs: [AGENCY.person.linkedin],
        email: AGENCY.person.email,
        telephone: AGENCY.person.phone,
        worksFor: { '@id': AGENCY_ORG_ID },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: locale,
        publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        creator: { '@id': AGENCY_ORG_ID },
        author: { '@id': AGENCY_PERSON_ID },
      },
    ],
  }
}

/**
 * WebSite block crediting the agency that built the site. Emitted as a
 * standalone block (separate from `agencyJsonLd`'s `@graph`) but with
 * the same `@id`s, so a JSON-LD processor merges the entities rather
 * than duplicating them.
 */
export function websiteJsonLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: locale,
    creator: {
      '@type': 'Organization',
      '@id': AGENCY_ORG_ID,
      name: AGENCY.name,
      url: AGENCY.url,
      email: AGENCY.email,
      founder: {
        '@type': 'Person',
        '@id': AGENCY_PERSON_ID,
        name: AGENCY.person.name,
        jobTitle: AGENCY.person.role,
        sameAs: [AGENCY.person.linkedin],
      },
    },
  }
}
