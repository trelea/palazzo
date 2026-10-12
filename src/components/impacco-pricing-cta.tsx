import { useLocale, useTranslations } from 'next-intl'
import { ArrowUp, CalendarCheck, CheckCircle2, Star, Tag } from 'lucide-react'

import { BOOKING_LINK } from '@/lib/site'
import { formatPriceMDL, IMPACCO_PRICE_MDL } from '@/lib/procedure-prices'
import { Reveal } from '@/components/reveal'
import { SectionTitle } from '@/components/section-title'
import { BorderBeam } from '@/components/ui/border-beam'
import { ShimmerButton } from '@/components/ui/shimmer-button'

/** Checklist keys under `ServicePages.impacco.pricing.points`. */
const POINT_KEYS = ['point1', 'point2', 'point3'] as const

/** Mid-page pricing nudge for Impacco — rendered between `BenefitsTabs` and
 *  `IssuesTreated`. Copy lives under `ServicePages.impacco.pricing`. */
export function ImpaccoPricingCta() {
  const t = useTranslations('ServicePages.impacco.pricing')
  const locale = useLocale()
  const priceLabel = `${t('priceFrom')} ${formatPriceMDL(IMPACCO_PRICE_MDL, locale)}`

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal inView>
        <div className="relative isolate grid overflow-hidden rounded-3xl border border-brand/15 bg-brand-subtle/30 shadow-sm lg:grid-cols-2">
          {/* Photo */}
          <div className="relative min-h-56 sm:min-h-96 lg:min-h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/impacco-cta.jpg"
              alt="Impacco ritual"
              className="absolute inset-0 size-full object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-brand-subtle/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-brand-subtle/20"
            />
            {/* Floating price badge over the photo. */}
            <p className="absolute bottom-5 left-5 inline-flex rotate-[-3deg] items-center gap-2.5 rounded-2xl border-2 border-white/25 bg-brand px-6 py-4 font-heading text-xl font-bold tracking-tight text-white shadow-[0_16px_45px_-10px_rgba(81,98,61,0.75)] sm:text-2xl">
              <Tag className="size-6 shrink-0" strokeWidth={2.25} />
              {priceLabel}
            </p>
          </div>

          {/* Copy */}
          <div className="relative flex flex-col items-start justify-center p-6 text-left sm:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-brand/10 blur-3xl"
            />
            <SectionTitle className="text-left text-2xl sm:text-3xl">{t('heading')}</SectionTitle>
            <div className="mt-4 flex items-center gap-2 sm:mt-5">
              <span className="flex items-center gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </span>
              <span className="text-sm text-muted-foreground">{t('rating')}</span>
            </div>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:mt-5 sm:text-lg">
              {t('body')}
            </p>
            <ul className="mt-5 space-y-2.5 sm:mt-7 sm:space-y-3">
              {POINT_KEYS.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.75} />
                  <span className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                    {t(`points.${key}`)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 font-heading text-2xl font-semibold text-brand sm:mt-7 sm:text-4xl">
              {priceLabel}
            </p>
            <div className="mt-6 grid w-full max-w-xl grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
              <ShimmerButton
                asChild
                type="button"
                background="var(--brand)"
                shimmerColor="#ffffff"
                borderRadius="0px"
                shimmerDuration="3s"
                className="w-full min-w-0 gap-2 px-5 py-3 text-sm font-medium sm:px-6 sm:py-4 sm:text-base"
              >
                <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">
                  <CalendarCheck className="size-4 shrink-0 sm:size-5" strokeWidth={2} />
                  {t('button')}
                </a>
              </ShimmerButton>
              <a
                href="#impacco-benefits"
                className="inline-flex w-full min-w-0 items-center justify-center gap-2 border border-brand/30 bg-transparent px-5 py-3 text-sm font-medium whitespace-nowrap text-brand transition-colors hover:border-brand hover:bg-brand/5 sm:px-6 sm:py-4 sm:text-base"
              >
                <ArrowUp className="size-4 shrink-0 sm:size-5" strokeWidth={2} />
                {t('secondary')}
              </a>
            </div>
          </div>

          <BorderBeam size={140} duration={11} colorFrom="#51623D" colorTo="#9bb06f" />
        </div>
      </Reveal>
    </section>
  )
}
