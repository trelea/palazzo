/**
 * Central site configuration for the public-facing shell (navbar + footer).
 *
 * `href` values are locale-agnostic internal paths — the next-intl `Link`
 * prefixes the active locale automatically (e.g. `/about-us` -> `/ro/about-us`).
 *
 * NOTE: the phone number is still pending — see the note on `CONTACT.phone`.
 */

export type ServiceKey = 'phytoaestetica' | 'phytotherapy'
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
  { href: '/phytoaestetica', key: 'phytoaestetica' },
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

// contacts
export const CONTACT = {
  // No phone number yet — set both once available and it shows up automatically.
  phone: null as string | null,
  phoneHref: null as string | null,
  email: 'palazzo.aesthetics@gmail.com',
  emailHref: 'mailto:palazzo.aesthetics@gmail.com',
  address: 'Str. Igor Vieru 16/1',
  mapHref:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Str. Igor Vieru 16/1, Chișinău'),
  social: {
    instagram: 'https://www.instagram.com/palazzo.aesthetics/',
    facebook: 'https://www.facebook.com/profile.php?id=61591751587063',
  },
} as const

/**
 * Weekday working hours (Mon–Fri, closed weekends) with a lunch break —
 * mirrored in the Cal.com availability schedule. Rendered in the footer and
 * contacts page and emitted as `openingHoursSpecification` in the
 * LocalBusiness JSON-LD, so on-page copy and structured data always agree.
 */
export const OPENING_HOURS = [
  { opens: '08:00', closes: '13:00' },
  { opens: '14:00', closes: '18:00' },
] as const

/** Display string for the weekday hours, e.g. `08:00 – 13:00, 14:00 – 18:00`. */
export const OPENING_HOURS_LABEL = OPENING_HOURS.map((w) => `${w.opens} – ${w.closes}`).join(', ')

export const LOGO_SRC = '/palazzo-logo.svg'

/**
 * Cal.com scheduling username. Each service has one event type per site
 * locale, each with a forced "Interface language" in Cal.com (the embed
 * otherwise follows the visitor's browser language, not the site language).
 * Slugs are set per event type in Cal.com and don't follow a single pattern,
 * so they are mapped explicitly here.
 */
export const CAL_COM_USERNAME = 'palazzo-aesthetics-ygvhv1'

const CAL_EVENT_SLUGS: Record<ServiceKey, Record<string, string>> = {
  phytoaestetica: { en: 'phyto-esthetics', ro: 'fitoestetica', ru: 'фито-эстетика' },
  phytotherapy: { en: 'phytotherapy', ro: 'phytotherapy-ro', ru: 'phytotherapy-ru' },
}

/** Cal.com `username/event-type-slug` booking link for a service in the given locale. */
export function calBookingLink(service: ServiceKey, locale: string): string {
  const slug = CAL_EVENT_SLUGS[service][locale] ?? CAL_EVENT_SLUGS[service].en
  return `${CAL_COM_USERNAME}/${slug}`
}
