import { Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowDown, ArrowRight, CheckCircle2, PersonStanding, ScanFace } from 'lucide-react'

import type { ServicePageKey } from '@/lib/site'
import { BOOKING_LINK } from '@/lib/site'
import { Link } from '@/i18n/navigation'
import { AppointmentCta } from '@/components/appointment-cta'
import { BenefitsTabs } from '@/components/benefits-tabs'
import { IssuesTreated } from '@/components/issues-treated'
import { PhytoFaceBody } from '@/components/phyto-face-body'
import { SectionTitle } from '@/components/section-title'
import { Reveal } from '@/components/reveal'
import { GridBackdrop } from '@/components/grid-backdrop'
import { BlurFade } from '@/components/ui/blur-fade'
import { AuroraText } from '@/components/ui/aurora-text'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { Particles } from '@/components/ui/particles'
import { BorderBeam } from '@/components/ui/border-beam'

/** Olive/sage brand gradient for the hero accent word — matches the homepage hero. */
const AURORA = ['#51623D', '#7a8c54', '#9bb06f', '#51623D']

/** Per-service presentation metadata. Copy lives under `ServicePages.<service>`. */
const SERVICE_CONFIG: Record<ServicePageKey, { heroImg: string; helpsImg: string }> = {
  phytoaestetica: {
    heroImg: '/phytoaestetica-vibes.jpg',
    helpsImg: '/phytoaestetica-helps.jpg',
  },
  impacco: {
    heroImg: '/phytotherapy-vibes.jpg',
    helpsImg: '/phytotherapy-service.jpg',
  },
}

/** "How it helps" bullet keys per service — impacco skips point1
 * ("Calms inflammation…") and shows the remaining three. */
const HELP_POINTS: Record<ServicePageKey, readonly string[]> = {
  phytoaestetica: ['helps.point1', 'helps.point2', 'helps.point3', 'helps.point4'],
  impacco: ['helps.point2', 'helps.point3', 'helps.point4'],
}

/** Description badges for impacco — copy lives under
 * `ServicePages.impacco.description.badges.<key>`. */
const DESCRIPTION_BADGE_KEYS = ['relax', 'release', 'comfort'] as const

export function ServicePage({
  service,
  initialService = null,
}: {
  service: ServicePageKey
  /** Explicit `?service=` universe resolved on the server — phytoaestetica only. */
  initialService?: 'face' | 'body' | null
}) {
  const t = useTranslations(`ServicePages.${service}`)
  const tn = useTranslations('Nav')
  const { heroImg, helpsImg } = SERVICE_CONFIG[service]
  const isPhyto = service === 'phytoaestetica'

  return (
    <>
      {/* ── Hero — split text + image with an animated brand-grid backdrop ── */}
      <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden bg-background py-16 lg:py-16">
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
              {isPhyto ? (
                <div className="mt-9 flex items-center gap-3 sm:gap-4">
                  <ShimmerButton
                    asChild
                    type="button"
                    background="var(--brand)"
                    shimmerColor="#ffffff"
                    borderRadius="0px"
                    shimmerDuration="3s"
                    className="min-w-0 flex-1 gap-2 px-4 py-3 text-sm font-medium sm:min-w-[210px] sm:flex-none sm:gap-3 sm:px-10 sm:text-base"
                  >
                    <Link href="/phytoaestetica?service=face" scroll={false}>
                      <ScanFace className="size-4 sm:size-5" />
                      {tn('face')}
                    </Link>
                  </ShimmerButton>
                  <Link
                    href="/phytoaestetica?service=body"
                    scroll={false}
                    className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 border border-brand/30 bg-transparent px-4 py-3 text-sm font-medium whitespace-nowrap text-brand transition-colors hover:border-brand hover:bg-brand/5 sm:min-w-[210px] sm:flex-none sm:gap-3 sm:px-10 sm:text-base"
                  >
                    <PersonStanding className="size-4 sm:size-5" />
                    {tn('body')}
                  </Link>
                </div>
              ) : (
                <ShimmerButton
                  asChild
                  type="button"
                  background="var(--brand)"
                  shimmerColor="#ffffff"
                  borderRadius="0px"
                  shimmerDuration="3s"
                  className="mt-7 gap-2 px-7 py-3 text-sm font-medium"
                >
                  <a href="#impacco-description">
                    {t('hero.cta')}
                    <ArrowDown className="size-4" />
                  </a>
                </ShimmerButton>
              )}
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
      <section
        id={isPhyto ? undefined : 'impacco-description'}
        className="mx-auto max-w-3xl scroll-mt-24 px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28"
      >
        <Reveal inView>
          <SectionTitle className="mx-auto">{t('description.heading')}</SectionTitle>
        </Reveal>
        <Reveal delay={0.15} inView>
          <p className="mt-6 text-base leading-relaxed text-pretty text-muted-foreground">
            {t('description.body1')}
          </p>
        </Reveal>
        <Reveal delay={0.25} inView>
          <p className="mt-5 text-base leading-relaxed text-pretty text-muted-foreground">
            {t('description.body2')}
          </p>
        </Reveal>
        {!isPhyto && (
          <Reveal delay={0.35} inView>
            <ul className="mt-8 flex flex-wrap justify-center gap-2">
              {DESCRIPTION_BADGE_KEYS.map((key) => (
                <li
                  key={key}
                  className="rounded-full border border-brand/20 bg-brand/5 px-3 py-1.5 text-xs font-medium text-brand sm:text-sm"
                >
                  {t(`description.badges.${key}`)}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </section>

      {/* ── How it helps ── */}
      <section
        id="phyto-helps"
        className="relative isolate overflow-hidden bg-brand-subtle/30 py-20 lg:py-28"
      >
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
                {HELP_POINTS[service].map((key) => (
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

      {/* ── Face + Body universes for phytoaestetica,
          benefits + treated issues for impacco ── */}
      {service === 'impacco' ? (
        <>
          <BenefitsTabs />
          <IssuesTreated />
        </>
      ) : (
        <Suspense>
          <PhytoFaceBody initialService={initialService} />
        </Suspense>
      )}

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
              {isPhyto ? (
                <div className="flex w-full items-center gap-3 sm:w-auto sm:shrink-0 sm:gap-4 lg:w-auto">
                  <ShimmerButton
                    asChild
                    type="button"
                    background="#ffffff"
                    shimmerColor="#51623D"
                    borderRadius="0px"
                    shimmerDuration="3s"
                    className="min-w-0 flex-1 gap-2 px-4 py-3 text-sm font-medium !text-brand sm:min-w-[210px] sm:flex-none sm:gap-3 sm:px-10 sm:text-base"
                  >
                    <Link href="/phytoaestetica?service=face" scroll={false}>
                      <ScanFace className="size-4 sm:size-5" />
                      {tn('face')}
                    </Link>
                  </ShimmerButton>
                  <Link
                    href="/phytoaestetica?service=body"
                    scroll={false}
                    className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 border border-white/60 px-4 py-3 text-sm font-medium whitespace-nowrap text-white transition-colors hover:border-white hover:bg-white/10 sm:min-w-[210px] sm:flex-none sm:gap-3 sm:px-10 sm:text-base"
                  >
                    <PersonStanding className="size-4 sm:size-5" />
                    {tn('body')}
                  </Link>
                </div>
              ) : (
                <ShimmerButton
                  asChild
                  type="button"
                  background="#ffffff"
                  shimmerColor="#51623D"
                  borderRadius="0px"
                  shimmerDuration="3s"
                  className="shrink-0 px-8 py-4 text-sm font-medium !text-brand"
                >
                  <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">
                    {t('cta.button')}
                    <ArrowRight className="size-4" />
                  </a>
                </ShimmerButton>
              )}
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
