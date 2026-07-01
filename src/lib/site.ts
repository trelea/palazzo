/**
 * Central site configuration for the public-facing shell (navbar + footer).
 *
 * `href` values are locale-agnostic internal paths — the next-intl `Link`
 * prefixes the active locale automatically (e.g. `/about-us` -> `/ro/about-us`).
 *
 * NOTE: contact details below are placeholders — replace with the real ones.
 */

export type ServiceKey = 'physiotherapy' | 'phytotherapy'
export type LinkKey = 'home' | 'about' | 'news' | 'contact'

export type ServiceLink = {
  /** Locale-agnostic internal path. */
  href: string
  /** Key into the `Nav` i18n namespace. */
  key: ServiceKey
}

export type NavLink = {
  href: string
  key: LinkKey
}

/** Service offerings, grouped under the "Services" menu. */
export const SERVICE_LINKS: ServiceLink[] = [
  { href: '/physiotherapy', key: 'physiotherapy' },
  { href: '/phytotherapy', key: 'phytotherapy' },
]

/**
 * Top navigation, in display order. A `link` is a single destination; a
 * `group` (e.g. Services) expands into `children` — a dropdown on desktop and
 * a labelled section in the mobile sheet.
 */
export type NavItem =
  | { type: 'link'; href: string; key: LinkKey }
  | { type: 'group'; key: 'services'; children: ServiceLink[] }

export const NAV_ITEMS: NavItem[] = [
  { type: 'link', href: '/', key: 'home' },
  { type: 'link', href: '/about-us', key: 'about' },
  { type: 'group', key: 'services', children: SERVICE_LINKS },
  { type: 'link', href: '/news', key: 'news' },
  { type: 'link', href: '/contacts', key: 'contact' },
]

/** Flat list of the standalone pages (no groups) — used by the footer. */
export const NAV_LINKS: NavLink[] = NAV_ITEMS.filter(
  (item): item is Extract<NavItem, { type: 'link' }> => item.type === 'link',
).map(({ href, key }) => ({ href, key }))

export const CONTACT = {
  // No phone number yet — set both once available and it shows up automatically.
  phone: null as string | null,
  phoneHref: null as string | null,
  email: 'rcv.hw.oficial@gmail.com',
  emailHref: 'mailto:rcv.hw.oficial@gmail.com',
  address: 'Str. Igor Vieru 16/1',
  mapHref:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Str. Igor Vieru 16/1, Chișinău'),
  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
  },
} as const

export const LOGO_SRC = '/palazzo-logo.svg'

/**
 * Cal.com scheduling username. Event-type slugs under this account are
 * `phytotherapy` / `physiotherapy` — a 1:1 match with `ServiceKey` — so a
 * booking link is simply `${CAL_COM_USERNAME}/${service}`.
 */
export const CAL_COM_USERNAME = 'palazzo-aesthetics-ygvhv1'

/** Cal.com `username/event-type-slug` booking link for a given service. */
export function calBookingLink(service: ServiceKey): string {
  return `${CAL_COM_USERNAME}/${service}`
}
