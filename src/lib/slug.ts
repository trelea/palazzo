/**
 * Normalizes a product name into a URL-safe slug: lowercase, diacritics
 * stripped, every run of non-alphanumerics collapsed to a single dash.
 * e.g. `Re-GEN Pro-Age Face Cream` -> `re-gen-pro-age-face-cream`.
 *
 * Shared by the `products` collection hook and the product scraper so both
 * produce identical slugs.
 */
export function slugify(value: string | null | undefined): string {
  if (!value) return ''
  return (
    value
      .normalize('NFD')
      // Strip combining diacritical marks (é -> e).
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      // Keep URLs sane for very long marketing titles.
      .slice(0, 80)
      .replace(/-+$/g, '')
  )
}
