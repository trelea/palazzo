import { useTranslations } from 'next-intl'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { NAV_LINKS, SERVICE_LINKS, CONTACT, LOGO_SRC } from '@/lib/site'

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14 9h2.5l.5-3H14V4.5c0-.86.28-1.5 1.6-1.5H17V.3A22 22 0 0 0 14.9 0C12.6 0 11 1.34 11 4.05V6H8.5v3H11v9h3V9Z" />
    </svg>
  )
}

const SOCIALS = [
  { href: CONTACT.social.instagram, label: 'Instagram', Icon: InstagramIcon },
  { href: CONTACT.social.facebook, label: 'Facebook', Icon: FacebookIcon },
]

export default function Footer() {
  const t = useTranslations('Footer')
  const tn = useTranslations('Nav')
  const year = new Date().getFullYear()

  return (
    <footer className="relative isolate overflow-hidden border-t border-border/60 bg-gradient-to-b from-brand-subtle/50 to-background">
      {/* Subtle CSS dot texture — no JS, no extra dependency. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 text-brand opacity-[0.05] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:18px_18px]"
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" aria-label="Palazzo Aesthetics — home" className="inline-flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_SRC} alt="Palazzo Aesthetics" width={56} height={56} className="size-12 shrink-0 sm:size-14" />
              <span className="flex flex-col leading-none">
                <span className="font-heading text-lg font-semibold tracking-[0.18em] text-brand uppercase">
                  Palazzo
                </span>
                <span className="text-[0.65rem] font-medium tracking-[0.32em] text-muted-foreground uppercase">
                  Aesthetics
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t('tagline')}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center rounded-none border border-border/70 text-foreground/70 transition-colors hover:border-brand hover:bg-brand hover:text-brand-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <nav aria-label={t('explore')}>
            <h2 className="text-xs font-semibold tracking-[0.18em] text-foreground uppercase">
              {t('explore')}
            </h2>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {tn(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label={t('services')}>
            <h2 className="text-xs font-semibold tracking-[0.18em] text-foreground uppercase">
              {t('services')}
            </h2>
            <ul className="mt-4 space-y-3">
              {SERVICE_LINKS.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {tn(service.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="text-xs font-semibold tracking-[0.18em] text-foreground uppercase">
              {t('contact')}
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {CONTACT.phone && CONTACT.phoneHref && (
                <li>
                  <a href={CONTACT.phoneHref} className="group flex items-start gap-3 transition-colors hover:text-brand">
                    <Phone className="mt-0.5 size-4 shrink-0 text-brand" />
                    <span>{CONTACT.phone}</span>
                  </a>
                </li>
              )}
              <li>
                <a href={CONTACT.emailHref} className="group flex items-start gap-3 transition-colors hover:text-brand">
                  <Mail className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>{CONTACT.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 transition-colors hover:text-brand"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                  <span>{CONTACT.address}</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-brand" />
                <span className="space-y-0.5">
                  <span className="block">
                    {t('weekdays')}: <span className="text-foreground/80">09:00 – 20:00</span>
                  </span>
                  <span className="block">
                    {t('saturday')}: <span className="text-foreground/80">10:00 – 16:00</span>
                  </span>
                  <span className="block">
                    {t('sunday')}: <span className="text-foreground/80">{t('closed')}</span>
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {year} Palazzo Aesthetics. {t('rights')}
          </p>
          <p className="font-heading text-xs tracking-[0.2em] text-brand/70 uppercase">
            Palazzo · Aesthetics
          </p>
        </div>
      </div>
    </footer>
  )
}
