import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import {
  ArrowRight,
  Clock,
  HeartPulse,
  Leaf,
  Sparkles,
  ShieldCheck,
  Users,
} from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { pageMetadata } from '@/lib/seo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AppointmentCta } from '@/components/appointment-cta'
import { PartnersSection } from '@/components/partners-section'
import { SectionTitle } from '@/components/section-title'
import { Reveal } from '@/components/reveal'
import { DotTexture } from '@/components/dot-texture'
import { GridBackdrop } from '@/components/grid-backdrop'
import { BorderBeam } from '@/components/ui/border-beam'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Meta.about' })
  return pageMetadata({
    locale,
    path: '/about-us',
    title: t('title'),
    description: t('description'),
  })
}

/** Reasons to choose Palazzo — copy lives in the `AboutPage.why` i18n namespace. */
const WHY_ITEMS = [
  { Icon: ShieldCheck, titleKey: 'why.evidenceTitle', descKey: 'why.evidenceDesc' },
  { Icon: Leaf, titleKey: 'why.naturalTitle', descKey: 'why.naturalDesc' },
  { Icon: HeartPulse, titleKey: 'why.personalTitle', descKey: 'why.personalDesc' },
  { Icon: Users, titleKey: 'why.teamTitle', descKey: 'why.teamDesc' },
  { Icon: Sparkles, titleKey: 'why.techTitle', descKey: 'why.techDesc' },
  { Icon: Clock, titleKey: 'why.followupTitle', descKey: 'why.followupDesc' },
] as const

/**
 * The three service cards — Face, Body, Impacco — mirroring the homepage
 * `HOME_SERVICE_CARDS` (`src/app/(frontend)/[locale]/page.tsx`).
 * Same images, same descriptions (`HomePage.services.*Desc`), same hrefs.
 * Card architecture is unchanged (image-top vertical card); Impacco only
 * spans 2 cols and switches to image-left / text-right at `lg`.
 */
const ABOUT_SERVICE_CARDS = [
  { key: 'face', descKey: 'services.faceDesc', img: '/face.jpg', href: '/phytoaestetica#face' },
  { key: 'body', descKey: 'services.bodyDesc', img: '/body.jpg', href: '/phytoaestetica#body' },
  {
    key: 'impacco',
    descKey: 'services.impaccoDesc',
    img: '/herbal-pack.jpg',
    href: '/phytotherapy',
    wide: true,
  },
] as const

/** Maximum character length for About service card descriptions. */
const MAX_ABOUT_DESC_LENGTH = 256

/** Maximum character length for the wide Impacco card. */
const MAX_ABOUT_WIDE_DESC_LENGTH = 256

/** Truncate to `max` chars, appending "..." when cut. */
function truncateAboutDesc(text: string, max: number = MAX_ABOUT_DESC_LENGTH): string {
  return text.length > max ? text.slice(0, max).trimEnd() + '...' : text
}

export default function AboutUs() {
  const t = useTranslations('AboutPage')
  const th = useTranslations('HomePage')
  const tn = useTranslations('Nav')

  return (
    <div className="relative isolate">
      {/* Subtle left-to-right brand fade across the full page height. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-brand/12 via-brand/5 to-transparent"
      />

      {/* ── Header ── */}
      <section className="relative isolate overflow-hidden px-4 pt-12 pb-10 sm:px-6 lg:px-8 lg:pt-20 lg:pb-14">
        <GridBackdrop />
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
              {t('title')}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
              {t('lead')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 1) Our Story ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal direction="left">
            <div>
              <SectionTitle>{t('story.heading')}</SectionTitle>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-pretty text-muted-foreground">
                <p>{t('story.body1')}</p>
                <p>{t('story.body2')}</p>
                <p>{t('story.body3')}</p>
                <p>{t('story.body4')}</p>
                <p>{t('story.body5')}</p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" className="order-first lg:order-last">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-brand/15 shadow-xl lg:aspect-4/3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/our-story-img.jpg"
                alt="A modern Palazzo Aesthetics treatment room"
                className="size-full object-cover object-center"
              />
              <BorderBeam size={120} duration={11} colorFrom="#51623D" colorTo="#9bb06f" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 2) Why choose us ── */}
      <section className="relative isolate overflow-hidden bg-brand-subtle/30 py-20 lg:py-28">
        <DotTexture />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <SectionTitle>{t('why.heading')}</SectionTitle>
              <p className="mt-4 text-muted-foreground">{t('why.subtitle')}</p>
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_ITEMS.map(({ Icon, titleKey, descKey }, i) => (
              <Reveal key={titleKey} delay={0.05 * i}>
                <Card className="h-full rounded-2xl border-brand/15 bg-card/60 p-7 shadow-sm backdrop-blur-sm">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 font-heading text-xl font-medium text-foreground">
                    {t(titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(descKey)}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3) Our Services ── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Services */}
        <Reveal>
          <div className="max-w-2xl">
            <SectionTitle as="h3">{t('services.heading')}</SectionTitle>
            <p className="mt-4 text-muted-foreground">{t('services.subtitle')}</p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {ABOUT_SERVICE_CARDS.map((service, i) => {
            const wide = 'wide' in service && service.wide
            return (
              <Reveal key={service.href} delay={0.1 * i} className={wide ? 'lg:col-span-2' : undefined}>
                <Card
                  className={
                    wide
                      ? 'group flex h-full flex-col overflow-hidden rounded-2xl border-brand/15 p-0 shadow-sm lg:h-[440px] lg:flex-row'
                      : 'group flex h-full flex-col overflow-hidden rounded-2xl border-brand/15 p-0 shadow-sm'
                  }
                >
                  <div
                    className={
                      wide
                        ? 'relative h-48 w-full shrink-0 overflow-hidden sm:h-56 lg:h-full lg:w-1/2'
                        : 'relative h-48 w-full overflow-hidden sm:h-56'
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.img}
                      alt={tn(service.key)}
                      className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div
                    className={
                      wide
                        ? 'flex flex-1 flex-col items-start p-7 sm:p-8 lg:w-1/2 lg:justify-center'
                        : 'flex flex-1 flex-col items-start p-7 sm:p-8'
                    }
                  >
                    <h4 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                      {tn(service.key)}
                    </h4>
                    <p
                      className={
                        wide
                          ? 'mt-3 text-sm leading-relaxed whitespace-pre-line text-muted-foreground lg:line-clamp-5'
                          : 'mt-3 text-sm leading-relaxed whitespace-pre-line text-muted-foreground'
                      }
                    >
                      {wide
                        ? truncateAboutDesc(th(service.descKey), MAX_ABOUT_WIDE_DESC_LENGTH)
                        : truncateAboutDesc(th(service.descKey))}
                    </p>
                    <Button
                      asChild
                      className={
                        wide
                          ? 'mt-6 h-auto rounded-none bg-brand px-6 py-3 text-sm text-brand-foreground hover:bg-brand-muted'
                          : 'mt-6 h-auto rounded-none bg-brand px-6 py-3 text-sm text-brand-foreground hover:bg-brand-muted'
                      }
                    >
                      <Link href={service.href}>
                        {t('services.cta')}
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ── Booking + contact form ── */}
      <PartnersSection />
      <AppointmentCta className="pt-16 lg:pt-24" />
    </div>
  )
}
