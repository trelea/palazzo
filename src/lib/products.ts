import type { Product } from '@/payload-types'

/** Matches routing.locales in src/i18n/routing.ts and the CMS field suffixes. */
export type { AppLocale } from '@/lib/news'

import type { AppLocale } from '@/lib/news'

export function productName(doc: Product, locale: AppLocale): string {
  return doc[`product_name_${locale}`]
}

export function productShortDesc(doc: Product, locale: AppLocale): string {
  return doc[`product_short_desc_${locale}`]
}

export function productLongDesc(doc: Product, locale: AppLocale): Product['product_long_desc_en'] {
  return doc[`product_long_desc_${locale}`]
}

export function productTypeLabel(
  productType: Product['product_type'],
  locale: AppLocale,
): string {
  if (productType && typeof productType === 'object') {
    return productType[`label_${locale}`]
  }
  return ''
}
