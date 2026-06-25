import { useTranslations } from 'next-intl'
import {
  ArrowRight,
  Award,
  Clock,
  HeartPulse,
  Leaf,
  Sparkles,
  ShieldCheck,
  Users,
} from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { SERVICE_LINKS } from '@/lib/site'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AppointmentCta } from '@/components/appointment-cta'
import { SectionTitle } from '@/components/section-title'
import { Reveal } from '@/components/reveal'
import { DotTexture } from '@/components/dot-texture'
import { GridBackdrop } from '@/components/grid-backdrop'
import { NumberTicker } from '@/components/ui/number-ticker'
import { BorderBeam } from '@/components/ui/border-beam'

/** Reasons to choose Palazzo — copy lives in the `AboutPage.why` i18n namespace. */
const WHY_ITEMS = [
  { Icon: ShieldCheck, titleKey: 'why.evidenceTitle', descKey: 'why.evidenceDesc' },
  { Icon: Leaf, titleKey: 'why.naturalTitle', descKey: 'why.naturalDesc' },
  { Icon: HeartPulse, titleKey: 'why.personalTitle', descKey: 'why.personalDesc' },
  { Icon: Users, titleKey: 'why.teamTitle', descKey: 'why.teamDesc' },
  { Icon: Sparkles, titleKey: 'why.techTitle', descKey: 'why.techDesc' },
  { Icon: Clock, titleKey: 'why.followupTitle', descKey: 'why.followupDesc' },
] as const

/** Headline figures — copy lives in the `AboutPage.results` i18n namespace. */
const RESULT_STATS = [
  { value: 5000, suffix: '+', Icon: Users, labelKey: 'results.clientsLabel', descKey: 'results.clientsDesc' },
  { value: 98, suffix: '%', Icon: HeartPulse, labelKey: 'results.satisfactionLabel', descKey: 'results.satisfactionDesc' },
  { value: 12, suffix: '', Icon: Award, labelKey: 'results.teamLabel', descKey: 'results.teamDesc' },
  { value: 15, suffix: '+', Icon: Clock, labelKey: 'results.experienceLabel', descKey: 'results.experienceDesc' },
] as const

/** Per-service presentation metadata — descriptions live in `AboutPage.services`. */
const SERVICE_META = {
  physiotherapy: { img: '/physiotherapy-service.jpg', descKey: 'services.physiotherapyDesc' },
  phytotherapy: { img: '/phytotherapy-service.jpg', descKey: 'services.phytotherapyDesc' },
} as const

export default function AboutUs() {
  const t = useTranslations('AboutPage')
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
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" className="order-first lg:order-last">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-brand/15 shadow-xl lg:aspect-4/3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/intro2.jpeg"
                alt="A modern Palazzo Aesthetics treatment room"
                className="size-full object-cover object-center"
              />
              <BorderBeam size={120} duration={11} colorFrom="#51623D" colorTo="#9bb06f" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 2) Who we are ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal direction="right">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-brand/15 shadow-xl lg:aspect-4/3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/our-story-img.jpg"
                alt="The Palazzo Aesthetics team"
                className="size-full object-cover object-center"
              />
              <BorderBeam size={120} duration={11} colorFrom="#51623D" colorTo="#9bb06f" />
            </div>
          </Reveal>

          <Reveal direction="left">
            <div>
              <SectionTitle>{t('who.heading')}</SectionTitle>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-pretty text-muted-foreground">
                <p>{t('who.body1')}</p>
                <p>{t('who.body2')}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 3) Why choose us ── */}
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

      {/* ── 4) Our Results & Services ── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <div className="max-w-2xl">
            <SectionTitle>{t('results.heading')}</SectionTitle>
            <p className="mt-4 text-muted-foreground">{t('results.subtitle')}</p>
          </div>
        </Reveal>

        {/* Headline figures */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {RESULT_STATS.map((stat, i) => (
            <Reveal key={stat.labelKey} delay={0.1 + i * 0.1}>
              <Card className="flex h-full min-h-56 flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-muted to-[#7a8c54] p-0 text-center text-brand-foreground shadow-sm">
                <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-brand-foreground">
                    <stat.Icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <div className="font-heading text-4xl font-light tracking-tight sm:text-5xl">
                    <NumberTicker value={stat.value} className="text-brand-foreground" />
                    {stat.suffix}
                  </div>
                </div>
                <div className="border-t border-white/10 bg-white/5 p-6">
                  <p className="font-heading text-lg font-normal text-brand-foreground">
                    {t(stat.labelKey)}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed font-light text-brand-foreground/70">
                    {t(stat.descKey)}
                  </p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Services */}
        <Reveal delay={0.1}>
          <div className="mt-16 max-w-2xl">
            <SectionTitle as="h3">{t('services.heading')}</SectionTitle>
            <p className="mt-4 text-muted-foreground">{t('services.subtitle')}</p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {SERVICE_LINKS.map((service, i) => {
            const { img, descKey } = SERVICE_META[service.key]
            return (
              <Reveal key={service.href} delay={0.1 * i}>
                <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border-brand/15 p-0 shadow-sm">
                  <div className="relative h-48 w-full overflow-hidden sm:h-56">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={tn(service.key)}
                      className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col items-start p-7 sm:p-8">
                    <h4 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                      {tn(service.key)}
                    </h4>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {t(descKey)}
                    </p>
                    <Button
                      asChild
                      className="mt-6 h-auto rounded-none bg-brand px-6 py-3 text-sm text-brand-foreground hover:bg-brand-muted"
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
      <AppointmentCta />
    </div>
  )
}
