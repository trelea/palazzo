import { useTranslations } from 'next-intl'
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

import { Link } from '@/i18n/navigation'
import type { ServiceKey } from '@/lib/site'
import { AppointmentCta } from '@/components/appointment-cta'
import { SectionTitle } from '@/components/section-title'
import { Reveal } from '@/components/reveal'
import { GridBackdrop } from '@/components/grid-backdrop'
import { BlurFade } from '@/components/ui/blur-fade'
import { MagicCard } from '@/components/ui/magic-card'
import { AuroraText } from '@/components/ui/aurora-text'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { Particles } from '@/components/ui/particles'
import { BorderBeam } from '@/components/ui/border-beam'

/** Olive/sage brand gradient for the hero accent word — matches the homepage hero. */
const AURORA = ['#51623D', '#7a8c54', '#9bb06f', '#51623D']

/** Per-service presentation metadata. Copy lives under `ServicePages.<service>`. */
const SERVICE_CONFIG: Record<ServiceKey, { heroImg: string; helpsImg: string }> = {
  physiotherapy: {
    heroImg: '/physiotherapy-vibes.jpg',
    helpsImg: '/physiotherapy-service.jpg',
  },
  phytotherapy: {
    heroImg: '/phytotherapy-vibes.jpg',
    helpsImg: '/phytotherapy-service.jpg',
  },
}

/** "How it helps" bullet keys — shared shape across both services. */
const HELP_POINTS = ['helps.point1', 'helps.point2', 'helps.point3', 'helps.point4'] as const

/** Benefit cards — generic icons reused across services; copy is per-service. */
const BENEFIT_ITEMS = [
  { Icon: Activity, titleKey: 'benefits.item1Title', descKey: 'benefits.item1Desc' },
  { Icon: ShieldCheck, titleKey: 'benefits.item2Title', descKey: 'benefits.item2Desc' },
  { Icon: TrendingUp, titleKey: 'benefits.item3Title', descKey: 'benefits.item3Desc' },
  { Icon: HeartPulse, titleKey: 'benefits.item4Title', descKey: 'benefits.item4Desc' },
  { Icon: Sparkles, titleKey: 'benefits.item5Title', descKey: 'benefits.item5Desc' },
  { Icon: Clock, titleKey: 'benefits.item6Title', descKey: 'benefits.item6Desc' },
] as const

export function ServicePage({ service }: { service: ServiceKey }) {
  const t = useTranslations(`ServicePages.${service}`)
  const tn = useTranslations('Nav')
  const { heroImg, helpsImg } = SERVICE_CONFIG[service]

  return (
    <>
      {/* ── Hero — split text + image with an animated brand-grid backdrop ── */}
      <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden bg-background py-16 lg:py-0">
        {/* Subtle animated grid, brand-tinted and faded toward the edges. */}
        <GridBackdrop />
        {/* Soft brand glow anchored to the text side. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 -left-24 -z-10 size-[34rem] -translate-y-1/2 rounded-full bg-brand/5 blur-3xl"
        />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          {/* Copy */}
          <div className="max-w-xl">
            <BlurFade delay={0.2}>
              <h1 className="font-heading text-5xl leading-[1.05] font-medium tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl">
                {t('hero.title')} <AuroraText colors={AURORA}>{t('hero.titleAccent')}</AuroraText>
              </h1>
            </BlurFade>

            <BlurFade delay={0.35}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                {t('hero.subtitle')}
              </p>
            </BlurFade>

            <BlurFade delay={0.5}>
              <ShimmerButton
                asChild
                background="var(--brand)"
                shimmerColor="#ffffff"
                borderRadius="0px"
                shimmerDuration="3s"
                className="mt-9 px-7 py-3 text-sm font-medium"
              >
                <Link href="/contacts">{t('hero.cta')}</Link>
              </ShimmerButton>
            </BlurFade>
          </div>

          {/* Image — sits below the copy on phones, beside it on large screens. */}
          <BlurFade delay={0.3} direction="left">
            <div className="relative aspect-4/5 overflow-hidden sm:aspect-4/3 lg:aspect-4/5 lg:rounded-3xl lg:border lg:border-brand/15 lg:shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImg}
                alt={tn(service)}
                className="size-full object-cover object-center [mask-image:linear-gradient(to_bottom,transparent_0%,#000_38%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,#000_38%)] lg:[mask-image:none] lg:[-webkit-mask-image:none]"
              />
              {/* Desktop keeps the framed accent; on phones the photo dissolves into the hero. */}
              <BorderBeam
                size={140}
                duration={11}
                colorFrom="#51623D"
                colorTo="#9bb06f"
                className="hidden lg:block"
              />
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ── Service description ── */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
        <Reveal inView>
          <SectionTitle className="mx-auto">{t('description.heading')}</SectionTitle>
        </Reveal>
        <Reveal delay={0.15} inView>
          <p className="mt-6 text-lg leading-relaxed text-pretty text-foreground/90">
            {t('description.body1')}
          </p>
        </Reveal>
        <Reveal delay={0.25} inView>
          <p className="mt-5 text-base leading-relaxed text-pretty text-muted-foreground">
            {t('description.body2')}
          </p>
        </Reveal>
      </section>

      {/* ── How it helps ── */}
      <section className="relative isolate overflow-hidden bg-brand-subtle/30 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Reveal direction="right" inView>
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-brand/15 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={helpsImg} alt={tn(service)} className="size-full object-cover object-center" />
              <BorderBeam size={120} duration={11} colorFrom="#51623D" colorTo="#9bb06f" />
            </div>
          </Reveal>

          <Reveal direction="left" inView>
            <div>
              <SectionTitle>{t('helps.heading')}</SectionTitle>
              <p className="mt-5 text-base leading-relaxed text-pretty text-muted-foreground">
                {t('helps.body')}
              </p>
              <ul className="mt-7 space-y-4">
                {HELP_POINTS.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.75} />
                    <span className="text-base leading-relaxed text-foreground/90">{t(key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal inView>
          <div className="max-w-2xl">
            <SectionTitle>{t('benefits.heading')}</SectionTitle>
            <p className="mt-4 text-muted-foreground">{t('benefits.subtitle')}</p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFIT_ITEMS.map(({ Icon: ItemIcon, titleKey, descKey }, i) => (
            <Reveal key={titleKey} delay={0.05 * i} inView>
              <MagicCard
                className="h-full rounded-2xl"
                gradientFrom="#51623D"
                gradientTo="#9bb06f"
                gradientColor="#51623D"
                gradientOpacity={0.12}
              >
                <div className="p-7">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <ItemIcon className="size-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 font-heading text-xl font-medium text-foreground">
                    {t(titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(descKey)}</p>
                </div>
              </MagicCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Service-specific appointment band ── */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <Reveal inView>
          <div className="relative isolate overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-brand via-brand-muted to-[#9bb06f] p-9 text-brand-foreground shadow-sm sm:p-12 lg:p-14">
            <Particles className="absolute inset-0" quantity={70} ease={80} size={0.6} color="#ffffff" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -bottom-24 size-80 rounded-full bg-white/5 blur-3xl"
            />
            <div className="relative z-10 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  {t('cta.heading')}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-brand-foreground/85 sm:text-base">
                  {t('cta.body')}
                </p>
              </div>
              <ShimmerButton
                asChild
                background="#ffffff"
                shimmerColor="#51623D"
                borderRadius="0px"
                shimmerDuration="3s"
                className="shrink-0 px-8 py-4 text-sm font-medium !text-brand"
              >
                <Link href="/contacts">
                  {t('cta.button')}
                  <ArrowRight className="size-4" />
                </Link>
              </ShimmerButton>
            </div>
            <BorderBeam size={180} duration={14} colorFrom="#ffffff" colorTo="#9bb06f" />
          </div>
        </Reveal>
      </section>

      {/* ── Standard booking + contact form ── */}
      <AppointmentCta />
    </>
  )
}
