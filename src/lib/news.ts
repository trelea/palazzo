import type { News } from '@/payload-types'

/** Matches routing.locales in src/i18n/routing.ts and the CMS field suffixes. */
export type AppLocale = 'ro' | 'en' | 'ru'

export function newsTitle(doc: News, locale: AppLocale): string {
  return doc[`title_${locale}`]
}

export function newsDesc(doc: News, locale: AppLocale): News['desc_en'] {
  return doc[`desc_${locale}`]
}
