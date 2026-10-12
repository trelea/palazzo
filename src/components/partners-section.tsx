import { ExternalLink, FlaskConical, History, Leaf } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SectionTitle } from '@/components/section-title'
import { Reveal } from '@/components/reveal'
import { DotTexture } from '@/components/dot-texture'
import { BorderBeam } from '@/components/ui/border-beam'

const PARTNER_URL = 'https://laboratorizanellato.it/'

/** Trust chips under the copy — keys into `HomePage.partners`. */
const PARTNER_POINTS = [
  { key: 'point1', Icon: History },
  { key: 'point2', Icon: FlaskConical },
  { key: 'point3', Icon: Leaf },
] as const

/**
 * Single-partner section — Laboratori Zanellato.
 *
 * Independent and reusable: no props, copy lives in the
 * `HomePage.partners` i18n namespace. Mounted directly above the
 * contact block (`<AppointmentCta />`) on the home and about-us pages.
 * Editorial split (copy left, logo card right) matching the
 * Story/Featured rhythm — deliberately NOT a marquee.
 */
export function PartnersSection() {
  const t = useTranslations('HomePage.partners')

  return (
    <section className="relative isolate overflow-hidden border-t border-brand/10 bg-brand-subtle/30 py-24 lg:py-36">
      <DotTexture />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* ── Copy ── */}
        <Reveal>
          <div>
            <SectionTitle>{t('heading')}</SectionTitle>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
              {t('body')}
            </p>

            <ul className="mt-7 flex flex-wrap gap-2.5">
              {PARTNER_POINTS.map(({ key, Icon }) => (
                <li
                  key={key}
                  className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-background/60 px-4 py-2 text-sm font-medium text-brand"
                >
                  <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                  {t(key)}
                </li>
              ))}
            </ul>

            <Button
              asChild
              className="mt-8 h-auto gap-2 rounded-none bg-brand px-6 py-3 text-sm font-medium text-brand-foreground hover:bg-brand-muted"
            >
              <a href={PARTNER_URL} target="_blank" rel="noopener noreferrer">
                {t('visitCta')}
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </div>
        </Reveal>

        {/* ── Logo card ── */}
        <Reveal delay={0.1} direction="right">
          <Card className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border-brand/15 bg-card p-8 text-center shadow-xl sm:p-10">
            {/* White well keeps the logo legible on the tinted section bg. */}
            <a
              href={PARTNER_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('partnerName')}
              className="group/logo flex items-center justify-center rounded-2xl bg-white px-10 py-10 transition-shadow outline-brand hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/zanellato-logo.webp"
                alt={t('partnerName')}
                className="h-24 w-auto max-w-full object-contain transition-transform duration-500 ease-out group-hover/logo:scale-105 sm:h-28 lg:h-32"
              />
            </a>
            <p className="mt-6 font-heading text-xl font-semibold tracking-tight text-foreground">
              {t('partnerName')}
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-pretty text-muted-foreground">
              {t('partnerDesc')}
            </p>
            <BorderBeam size={120} duration={11} colorFrom="#51623D" colorTo="#9bb06f" />
          </Card>
        </Reveal>
      </div>
    </section>
  )
}
