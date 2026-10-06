/**
 * Central site configuration for the public-facing shell (navbar + footer).
 *
 * `href` values are locale-agnostic internal paths — the next-intl `Link`
 * prefixes the active locale automatically (e.g. `/about-us` -> `/ro/about-us`).
 *
 * NOTE: the phone number is still pending — see the note on `CONTACT.phone`.
 */

/**
 * Every key the menus can render — includes the nested Face/Body anchors, which
 * point at sections of the phyto-esthetics page rather than pages of their own.
 */
export type ServiceKey = 'phytoaestetica' | 'face' | 'body' | 'impacco'

/**
 * The services that have a route of their own. Narrower than `ServiceKey`,
 * because Face/Body are `#anchor` deep links, not pages — so anything keyed by
 * service *page* (the `ServicePage` renderer, per-page metadata) uses this.
 */
export type ServicePageKey = 'phytoaestetica' | 'impacco'

export type LinkKey = 'home' | 'about' | 'news' | 'contact'

export type ServiceLink = {
  /** Locale-agnostic internal path. */
  href: string
  /** Key into the `Nav` i18n namespace. */
  key: ServiceKey
}

/**
 * A top-level service in the "Services" menu.
 *
 * `children` is required rather than optional so every entry has the same shape:
 * with an optional prop on a literal tuple, TypeScript models the array as a
 * union of "has children" / "has none" and then refuses `service.children`
 * outright. An empty array is the honest value for a service with no submenu —
 * consumers branch on `children.length`, not truthiness.
 */
export type ServiceEntry = ServiceLink & {
  /** Nested links, rendered as a submenu. Empty when the service has none. */
  children: readonly ServiceLink[]
}

export type NavLink = {
  href: string
  key: LinkKey
}

/**
 * Service offerings, grouped under the "Services" menu.
 *
 * `as const satisfies readonly ServiceEntry[]` rather than a plain
 * `ServiceEntry[]` annotation: the annotation would widen every top-level `key`
 * to `ServiceKey`, so `SERVICE_META[service.key]` on the About page could no
 * longer prove the entry is one of the two routable services. Keeping the
 * literal types lets consumers narrow without a cast.
 */
export const SERVICE_LINKS = [
  {
    href: '/phytoaestetica',
    key: 'phytoaestetica',
    children: [
      { href: '/phytoaestetica?service=face', key: 'face' },
      { href: '/phytoaestetica?service=body', key: 'body' },
    ],
  },
  { href: '/phytotherapy', key: 'impacco', children: [] },
] as const satisfies readonly ServiceEntry[]

/**
 * Top navigation, in display order. A `link` is a single destination; a
 * `group` (e.g. Services) expands into `children` — a dropdown on desktop and
 * a labelled section in the mobile sheet.
 */
export type NavItem =
  | { type: 'link'; href: string; key: LinkKey }
  | { type: 'group'; key: 'services'; children: readonly ServiceEntry[] }

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

/** External booking link — all booking buttons across the site navigate here. */
export const BOOKING_LINK = 'https://main.d32keiqm81x88z.amplifyapp.com/programare.html'
