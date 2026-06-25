import { useTranslations } from 'next-intl'
import { ArrowUpRight, Clock, Mail, MapPin } from 'lucide-react'

import { CONTACT } from '@/lib/site'
import { Card } from '@/components/ui/card'
import { AppointmentCta } from '@/components/appointment-cta'
import { GridBackdrop } from '@/components/grid-backdrop'

/** Google Maps embed for the studio address — no API key required.
    `t=k` selects the satellite (aerial) map type by default. */
const MAP_SRC = `https://maps.google.com/maps?q=${encodeURIComponent(
  `${CONTACT.address}, Chișinău`,
)}&z=16&t=k&output=embed`

export default function Contacts() {
  const t = useTranslations('Contacts')
  const tf = useTranslations('Footer')

  return (
    <div className="relative isolate">
      {/* Subtle left-to-right brand fade across the full page height. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-brand/12 via-brand/5 to-transparent"
      />

      {/* ── Header ── */}
      <section className="relative isolate overflow-hidden px-4 pt-12 pb-12 sm:px-6 lg:px-8 lg:pt-20 lg:pb-14">
        <GridBackdrop />
        <div className="mx-auto max-w-7xl">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            {t('lead')}
          </p>
        </div>
      </section>

      {/* ── Contact info + map ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Info — sleek divided list */}
          <Card className="rounded-3xl border-brand/15 p-8 shadow-sm sm:p-10">
            <h2 className="font-heading text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {t('infoHeading')}
            </h2>

            <ul className="mt-6 divide-y divide-border/70">
              {/* Email */}
              <li className="flex items-center gap-4 py-5 first:pt-0">
                <Mail className="size-5 shrink-0 text-brand" strokeWidth={1.5} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs tracking-wide text-muted-foreground">{t('emailLabel')}</p>
                  <a
                    href={CONTACT.emailHref}
                    className="text-base text-foreground transition-colors hover:text-brand"
                  >
                    {CONTACT.email}
                  </a>
                </div>
              </li>

              {/* Address */}
              <li className="flex items-center gap-4 py-5">
                <MapPin className="size-5 shrink-0 text-brand" strokeWidth={1.5} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs tracking-wide text-muted-foreground">{t('addressLabel')}</p>
                  <p className="text-base text-foreground">{CONTACT.address}</p>
                </div>
                <a
                  href={CONTACT.mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('directions')}
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand transition-colors hover:text-brand-muted"
                >
                  {t('directions')}
                  <ArrowUpRight className="size-4" />
                </a>
              </li>

              {/* Opening hours */}
              <li className="flex items-start gap-4 py-5 last:pb-0">
                <Clock className="size-5 shrink-0 text-brand" strokeWidth={1.5} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs tracking-wide text-muted-foreground">{t('hoursLabel')}</p>
                  <dl className="mt-1.5 space-y-1 text-base">
                    <div className="flex justify-between gap-8">
                      <dt className="text-muted-foreground">{tf('weekdays')}</dt>
                      <dd className="text-foreground">09:00 – 20:00</dd>
                    </div>
                    <div className="flex justify-between gap-8">
                      <dt className="text-muted-foreground">{tf('saturday')}</dt>
                      <dd className="text-foreground">10:00 – 16:00</dd>
                    </div>
                    <div className="flex justify-between gap-8">
                      <dt className="text-muted-foreground">{tf('sunday')}</dt>
                      <dd className="text-foreground">{tf('closed')}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            </ul>
          </Card>

          {/* Map */}
          <Card className="relative min-h-80 overflow-hidden rounded-3xl border-brand/15 p-0 shadow-sm lg:min-h-0">
            <iframe
              title={CONTACT.address}
              src={MAP_SRC}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0"
            />
          </Card>
        </div>
      </section>

      {/* ── Booking + contact form ── */}
      <AppointmentCta />
    </div>
  )
}
