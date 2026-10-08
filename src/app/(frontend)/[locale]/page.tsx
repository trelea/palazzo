import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import {
  ArrowRight,
  Award,
  Dumbbell,
  Eye,
  Heart,
  HeartPulse,
  Leaf,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'

import { pageMetadata } from '@/lib/seo'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { BOOKING_LINK, CONTACT } from '@/lib/site'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { AppointmentCta } from '@/components/appointment-cta'
import { PartnersSection } from '@/components/partners-section'
import { SectionTitle } from '@/components/section-title'
import { FacebookIcon, InstagramIcon } from '@/components/social-icons'
import { Reveal } from '@/components/reveal'
import { DotTexture } from '@/components/dot-texture'
import { GridBackdrop } from '@/components/grid-backdrop'
import { ShimmerButton } from '@/components/ui/shimmer-button'

import { BorderBeam } from '@/components/ui/border-beam'
import { Particles } from '@/components/ui/particles'
import { ShineBorder } from '@/components/ui/shine-border'

/** Homepage has its own purpose-written snippet; copy lives under `Meta.home`. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Meta.home' })
  return pageMetadata({
    locale,
    path: '/',
    title: t('title'),
    description: t('description'),
    fullTitle: true,
  })
}

/** Olive/sage palette derived from the brand colour (#51623D) for the aurora accent. */
const AURORA_COLORS = ['#51623D', '#7a8c54', '#9bb06f', '#51623D']

/** Maximum character length for service card descriptions before truncation. */
const MAX_DESC_LENGTH = 384

/** Truncate a string to MAX_DESC_LENGTH characters, appending "..." if it exceeds the limit. */
function truncateDesc(text: string): string {
  return text.length > MAX_DESC_LENGTH ? text.slice(0, MAX_DESC_LENGTH).trimEnd() + '...' : text
}

/**
 * The three service cards in the Services section — Face, Body, Impacco.
 *
 * Deliberately NOT `SERVICE_LINKS` (from `@/lib/site`): that list is shared
 * with the nav, footer, the services menus and the Cal.com booking dialog, and
 * it models *disciplines*. Face and Body are body areas within Phyto-Esthetics,
 * not separate disciplines, and they have no Cal.com event type of their own —
 * so folding them into `ServiceKey` would have broken the picker and forced me
 * to invent event slugs. `bookKey` is therefore the discipline a card's button
 * actually books: Face and Body both open Phyto-Esthetics, Impacco opens
 * Phytotherapy.
 *
 * `labelKey` points into the `hero` namespace, where `linkFace` / `linkBody` /
 * `linkImpacco` already exist in all three locales — the hero buttons and these
 * cards are meant to name the same three things. `href` powers each card's
 * "Discover" button; Face and Body deep-link via `?service=face|body`, matching
 * the hero buttons.
 *
 * KNOWN GAP: those two anchors have no matching `id` anywhere on the
 * phytoaestetica page yet, so those buttons navigate correctly but currently
 * land at the top of the page instead of jumping to a section. The hero's two
 * buttons have the same dead anchors — adding the `id`s fixes all four at once.
 */
const HOME_SERVICE_CARDS = [
  {
    labelKey: 'linkFace',
    descKey: 'services.faceDesc',
    focusKey: 'services.faceFocus',
    img: '/face.jpg',
    href: '/phytoaestetica?service=face',
    bookKey: 'phytoaestetica',
  },
  {
    labelKey: 'linkBody',
    descKey: 'services.bodyDesc',
    focusKey: 'services.bodyFocus',
    img: '/body.jpg',
    href: '/phytoaestetica?service=body',
    bookKey: 'phytoaestetica',
  },
  {
    labelKey: 'linkImpacco',
    descKey: 'services.impaccoDesc',
    focusKey: 'services.impaccoFocus',
    img: '/herbal-pack.jpg',
    href: '/phytotherapy',
    bookKey: 'impacco',
  },
] as const

/** Social profiles surfaced in the homepage CTA — copy is platform-neutral. */
const SOCIAL_LINKS = [
  { key: 'instagram', label: 'Instagram', href: CONTACT.social.instagram, Icon: InstagramIcon },
  { key: 'facebook', label: 'Facebook', href: CONTACT.social.facebook, Icon: FacebookIcon },
] as const

/** The hero's three category entry points, in a single row — the same trio the
    Services section presents as cards. Labels resolve via the `hero` namespace
    (they are localized, unlike the Italian brand terms); only the destinations
    are locale-agnostic paths for the next-intl `Link`. */
const HERO_CATEGORY_LINKS = [
  { labelKey: 'linkFace', href: '/phytoaestetica?service=face', Icon: Sparkles },
  { labelKey: 'linkBody', href: '/phytoaestetica?service=body', Icon: Dumbbell },
  // "Impacco" is the herbal blend's own name (see `HomePage.featured.title`),
  // not a descriptor — so it stays untranslated in every locale, alongside the
  // Italian motto. Only the `href` is locale-agnostic; `labelKey` resolves here.
  // `span: 2` puts it alone on the second row, `tone` sets it apart from the
  // two phytoaesthetics routes above it.
  { labelKey: 'linkImpacco', href: '/phytotherapy', Icon: Leaf, span: 2, tone: 'ghost' },
] satisfies readonly {
  labelKey: 'linkFace' | 'linkBody' | 'linkImpacco'
  href: string
  Icon: typeof Sparkles
  /** Grid columns to span — `2` puts the button alone on its own row. */
  span?: number
  /** `ghost` renders an outlined button that fills with the brand on hover. */
  tone?: 'ghost'
}[]

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
    // Phones get the full smallest viewport (`svh` excludes mobile browser
    // chrome, so nothing hides behind the address bar); desktop keeps 90vh since
    // the taller copy column benefits from the shorter target.
    <section className="relative isolate flex min-h-[100svh] items-start overflow-hidden bg-background lg:min-h-[90vh] lg:items-center">
      {/* Ambient animated grid behind the copy. On phones it floats just above the
          full-bleed photo (-z-10) so it stays visible; on desktop it drops behind
          the photo (lg:-z-20, earlier in the DOM) so the photo paints over it on
          the right while the grid shows behind the copy on the left. */}
      <GridBackdrop className="-z-10 lg:-z-20" />

      {/* Photo — full-bleed on mobile, the right half on large screens. The
          centred max-w-7xl wrapper below puts its own midpoint at 50vw, so the
          split lands exactly on the copy column's edge at every wide viewport. */}
      <div className="absolute inset-y-0 right-0 -z-20 w-full lg:w-1/2">
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

      {/* pt-20 clears the 64px mobile navbar with 16px to spare — the old pt-28
          ate a third of a short phone's viewport. */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-0">
        <div className="max-w-xl lg:max-w-[42rem]">
          <Reveal delay={0.1}>
            <h1 className="font-heading text-4xl leading-[1.05] font-medium tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl">
              {t('headline')} <AccentText className="font-medium">{t('headlineAccent')}</AccentText>
            </h1>
          </Reveal>

          <Reveal delay={0.25}>
            {/* Lead line states the new perspective; the two paragraphs that follow
                expand it, so they sit a step down in size and contrast. Type is a
                step smaller on phones (`text-base`) — three paragraphs plus three
                stacked buttons otherwise overflow a 667px viewport by ~200px. */}
            <p className="mt-5 text-lg leading-snug text-pretty font-medium text-foreground sm:mt-6 sm:text-xl">
              {t('subtitleLead')}
            </p>
            <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground sm:mt-5 sm:text-lg">
              {t('subtitleBody1')}
            </p>
            <p className="mt-3 text-base leading-relaxed text-pretty text-muted-foreground sm:mt-4 sm:text-lg">
              {t('subtitleBody2')}
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            {/* Three category entry points — parallel routes, not a
                primary/secondary pair, but Impacco points at the phytotherapy
                page rather than phytoaesthetics, so it sits alone on row 2 as an
                outlined ghost that fills with the brand on hover. Two columns at
                every size: `col-span-2` puts Impacco on its own row, and grid
                (not flex) is what keeps the widths equal — flex would size each
                to its own label. */}
            <div className="mt-7 grid grid-cols-2 gap-2.5 sm:mt-9 sm:gap-3">
              {HERO_CATEGORY_LINKS.map(({ labelKey, href, Icon, span, tone }) => {
                const inner = (
                  <Link
                    href={href}
                    scroll={href.includes('service=') ? false : undefined}
                    className="flex items-center justify-center gap-2"
                  >
                    <Icon className="size-3.5 shrink-0 sm:size-4" strokeWidth={1.75} />
                    {t(labelKey)}
                  </Link>
                )

                // Shared sizing so the shimmer and ghost variants stay aligned.
                const sizing = cn(
                  'px-5 py-2.5 text-sm font-medium tracking-[0.12em] uppercase sm:px-6 sm:py-3',
                  span === 2 && 'col-span-2',
                )

                // Only Impacco is a ghost; Face and Body keep the brand-filled
                // ShimmerButton they had before.
                if (tone === 'ghost') {
                  return (
                    <Button
                      key={href}
                      asChild
                      variant="outline"
                      className={cn(
                        sizing,
                        'h-auto rounded-none border-brand/30 text-foreground hover:bg-brand hover:text-brand-foreground',
                      )}
                    >
                      {inner}
                    </Button>
                  )
                }

                return (
                  <ShimmerButton
                    key={href}
                    asChild
                    background="var(--brand)"
                    shimmerColor="#ffffff"
                    borderRadius="0px"
                    shimmerDuration="3s"
                    className={sizing}
                  >
                    {inner}
                  </ShimmerButton>
                )
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Brand intro ───────────────────────── */

/** The three closing promises, rendered as shine pills under the intro copy. */
const INTRO_VALUES = [
  { key: 'individual', Icon: Eye },
  { key: 'attention', Icon: Heart },
  { key: 'value', Icon: Sparkles },
] as const

function Intro() {
  const t = useTranslations('HomePage.intro')
  const ta = useTranslations('HomeImgAlt')

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
                alt={ta('room')}
                className="size-full object-cover"
              />
              <BorderBeam size={120} duration={11} colorFrom="#51623D" colorTo="#9bb06f" />
            </div>

            {/* Secondary — the framed "fisioterapia" gallery wall, tilted, overlapping.
                Hangs off the LEFT edge, mirroring the tilt. Unlike the old right-hand
                lean there is no grid gutter to borrow — the collage sits against the
                container's horizontal padding (px-4 / sm:px-6 / lg:px-8) and the
                section is overflow-hidden, so the offsets stay small enough that the
                frame is never clipped at the viewport edge. */}
            <figure className="absolute -bottom-8 -left-2 w-44 rotate-3 overflow-hidden rounded-2xl border border-white/70 bg-white p-1.5 shadow-2xl ring-1 ring-black/5 transition-transform duration-500 ease-out hover:rotate-0 sm:-left-4 sm:w-56 lg:-left-6 lg:w-60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/intro1.jpeg"
                alt={ta('gallery')}
                className="aspect-4/3 w-full rounded-xl object-cover"
              />
            </figure>
          </div>
        </Reveal>

        {/* ── Statement copy + closing promises ── */}
        <div className="lg:pl-4">
          <Reveal inView>
            <SectionTitle className="text-balance">{t('heading')}</SectionTitle>
          </Reveal>

          <Reveal delay={0.2} inView>
            <p className="mt-6 font-heading text-xl font-semibold tracking-tight text-balance text-foreground sm:text-2xl">
              {t('lead')}
            </p>
          </Reveal>

          <Reveal delay={0.3} inView>
            <div className="mt-6 max-w-xl space-y-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              <p>{t('belief')}</p>
              <p>{t('change')}</p>
              <p>{t('definition')}</p>
              <p>{t('closing')}</p>
            </div>
          </Reveal>

          <Reveal delay={0.4} inView>
            {/* Grid, not flex-wrap: the labels differ in length ("We look at it
                individually" vs "We bring out its best"), so content-sized pills
                came out visibly uneven. Equal columns lock all three to the same
                width, and grid rows stretch so the heights match too.
                Two columns from sm up, so the three pills break across two rows
                (2 + 1) instead of squeezing into one — three across left each
                column ~189px, which wrapped the longest label onto two lines.
                The lone pill in row 2 keeps the same half-width as the pair
                above rather than spanning, so all three stay identical.
                One column on phones, where even half the screen is too narrow.
                ShineBorder is absolute, so it stays out of the flow when the
                <li> becomes a flex container. */}
            <ul className="mt-10 grid gap-3 border-t border-brand/10 pt-8 sm:grid-cols-2">
              {INTRO_VALUES.map(({ key, Icon }) => (
                <li
                  key={key}
                  className="group relative flex items-center justify-center overflow-hidden rounded-none border border-brand/15 bg-background px-4 py-2.5 text-center transition-colors hover:bg-brand"
                >
                  <ShineBorder shineColor={['#51623D', '#9bb06f']} duration={14} />
                  <span className="relative flex items-center gap-2 text-sm font-medium tracking-wide text-brand transition-colors group-hover:text-brand-foreground">
                    <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                    {t(`values.${key}`)}
                  </span>
                </li>
              ))}
            </ul>
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Centred intro block: the all-caps title states the single philosophy,
            the two blocks below explain it and lead into the cards. The body is
            ONE paragraph — the closing line about the philosophy taking different
            forms used to be its own <p> and read as a stray orphan, so it is
            folded into descBody. `text-pretty` overrides the inherited
            `text-center` locally so the centred text doesn't develop ragged
            edges, while `descLead` is promoted to the display face so the two
            blocks don't read as one flat slab. */}
        <Reveal inView>
          <div className="mx-auto max-w-3xl text-center">
            {/* Two block-level spans, NOT two headings: the section still has exactly one
                <h2> for SEO and screen readers, but the sentence is forced onto
                two rows. Translated text can't be wrapped at a fixed word, so the
                break has to live in the message files — the split is per-locale
                (en "Three ways…", ro "Trei moduri…", ru "Три способа…") rather
                than assuming English word order. */}
            <SectionTitle className="uppercase">
              <span className="block">{t('services.titleLine1')}</span>
              <span className="block">{t('services.titleLine2')}</span>
            </SectionTitle>
            <p className="mt-6 font-heading text-lg font-semibold text-foreground sm:text-xl">
              {t('services.descLead')}
            </p>
            <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
              {t('services.descBody')}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 space-y-6">
          {/* Three service containers — one continuous flow from photo (0%) into a
              solid brand panel (100%) where the top-aligned copy sits. */}
          {HOME_SERVICE_CARDS.map((card, i) => {
            const reversed = i % 2 === 1
            return (
              <Reveal key={card.labelKey} delay={0.1 * i} inView>
                <Card
                  className={cn(
                    'group relative isolate flex flex-col overflow-hidden rounded-none border-brand/20 p-0 text-brand-foreground shadow-sm lg:h-120 lg:flex-row',
                    reversed
                      ? 'bg-gradient-to-bl from-brand via-brand to-[#7a8c54]'
                      : 'bg-gradient-to-br from-brand via-brand to-[#7a8c54]',
                  )}
                >
                  {/* Photo (0%) — masked so it dissolves into the card's own gradient. */}
                  <div
                    className={cn(
                      'relative aspect-4/3 w-full shrink-0 overflow-hidden sm:aspect-16/9 lg:aspect-auto lg:h-auto lg:w-1/2',
                      reversed && 'lg:order-2',
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.img}
                      alt={t(`hero.${card.labelKey}`)}
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
                      {t(`hero.${card.labelKey}`)}
                    </h3>
                    <p className="mt-3 max-w-md text-base leading-relaxed text-brand-foreground/80">
                      {truncateDesc(t(card.descKey))}
                    </p>

                    <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-4">
                      <div>
                        <dt className="text-[0.7rem] font-medium tracking-[0.15em] text-brand-foreground/55 uppercase">
                          {t('services.serviceLabel')}
                        </dt>
                        <dd className="mt-2 inline-flex bg-white/10 px-3 py-1.5 text-sm font-medium text-brand-foreground">
                          {tn(card.bookKey)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[0.7rem] font-medium tracking-[0.15em] text-brand-foreground/55 uppercase">
                          {t('services.focusLabel')}
                        </dt>
                        <dd className="mt-2 inline-flex bg-white/10 px-3 py-1.5 text-sm font-medium text-brand-foreground">
                          {t(card.focusKey)}
                        </dd>
                      </div>
                    </dl>

                    {/* Book (primary, navigates to external booking page) beside
                        Discover (navigates). `mt-5` lives on the wrapper so both
                        buttons share one top margin. `flex-wrap` keeps them from
                        overflowing the card's single-column mobile layout. */}
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <Button
                        asChild
                        variant="secondary"
                        className="h-auto rounded-none px-6 py-2.5 text-sm font-medium"
                      >
                        <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">
                          {tn('book')}
                        </a>
                      </Button>
                      {/* `asChild` so the next-intl Link supplies the href and
                          Button only supplies styling.
                          Was `ghost`, which left it invisible at rest — a real
                          clickable target you can't see until hover. `outline`
                          gives it a permanent border so it reads as a button,
                          but recoloured for the brand panel: stock outline uses
                          `border-border`/`bg-background`/`hover:bg-muted`, which
                          on this dark gradient would be a dark border, a bright
                          fill and dark text. The border is `brand-foreground/45`
                          so it sits clearly on the green, and hover deepens to
                          the `bg-white/10` used by the pills above — still clearly
                          subordinate to the filled booking button next to it.
                          `group-hover/button:` nudges the arrow on hover, using
                          the Button's own `group/button` scope. */}
                      <Button
                        asChild
                        variant="outline"
                        className="h-auto gap-2 rounded-none border-brand-foreground/45 bg-transparent px-5 py-2.5 text-sm font-medium text-brand-foreground hover:border-brand-foreground hover:bg-white/10 hover:text-brand-foreground"
                      >
                        <Link
                          href={card.href}
                          scroll={card.href.includes('service=') ? false : undefined}
                        >
                          {t('services.discover')}
                          <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
                        </Link>
                      </Button>
                    </div>
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
              <Particles
                className="absolute inset-0"
                quantity={70}
                ease={80}
                size={0.6}
                color="#ffffff"
              />
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
                  {/* Body size (text-base / sm:text-lg) rather than the text-sm it
                      used to be — the sentence is the card's actual pitch, and at
                      14px it read as a footnote under the heading. */}
                  <p className="mt-4 text-base leading-relaxed text-brand-foreground/80 sm:text-lg">
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
                  <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">
                    {t('services.trialCta')}
                  </a>
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

/** The four proof points. The headline figures were removed from these cards —
    the icon carries the visual weight now — so only `Icon`, `labelKey` and
    `descKey` are left. `value`/`suffix` used to live here for `NumberTicker`,
    which this file no longer uses. */
const STATS = [
  { Icon: Award, labelKey: 'stats.yearsLabel', descKey: 'stats.yearsDesc' },
  { Icon: HeartPulse, labelKey: 'stats.treatmentsLabel', descKey: 'stats.treatmentsDesc' },
  { Icon: Users, labelKey: 'stats.clientsLabel', descKey: 'stats.clientsDesc' },
  { Icon: Star, labelKey: 'stats.satisfactionLabel', descKey: 'stats.satisfactionDesc' },
] as const

function Stats() {
  const t = useTranslations('HomePage')

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal inView>
        <div className="max-w-2xl">
          <SectionTitle>{t('stats.title')}</SectionTitle>
          <p className="mt-4 text-muted-foreground">{t('stats.subtitle')}</p>
        </div>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <Reveal key={stat.labelKey} delay={0.1 + i * 0.1} inView>
            {/* One block, top-aligned. The former icon-over-figure / label-over-description
                split is gone: with the headline figure removed the top half was
                dead space, and the `border-t` divider only made that emptiness
                more obvious. Content stays top-aligned rather than
                `justify-between` so icon → label → description reads as a single
                unit — the grid's default `stretch` still equalises card heights.
                `text-balance`/`text-pretty` earn their keep on narrow, centred
                cards. */}
            <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-muted to-[#7a8c54] p-8 text-center text-brand-foreground shadow-sm sm:p-9">
              {/* `self-center` is what actually centres the chip. The Card is
                  `flex flex-col`, so the span is a flex item and the inherited
                  `text-center` never reaches it — `text-align` only aligns inline
                  content inside a block. Its explicit `size-*` also stops flexbox
                  stretching it, leaving it pinned to flex-start (hard left) under
                  centred text. Deliberately NOT `items-center` on the Card: that
                  would shrink-wrap the two <p> elements too and change how they
                  wrap. Scoped to the one element that needs it. */}
              <span className="inline-flex size-24 items-center justify-center self-center rounded-full bg-white/10 text-brand-foreground">
                {/* strokeWidth drops to 1.25 as the glyph doubles: at size-12 a
                    1.5 stroke reads noticeably heavier than it did at size-8. */}
                <stat.Icon className="size-12" strokeWidth={1.25} />
              </span>
              <p className="mt-6 font-heading text-xl font-normal text-balance text-brand-foreground sm:text-2xl">
                {t(stat.labelKey as 'stats.yearsLabel')}
              </p>
              <p className="mt-3 text-base leading-relaxed font-light text-pretty text-brand-foreground/70">
                {t(stat.descKey as 'stats.yearsDesc')}
              </p>
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
  const ta = useTranslations('HomeImgAlt')

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
            <SectionTitle className="mt-5">{t('title')}</SectionTitle>
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

        <Reveal direction="left" inView>
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-brand/15 shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/herbal-pack.jpg"
              alt={ta('herbalPack')}
              className="size-full object-cover object-center"
            />
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
  const ta = useTranslations('HomeImgAlt')

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal direction="right" inView>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-brand/15 shadow-xl lg:aspect-4/3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/our-story.jpg"
              alt={ta('brochures')}
              className="size-full object-cover object-center"
            />
            <BorderBeam size={120} duration={11} colorFrom="#51623D" colorTo="#9bb06f" />
          </div>
        </Reveal>

        <Reveal direction="left" inView>
          <div>
            <SectionTitle>{t('heading')}</SectionTitle>
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
  const ta = useTranslations('HomeImgAlt')

  return (
    <section className="relative isolate overflow-hidden bg-brand-subtle/30 py-20 lg:py-32">
      <DotTexture />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal inView>
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:justify-center lg:gap-12">
            {/* Tilted brand photo — sits left on desktop, on top when stacked. */}
            <Polaroid
              src="/eba1.jpg"
              alt={ta('therapist')}
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
              <SectionTitle className="mt-5">{t('heading')}</SectionTitle>
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
              alt={ta('remedies')}
              className="w-64 shrink-0 rotate-6 sm:w-72 lg:w-[20rem] xl:w-[24rem]"
            />
          </div>
        </Reveal>
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
      <PartnersSection />
      <AppointmentCta className="pt-16 lg:pt-24" />
    </>
  )
}
