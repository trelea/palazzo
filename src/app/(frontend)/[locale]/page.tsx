import { useTranslations } from 'next-intl'
import {
  ArrowRight,
  Award,
  FlaskConical,
  HeartPulse,
  Leaf,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { SERVICE_LINKS, CONTACT, type ServiceKey } from '@/lib/site'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { AppointmentCta } from '@/components/appointment-cta'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Marquee } from '@/components/ui/marquee'
import { BorderBeam } from '@/components/ui/border-beam'
import { Particles } from '@/components/ui/particles'

/** Olive/sage palette derived from the brand colour (#51623D) for the aurora accent. */
const AURORA_COLORS = ['#51623D', '#7a8c54', '#9bb06f', '#51623D']

/** Per-service presentation metadata. Copy lives in the `HomePage` i18n namespace. */
const SERVICE_META: Record<
  ServiceKey,
  { Icon: typeof Leaf; descKey: string; img: string; focusKey: string }
> = {
  physiotherapy: {
    Icon: HeartPulse,
    descKey: 'services.physiotherapyDesc',
    img: '/physiotherapy-service.jpg',
    focusKey: 'services.physiotherapyFocus',
  },
  phytotherapy: {
    Icon: Leaf,
    descKey: 'services.phytotherapyDesc',
    img: '/phytotherapy-service.jpg',
    focusKey: 'services.phytotherapyFocus',
  },
}

/** lucide v1 dropped the brand glyph, so we inline Instagram's mark (matches footer). */
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Facebook brand mark, inlined for the same reason as Instagram's (matches footer). */
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14 9h2.5l.5-3H14V4.5c0-.86.28-1.5 1.6-1.5H17V.3A22 22 0 0 0 14.9 0C12.6 0 11 1.34 11 4.05V6H8.5v3H11v9h3V9Z" />
    </svg>
  )
}

/** Social profiles surfaced in the homepage CTA — copy is platform-neutral. */
const SOCIAL_LINKS = [
  { key: 'instagram', label: 'Instagram', href: CONTACT.social.instagram, Icon: InstagramIcon },
  { key: 'facebook', label: 'Facebook', href: CONTACT.social.facebook, Icon: FacebookIcon },
] as const

/** Soft radial-dot texture, reused across image-less sections (see footer). */
function DotTexture() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 text-brand opacity-[0.05] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:18px_18px]"
    />
  )
}

/**
 * Server-rendered entrance animation (CSS only, no client JS) — drop-in
 * replacement for Magic UI's client `BlurFade`. Plays on load via
 * tw-animate-css utilities; `delay` is in seconds to match the old API.
 */
function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  /** Accepted for call-site compatibility; CSS reveal plays on load. */
  inView?: boolean
}) {
  const slide = {
    up: 'slide-in-from-bottom-3',
    down: 'slide-in-from-top-3',
    left: 'slide-in-from-right-4',
    right: 'slide-in-from-left-4',
  }[direction]

  return (
    <div
      className={cn('animate-in fade-in-0 fill-mode-both duration-700 ease-out', slide, className)}
      style={delay ? { animationDelay: `${delay * 1000}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/**
 * Server-rendered gradient text — inlines Magic UI's `AuroraText` markup so it
 * needs no client boundary. Animation runs via the `animate-aurora` keyframes
 * defined in globals.css.
 */
function AccentText({
  children,
  colors = AURORA_COLORS,
  className,
}: {
  children: React.ReactNode
  colors?: string[]
  className?: string
}) {
  return (
    <span className={cn('relative inline-block', className)}>
      <span className="sr-only">{children}</span>
      <span
        aria-hidden="true"
        className="animate-aurora relative bg-size-[200%_auto] bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(135deg, ${colors.join(', ')}, ${colors[0]})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animationDuration: '10s',
        }}
      >
        {children}
      </span>
    </span>
  )
}

/* ─────────────────────────── Hero ─────────────────────────── */

function Hero() {
  const t = useTranslations('HomePage.hero')

  return (
    <section className="relative isolate flex min-h-[90vh] items-start overflow-hidden bg-background lg:items-center">
      {/* Photo — full-bleed on mobile, confined to the right ~58% on large screens */}
      <div className="absolute inset-y-0 right-0 -z-20 w-full lg:w-[58%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero.jpg"
          alt=""
          aria-hidden="true"
          className="size-full object-cover object-center"
        />
        {/*
          Smooth multi-stop fade from the page background into the image.
          Mobile keeps a gentle wash across the whole width for legibility;
          large screens hold the background briefly then ease to transparent,
          revealing the right portion of the photo.
        */}
        <div aria-hidden="true" className="absolute inset-0 hero-fade-y lg:hero-fade-x" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pt-28 sm:px-6 lg:px-8 lg:pt-0">
        <div className="max-w-xl">
          <Reveal delay={0.1}>
            <h1 className="font-heading text-5xl leading-[1.05] font-medium tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl">
              {t('headline')}{' '}
              <AccentText className="font-medium">{t('headlineAccent')}</AccentText>
            </h1>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
              {t('subtitle')}
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ShimmerButton
                asChild
                background="var(--brand)"
                shimmerColor="#ffffff"
                borderRadius="0px"
                shimmerDuration="3s"
                className="w-full px-7 py-3 text-sm font-medium sm:w-auto"
              >
                <Link href="/contacts">{t('ctaBook')}</Link>
              </ShimmerButton>
              <Button
                asChild
                variant="ghost"
                className="h-auto w-full justify-center rounded-none px-7 py-3 text-sm text-foreground hover:bg-muted sm:w-auto"
              >
                <Link href="/about-us">
                  {t('ctaLearn')}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Brand intro ───────────────────────── */

/** The two disciplines Palazzo is built on — paired with a one-line descriptor. */
const INTRO_PILLARS = [
  { key: 'physiotherapy', Icon: HeartPulse, lineKey: 'physioLine' },
  { key: 'phytotherapy', Icon: Leaf, lineKey: 'phytoLine' },
] as const

function Intro() {
  const t = useTranslations('HomePage.intro')
  const tn = useTranslations('Nav')

  return (
    <section className="relative isolate overflow-hidden py-24 lg:py-32">
      {/* Soft brand glow anchored to the image side — keeps the section calm. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -left-24 -z-10 size-[34rem] -translate-y-1/2 rounded-full bg-brand/5 blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl items-start gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        {/* ── Image collage — modern room layered with the legacy gallery wall ── */}
        <Reveal direction="right" inView className="order-last lg:order-first">
          <div className="relative mx-auto max-w-md lg:mx-0 lg:max-w-none">
            {/* Primary — the modern, evidence-led treatment room. */}
            <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-brand/15 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/intro2.jpeg"
                alt="A modern Palazzo Aesthetics treatment room"
                className="size-full object-cover"
              />
              <BorderBeam size={120} duration={11} colorFrom="#51623D" colorTo="#9bb06f" />
            </div>

            {/* Secondary — the framed "fisioterapia" gallery wall, tilted, overlapping. */}
            <figure className="absolute -bottom-10 -right-4 w-52 -rotate-3 overflow-hidden rounded-2xl border border-white/70 bg-white p-1.5 shadow-2xl ring-1 ring-black/5 transition-transform duration-500 ease-out hover:rotate-0 sm:-right-10 sm:w-72">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/intro1.jpeg"
                alt="Framed physiotherapy illustrations on the clinic wall"
                className="aspect-4/3 w-full rounded-xl object-cover"
              />
            </figure>
          </div>
        </Reveal>

        {/* ── Editorial copy + discipline pillars ── */}
        <div className="lg:pl-4">
          <Reveal inView>
            <h2 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
              <AccentText>{t('heading')}</AccentText>
            </h2>
          </Reveal>

          <Reveal delay={0.2} inView>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
              {t('body')}
            </p>
          </Reveal>

          <Reveal delay={0.3} inView>
            <div className="mt-10 space-y-px overflow-hidden rounded-2xl border border-brand/10 bg-card/40 backdrop-blur-sm">
              {INTRO_PILLARS.map(({ key, Icon, lineKey }) => (
                <div
                  key={key}
                  className="flex items-start gap-4 border-b border-brand/10 px-6 py-5 last:border-b-0"
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-heading text-base font-medium text-foreground">{tn(key)}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {t(lineKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── Services ─────────────────────────── */

function Services() {
  const t = useTranslations('HomePage')
  const tn = useTranslations('Nav')

  return (
    <section className="relative isolate overflow-hidden bg-brand-subtle/30 py-20 lg:py-28">
      <DotTexture />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal inView>
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t('services.title')}
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 space-y-6">
          {/* Two service containers — one continuous flow from photo (0%) into a
              solid brand panel (100%) where the top-aligned copy sits. */}
          {SERVICE_LINKS.map((service, i) => {
            const { descKey, img, focusKey } = SERVICE_META[service.key]
            const reversed = i % 2 === 1
            return (
              <Reveal key={service.href} delay={0.1 * i} inView>
                <Card
                  className={cn(
                    'group relative isolate flex flex-col overflow-hidden rounded-none border-brand/20 p-0 text-brand-foreground shadow-sm lg:flex-row',
                    reversed
                      ? 'bg-gradient-to-bl from-brand via-brand to-[#7a8c54]'
                      : 'bg-gradient-to-br from-brand via-brand to-[#7a8c54]',
                  )}
                >
                  {/* Photo (0%) — masked so it dissolves into the card's own gradient. */}
                  <div
                    className={cn(
                      'relative h-36 w-full shrink-0 overflow-hidden sm:h-44 lg:h-auto lg:w-1/2',
                      reversed && 'lg:order-2',
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={tn(service.key)}
                      className={cn(
                        'size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105',
                        '[mask-image:linear-gradient(to_bottom,#000_45%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,#000_45%,transparent)]',
                        reversed
                          ? 'lg:[mask-image:linear-gradient(to_left,#000_45%,transparent)] lg:[-webkit-mask-image:linear-gradient(to_left,#000_45%,transparent)]'
                          : 'lg:[mask-image:linear-gradient(to_right,#000_45%,transparent)] lg:[-webkit-mask-image:linear-gradient(to_right,#000_45%,transparent)]',
                      )}
                    />
                  </div>

                  {/* Copy (100%) — top-aligned, no icons. */}
                  <div
                    className={cn(
                      'relative z-10 flex flex-col items-start p-7 sm:p-9 lg:w-1/2 lg:p-10',
                      reversed && 'lg:order-1',
                    )}
                  >
                    <h3 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                      {tn(service.key)}
                    </h3>
                    <p className="mt-3 max-w-md text-base leading-relaxed text-brand-foreground/80">
                      {t(descKey)}
                    </p>

                    <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-4">
                      <div>
                        <dt className="text-[0.7rem] font-medium tracking-[0.15em] text-brand-foreground/55 uppercase">
                          {t('services.serviceLabel')}
                        </dt>
                        <dd className="mt-2 inline-flex bg-white/10 px-3 py-1.5 text-sm font-medium text-brand-foreground">
                          {tn(service.key)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[0.7rem] font-medium tracking-[0.15em] text-brand-foreground/55 uppercase">
                          {t('services.focusLabel')}
                        </dt>
                        <dd className="mt-2 inline-flex bg-white/10 px-3 py-1.5 text-sm font-medium text-brand-foreground">
                          {t(focusKey)}
                        </dd>
                      </div>
                    </dl>

                    <Button
                      asChild
                      variant="secondary"
                      className="mt-5 h-auto rounded-none px-6 py-2.5 text-sm font-medium"
                    >
                      <Link href="/contacts">{tn('book')}</Link>
                    </Button>
                  </div>

                  <BorderBeam size={150} duration={12} colorFrom="#ffffff" colorTo="#9bb06f" />
                </Card>
              </Reveal>
            )
          })}

          {/* Third container — book an appointment, with drifting particles. */}
          <Reveal delay={0.2} inView>
            <Card className="relative isolate overflow-hidden rounded-none border-brand/20 bg-gradient-to-br from-brand via-brand-muted to-[#9bb06f] text-brand-foreground shadow-sm">
              {/* Ambient field — white particles drift over the brand gradient. */}
              <Particles className="absolute inset-0" quantity={70} ease={80} size={0.6} color="#ffffff" />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -bottom-24 size-80 rounded-full bg-white/5 blur-3xl"
              />

              <div className="relative z-10 flex flex-col items-start gap-8 p-9 sm:p-12 lg:flex-row lg:items-center lg:justify-between lg:p-14">
                <div className="max-w-xl">
                  <p className="font-heading text-xs font-semibold tracking-[0.3em] text-brand-foreground/55 uppercase">
                    Palazzo Aesthetics
                  </p>
                  <h3 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                    {t('services.trialTitle')}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-brand-foreground/80">
                    {t('services.trialDesc')}
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
                  <Link href="/contacts">{t('services.trialCta')}</Link>
                </ShimmerButton>
              </div>

              <BorderBeam size={180} duration={14} colorFrom="#ffffff" colorTo="#9bb06f" />
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── Stats ─────────────────────────── */

const STATS = [
  { value: 25, suffix: '+', Icon: Award, labelKey: 'stats.yearsLabel', descKey: 'stats.yearsDesc' },
  { value: 30, suffix: '+', Icon: HeartPulse, labelKey: 'stats.treatmentsLabel', descKey: 'stats.treatmentsDesc' },
  { value: 5000, suffix: '+', Icon: Users, labelKey: 'stats.clientsLabel', descKey: 'stats.clientsDesc' },
  { value: 98, suffix: '%', Icon: Star, labelKey: 'stats.satisfactionLabel', descKey: 'stats.satisfactionDesc' },
] as const

function Stats() {
  const t = useTranslations('HomePage')

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal inView>
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            {t('stats.title')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('stats.subtitle')}</p>
        </div>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <Reveal key={stat.labelKey} delay={0.1 + i * 0.1} inView>
            <Card className="flex h-full min-h-64 flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-muted to-[#7a8c54] p-0 text-center text-brand-foreground shadow-sm">
              {/* UP — icon + the headline figure */}
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 sm:p-9">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-brand-foreground">
                  <stat.Icon className="size-5" strokeWidth={1.5} />
                </span>
                <div className="font-heading text-4xl font-light tracking-tight sm:text-5xl">
                  <NumberTicker value={stat.value} className="text-brand-foreground" />
                  {stat.suffix}
                </div>
              </div>
              {/* BOTTOM — title + paragraph */}
              <div className="border-t border-white/10 bg-white/5 p-7">
                <p className="font-heading text-xl font-normal text-brand-foreground sm:text-2xl">
                  {t(stat.labelKey as 'stats.yearsLabel')}
                </p>
                <p className="mt-3 text-base leading-relaxed font-light text-brand-foreground/70">
                  {t(stat.descKey as 'stats.yearsDesc')}
                </p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────── Featured highlight ───────────────────── */

function Featured() {
  const t = useTranslations('HomePage.featured')

  return (
    <section className="relative isolate overflow-hidden bg-brand-subtle/30 py-20 lg:py-28">
      <DotTexture />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal direction="right" inView>
          <div>
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-none border border-brand/15 bg-background px-4 py-1.5 text-brand"
            >
              <ShieldCheck className="size-3.5" />
              {t('eyebrow')}
            </Badge>
            <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-pretty text-muted-foreground">
              {t('body')}
            </p>
            <Button
              asChild
              className="mt-8 h-auto rounded-none bg-brand px-6 py-3 text-sm text-brand-foreground hover:bg-brand-muted"
            >
              <Link href="/phytotherapy">
                {t('cta')}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Reveal>

        {/* Decorative panel — swap for a real product/treatment photo later */}
        <Reveal direction="left" inView>
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-brand/15 bg-gradient-to-br from-brand/15 via-brand-subtle to-background">
            {/* TODO: replace with generated hero photo, e.g. /featured.jpg */}
            <div className="absolute inset-0 flex items-center justify-center">
              <FlaskConical className="size-24 text-brand/35" strokeWidth={1} />
            </div>
            <Award className="absolute top-6 left-6 size-9 text-brand/40" strokeWidth={1.25} />
            <Leaf className="absolute right-8 bottom-8 size-12 text-brand/30" strokeWidth={1} />
            <BorderBeam size={120} duration={10} colorFrom="#51623D" colorTo="#9bb06f" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────────── Our story ─────────────────────────── */

function Story() {
  const t = useTranslations('HomePage.story')

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Decorative panel — swap for a real heritage photo later */}
        <Reveal direction="right" inView>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-brand/15 bg-gradient-to-tr from-brand-subtle via-background to-brand/10 lg:aspect-4/3">
            {/* TODO: replace with generated "our story" photo, e.g. /story.jpg */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf className="size-28 text-brand/30" strokeWidth={0.75} />
            </div>
          </div>
        </Reveal>

        <Reveal direction="left" inView>
          <div>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t('heading')}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-pretty text-foreground/90">
              {t('lead')}
            </p>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>{t('body1')}</p>
              <p>{t('body2')}</p>
              <p>{t('body3')}</p>
            </div>
            <p className="mt-7 font-heading text-lg font-semibold tracking-wide text-brand uppercase">
              {t('motto')}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────────── Social ─────────────────────────── */

/**
 * A tilted, white-framed photo — the "polaroid" used to scatter the two
 * brand images around the social CTA. Rotation/position come from `className`;
 * hover eases the tilt back to straight. `beam` adds a Magic UI accent.
 */
function Polaroid({
  src,
  alt,
  className,
  beam = false,
}: {
  src: string
  alt: string
  className?: string
  beam?: boolean
}) {
  return (
    <figure
      className={cn(
        'overflow-hidden rounded-2xl border border-white/70 bg-white p-2 shadow-xl ring-1 ring-black/5 transition-transform duration-500 ease-out hover:rotate-0',
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="aspect-square w-full object-cover" />
        {beam && <BorderBeam size={70} duration={9} colorFrom="#51623D" colorTo="#9bb06f" />}
      </div>
    </figure>
  )
}

function SocialCta() {
  const t = useTranslations('HomePage.instagram')

  return (
    <section className="relative isolate overflow-hidden bg-brand-subtle/30 py-20 lg:py-32">
      <DotTexture />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal inView>
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:justify-center lg:gap-12">
            {/* Tilted brand photo — sits left on desktop, on top when stacked. */}
            <Polaroid
              src="/eba1.jpg"
              alt="Physiotherapist treating a client at Palazzo Aesthetics"
              beam
              className="w-64 shrink-0 -rotate-6 sm:w-72 lg:w-[20rem] xl:w-[24rem]"
            />

            {/* Copy + dual social CTAs — kept clear of the photos for legibility. */}
            <div className="max-w-md text-center">
              <Badge
                variant="outline"
                className="mx-auto w-fit gap-1.5 rounded-none border-brand/20 bg-background/60 px-4 py-1.5 text-xs font-medium tracking-wide text-brand backdrop-blur-sm"
              >
                <InstagramIcon className="size-3.5" />
                @palazzo.aesthetics
              </Badge>
              <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
                {t('heading')}
              </h2>
              <p className="mx-auto mt-4 max-w-md text-pretty text-muted-foreground">{t('body')}</p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {SOCIAL_LINKS.map(({ key, label, href, Icon }) =>
                  key === 'instagram' ? (
                    <ShimmerButton
                      key={key}
                      asChild
                      background="var(--brand)"
                      shimmerColor="#ffffff"
                      borderRadius="0px"
                      shimmerDuration="3s"
                      className="px-6 py-3 text-sm font-medium"
                    >
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Palazzo Aesthetics on ${label}`}
                      >
                        <Icon className="size-4" />
                        {label}
                      </a>
                    </ShimmerButton>
                  ) : (
                    <Button
                      key={key}
                      asChild
                      variant="outline"
                      className="h-auto rounded-none border-brand/30 px-6 py-3 text-sm text-brand hover:bg-brand hover:text-brand-foreground"
                    >
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Palazzo Aesthetics on ${label}`}
                      >
                        <Icon className="size-4" />
                        {label}
                      </a>
                    </Button>
                  ),
                )}
              </div>
            </div>

            {/* Tilted brand photo — sits right on desktop, at the bottom when stacked. */}
            <Polaroid
              src="/eba2.jpg"
              alt="Natural phytotherapy remedies arranged in a heart"
              className="w-64 shrink-0 rotate-6 sm:w-72 lg:w-[20rem] xl:w-[24rem]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────────── Partners ─────────────────────────── */

const PARTNERS = ['North East 34079', 'Padel Academy', 'CrossFit Verona', 'Natura Vita', 'Officinalis']

function Partners() {
  const t = useTranslations('HomePage.partners')

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal inView>
        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {t('heading')}
        </h2>
      </Reveal>
      <div className="relative mt-10">
        <Marquee pauseOnHover className="[--duration:30s]">
          {PARTNERS.map((name) => (
            <div
              key={name}
              className="mx-2 flex h-16 min-w-44 items-center justify-center rounded-xl border border-border/60 bg-card px-8 font-heading text-sm font-medium tracking-wide text-muted-foreground"
            >
              {/* TODO: replace text chips with real partner logos */}
              {name}
            </div>
          ))}
        </Marquee>
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  )
}

/* ─────────────────────────── Page ─────────────────────────── */

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Services />
      <Stats />
      <Featured />
      <Story />
      <SocialCta />
      <Partners />
      <AppointmentCta />
    </>
  )
}
