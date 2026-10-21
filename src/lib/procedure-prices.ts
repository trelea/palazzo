/**
 * Gross prices in MDL for the Face / Body phyto-aesthetics rituals.
 *
 * Single source of truth for both universes — `grazia`, `armonia` and
 * `splendore` appear in Face AND Body with the same copy, so a shared map
 * keeps them from diverging. Discounts are intentionally not modelled here:
 * only the final gross price is ever displayed.
 *
 * Impacco is excluded on purpose — its "starting from 800 lei" note stays
 * exactly as it is.
 */
export const PROCEDURE_PRICES_MDL = {
  grazia: 2550,
  armonia: 3700,
  rinascita: 1600,
  splendore: 4700,
  respiro: 1200,
  vitalita: 3300,
  slancio: 1100,
  leggerezza: 2300,
} as const

/** Face universe procedure keys — mirrors the Face tab accordion. */
export const FACE_PROCEDURE_KEYS = ['grazia', 'armonia', 'rinascita', 'splendore', 'respiro'] as const

/** Body universe procedure keys — mirrors the Body tab accordion. */
export const BODY_PROCEDURE_KEYS = [
  'grazia',
  'armonia',
  'vitalita',
  'slancio',
  'leggerezza',
  'splendore',
] as const

/**
 * Deduped catalog order for metadata: face order first, then body-only keys.
 * `grazia`, `armonia` and `splendore` appear in both universes with the same
 * copy, so they are listed once.
 */
export const PHYTO_PROCEDURE_ORDER = [
  'grazia',
  'armonia',
  'rinascita',
  'splendore',
  'respiro',
  'vitalita',
  'slancio',
  'leggerezza',
] as const

/** Impacco ritual — "starting from" price in MDL, shown as-is on its page. */
export const IMPACCO_PRICE_MDL = 800

export type ProcedurePriceKey = keyof typeof PROCEDURE_PRICES_MDL

/**
 * Locale-aware MDL formatting via the platform `Intl` API (not next-intl).
 * `locale` is the active next-intl locale (`ro` | `en` | `ru`) so grouping
 * follows the visitor's language while the currency stays MDL everywhere.
 */
export function formatPriceMDL(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'MDL',
    maximumFractionDigits: 0,
  }).format(value)
}
