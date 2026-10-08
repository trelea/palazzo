'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  CalendarCheck,
  Crown,
  Droplets,
  Dumbbell,
  Leaf,
  Mail,
  MessagesSquare,
  PersonStanding,
  ScanFace,
  Shapes,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sun,
  ThermometerSun,
  Waves,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'motion/react'
import { useSearchParams } from 'next/navigation'

import { cn } from '@/lib/utils'
import { BOOKING_LINK } from '@/lib/site'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { ContactDialog } from '@/components/contact-dialog'
import { SectionTitle } from '@/components/section-title'
import { BorderBeam } from '@/components/ui/border-beam'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type Universe = 'face' | 'body'

const UNIVERSES: readonly { key: Universe; Icon: LucideIcon }[] = [
  { key: 'face', Icon: ScanFace },
  { key: 'body', Icon: PersonStanding },
]

/** RE-GEN science cards — icons mirror the ingredient story. */
const SCIENCE: readonly { key: string; Icon: LucideIcon; className?: string }[] = [
  { key: 'ceramide', Icon: ShieldCheck },
  { key: 'peptide', Icon: MessagesSquare },
  {
    key: 'ozone',
    Icon: ThermometerSun,
    className: 'sm:col-span-2 lg:col-span-1 lg:row-span-2',
  },
  { key: 'hydro', Icon: Droplets },
  { key: 'bromelain', Icon: Leaf },
]

const FACE_PROCEDURES = ['grazia', 'armonia', 'rinascita', 'splendore', 'respiro'] as const

/** One icon per Face procedure — shown as a chip in the FAQ trigger. */
const FACE_ICONS: Partial<Record<string, LucideIcon>> = {
  grazia: Sparkles,
  armonia: Shapes,
  rinascita: Sun,
  splendore: Crown,
  respiro: Zap,
}
const BODY_PROCEDURES = [
  'grazia',
  'armonia',
  'vitalita',
  'slancio',
  'leggerezza',
  'splendore',
] as const

/** One icon per Body procedure — shown as a chip in the FAQ trigger. */
const BODY_ICONS: Partial<Record<string, LucideIcon>> = {
  grazia: Sparkles,
  armonia: Shapes,
  vitalita: Zap,
  slancio: Dumbbell,
  leggerezza: Waves,
  splendore: Crown,
}
const BODY_INTROS = ['intro1', 'intro2', 'intro3', 'intro4'] as const

const panelVariants = {
  enter: (direction: number) => ({ opacity: 0, x: 40 * direction, filter: 'blur(3px)' }),
  center: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: -40 * direction,
    filter: 'blur(3px)',
    transition: { duration: 0.18, ease: 'easeIn' as const },
  }),
}

function ProcedureAccordion({
  namespace,
  items,
  accordionId,
  icons,
}: {
  namespace: string
  items: readonly string[]
  accordionId: string
  icons?: Partial<Record<string, LucideIcon>>
}) {
  const t = useTranslations(namespace)
  return (
    <Accordion type="single" collapsible className="mt-8 border-y border-brand/15">
      {items.map((key) => {
        const Icon = icons?.[key]
        return (
          <AccordionItem key={key} value={`${accordionId}-${key}`}>
            <AccordionTrigger>
              {Icon && (
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
              )}
              <span>{t(`procedures.${key}.name`)}</span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                {t(`procedures.${key}.body`)}
              </p>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

/**
 * Centered booking CTA closing the procedures list for a universe, so the
 * booking action is right where the reader finishes the last procedure.
 */
function BookNowButton({ label }: { label: string }) {
  return (
    <div className="mt-10 flex justify-center">
      <ShimmerButton
        asChild
        type="button"
        background="var(--brand)"
        shimmerColor="#ffffff"
        borderRadius="0px"
        shimmerDuration="3s"
        className="w-full gap-2 px-8 py-3 text-sm font-medium sm:w-auto sm:gap-3 sm:px-10 sm:text-base"
      >
        <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">
          <CalendarCheck className="size-4 sm:size-5" />
          {label}
        </a>
      </ShimmerButton>
    </div>
  )
}

/**
 * "Discover our products" close-out for each universe — a soft, compact
 * invitation to the shop, pre-filtered to the tab the visitor is browsing
 * (face / body), with a secondary link to the full range.
 */
function DiscoverProducts({ universe }: { universe: Universe }) {
  const t = useTranslations(`ServicePages.phytoaestetica.${universe}`)
  return (
    <div id="phyto-products" className="py-12">
      <div className="relative isolate overflow-hidden rounded-3xl border border-brand/15 bg-brand-subtle/30 px-6 py-12 text-center sm:px-12">
        {/* Soft brand glow, anchored above the copy. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-72 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl"
        />

        <span className="mx-auto inline-flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <ShoppingBag className="size-6" strokeWidth={1.6} />
        </span>

        <SectionTitle className="mx-auto mt-5">{t('productsCta.heading')}</SectionTitle>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground">
          {t('productsCta.body')}
        </p>

        <div className="mx-auto mt-8 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <ShimmerButton
            asChild
            type="button"
            background="var(--brand)"
            shimmerColor="#ffffff"
            borderRadius="0px"
            shimmerDuration="3s"
            className="w-full gap-2 px-5 py-3 text-sm font-medium"
          >
            <Link href={`/shop?filter=${universe}`}>
              <ShoppingBag className="size-4" />
              {t('productsCta.button')}
            </Link>
          </ShimmerButton>
          <Link
            href="/shop"
            className="inline-flex w-full items-center justify-center gap-2 border border-brand/30 bg-transparent px-5 py-3 text-sm font-medium whitespace-nowrap text-brand transition-colors hover:border-brand hover:bg-brand/5"
          >
            {t('productsCta.all')}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function FacePanel() {
  const t = useTranslations('ServicePages.phytoaestetica.face')
  const tn = useTranslations('Nav')
  const [contactOpen, setContactOpen] = useState(false)
  return (
    <div>
      {/* ── 1) Intro — text left, image right ── */}
      <div
        id="face-intro"
        className="grid min-h-svh content-center gap-10 py-16 lg:grid-cols-2 lg:gap-14"
      >
        <div className="text-left">
          <h2
            id="face-intro-title"
            className="scroll-mt-24 font-heading text-3xl font-medium tracking-tight text-balance text-foreground sm:text-4xl lg:scroll-mt-28"
          >
            {t('title')}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-pretty text-foreground/90">
            {t('intro1')}
          </p>
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
            {t('intro2')}
          </p>
          <div className="mt-8 flex items-center justify-start gap-3">
            <ShimmerButton
              asChild
              type="button"
              background="var(--brand)"
              shimmerColor="#ffffff"
              borderRadius="0px"
              shimmerDuration="3s"
              className="min-w-0 flex-1 gap-2 px-4 py-3 text-sm font-medium sm:min-w-[210px] sm:flex-none sm:gap-2.5 sm:px-8 sm:text-base"
            >
              <a href="#face-proceduri">
                <ArrowDown className="size-4 sm:size-5" />
                {t('discoverProcedures')}
              </a>
            </ShimmerButton>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 border border-brand/30 bg-transparent px-4 py-3 text-sm font-medium whitespace-nowrap text-brand transition-colors hover:border-brand hover:bg-brand/5 sm:min-w-[210px] sm:flex-none sm:gap-2.5 sm:px-8 sm:text-base"
            >
              <Mail className="size-4 sm:size-5" />
              {t('getInTouch')}
            </button>
          </div>
        </div>
        <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-brand/15 shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/face.jpg"
            alt={tn('face')}
            className="size-full object-cover object-center"
          />
          <BorderBeam size={120} duration={11} colorFrom="#51623D" colorTo="#9bb06f" />
        </div>
      </div>

      {/* ── 2) RE-GEN concept + science bento ── */}
      <div className="flex min-h-svh flex-col justify-center py-16">
        <div className="w-full max-w-3xl text-left">
        <h3 className="font-heading text-2xl font-medium text-balance text-foreground sm:text-3xl">
          {t('conceptTitle')}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
          {t('conceptBody')}
        </p>
      </div>

      <BentoGrid className="mt-10">
        {SCIENCE.map(({ key, Icon, className }) => (
          <BentoCard
            key={key}
            Icon={Icon}
            title={t(`science.${key}.title`)}
            body={t(`science.${key}.body`)}
            className={className}
          />
        ))}
      </BentoGrid>
      </div>

      {/* ── 3) Procedures, FAQ style ── */}
      <div id="face-proceduri" className="flex min-h-svh flex-col justify-center py-16 scroll-mt-11">
        <SectionTitle className="mx-auto text-center">{t('proceduresHeading')}</SectionTitle>
        <ProcedureAccordion
          namespace="ServicePages.phytoaestetica.face"
          items={FACE_PROCEDURES}
          accordionId="face"
          icons={FACE_ICONS}
        />
        <BookNowButton label={t('tryProcedure')} />
      </div>

      {/* ── 4) Discover products ── */}
      <DiscoverProducts universe="face" />

      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  )
}

function BodyPanel() {
  const t = useTranslations('ServicePages.phytoaestetica.body')
  const tn = useTranslations('Nav')
  const [contactOpen, setContactOpen] = useState(false)
  return (
    <div>
      {/* ── 1) Intro — text left, image right ── */}
      <div
        id="body-intro"
        className="grid min-h-svh content-center gap-10 py-16 lg:grid-cols-2 lg:gap-14"
      >
        <div className="text-left">
          <h2
            id="body-intro-title"
            className="scroll-mt-24 font-heading text-3xl font-medium tracking-tight text-balance text-foreground sm:text-4xl lg:scroll-mt-28"
          >
            {t('title')}
          </h2>
          <div className="mt-6 space-y-4">
            {BODY_INTROS.map((key, i) =>
              i === 0 ? (
                <p key={key} className="text-lg leading-relaxed text-pretty text-foreground/90">
                  {t(key)}
                </p>
              ) : (
                <p
                  key={key}
                  className="text-base leading-relaxed text-pretty text-muted-foreground"
                >
                  {t(key)}
                </p>
              ),
            )}
          </div>
          <div className="mt-8 flex items-center justify-start gap-3">
            <ShimmerButton
              asChild
              type="button"
              background="var(--brand)"
              shimmerColor="#ffffff"
              borderRadius="0px"
              shimmerDuration="3s"
              className="min-w-0 flex-1 gap-2 px-4 py-3 text-sm font-medium sm:min-w-[210px] sm:flex-none sm:gap-2.5 sm:px-8 sm:text-base"
            >
              <a href="#body-proceduri">
                <ArrowDown className="size-4 sm:size-5" />
                {t('discoverProcedures')}
              </a>
            </ShimmerButton>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 border border-brand/30 bg-transparent px-4 py-3 text-sm font-medium whitespace-nowrap text-brand transition-colors hover:border-brand hover:bg-brand/5 sm:min-w-[210px] sm:flex-none sm:gap-2.5 sm:px-8 sm:text-base"
            >
              <Mail className="size-4 sm:size-5" />
              {t('getInTouch')}
            </button>
          </div>
        </div>
        <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-brand/15 shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/body.jpg"
            alt={tn('body')}
            className="size-full object-cover object-center"
          />
          <BorderBeam size={120} duration={11} colorFrom="#51623D" colorTo="#9bb06f" />
        </div>
      </div>

      {/* ── 2) Procedures, FAQ style ── */}
      <div id="body-proceduri" className="flex min-h-svh flex-col justify-center py-16 scroll-mt-11">
        <SectionTitle className="mx-auto text-center">{t('proceduresHeading')}</SectionTitle>
        <ProcedureAccordion
          namespace="ServicePages.phytoaestetica.body"
          items={BODY_PROCEDURES}
          accordionId="body"
          icons={BODY_ICONS}
        />
        <BookNowButton label={t('tryProcedure')} />
      </div>

      {/* ── 3) Discover products ── */}
      <DiscoverProducts universe="body" />

      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  )
}

/**
 * Face / Body universes as query-synced tabs — replaces the former generic
 * treatment tabs. The hero buttons, the CTA band and the services menu all
 * link via `?service=face|body`: the param selects the matching tab and the
 * intro scroll keeps those deep links landing exactly. Legacy `#face` /
 * `#body` hashes are upgraded to the query param on mount.
 */
export function PhytoFaceBody({
  initialService = null,
}: {
  /** Explicit `?service=` universe resolved on the server — first paint is
   * already correct, so no client-side guessing (and no hydration mismatch). */
  initialService?: Universe | null
}) {
  const tn = useTranslations('Nav')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [[active, direction], setActive] = useState<[Universe, number]>([
    initialService ?? 'face',
    1,
  ])
  const rootRef = useRef<HTMLElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [visible, setVisible] = useState(false)
  const pushedRef = useRef<Universe | null>(null)
  const paramSyncSkipped = useRef(false)

  // The bar is `fixed`: appear once "How it helps" scrolls into view and
  // disappear once the "Discover our products" section scrolls into view.
  useEffect(() => {
    let ticking = false
    const update = () => {
      ticking = false
      const helps = document.getElementById('phyto-helps')
      const products = document.getElementById('phyto-products')
      const root = rootRef.current
      if (!helps || !products || !root) return
      const vh = window.innerHeight
      const helpsBottom = helps.getBoundingClientRect().bottom
      const productsTop = products.getBoundingClientRect().top
      // Appear once the end of "How it helps" comes into view; hide as soon as
      // the products CTA rises into view so the bar never overlaps it.
      setVisible(helpsBottom < vh * 0.9 && productsTop > vh * 0.85)
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const pendingScroll = useRef<number | null>(null)

  const scrollToIntro = useCallback((u: Universe, immediate = false) => {
    // One scroll at a time: a new jump cancels the pending one so competing
    // smooth-scroll animations can never fight mid-flight.
    if (pendingScroll.current !== null) {
      window.clearTimeout(pendingScroll.current)
      pendingScroll.current = null
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // The incoming panel mounts after the tab switch (AnimatePresence
    // `mode="wait"`), so poll briefly for the intro instead of gambling on a
    // fixed delay — then scroll exactly once.
    let tries = immediate ? 0 : 10
    const tick = () => {
      pendingScroll.current = null
      const el = document.getElementById(`${u}-intro`)
      if (el || tries <= 0 || reduce) {
        const target = el ?? rootRef.current
        if (!target) return
        const header =
          document.querySelector('header')?.getBoundingClientRect().height ?? 0
        const top = target.getBoundingClientRect().top + window.scrollY - header - 16
        window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
        return
      }
      tries -= 1
      pendingScroll.current = window.setTimeout(tick, 100)
    }
    tick()
  }, [])

  // Never fire a deferred scroll after unmount.
  useEffect(
    () => () => {
      if (pendingScroll.current !== null) window.clearTimeout(pendingScroll.current)
    },
    [],
  )

  /**
   * Single entry point for EVERY universe jump — pill tabs, keyboard, hero /
   * CTA-band buttons, menu links, deep links. One tab switch + one identical
   * scroll, no matter the trigger.
   */
  const goTo = useCallback(
    (u: Universe, opts?: { immediateScroll?: boolean }) => {
      setActive((prev) => {
        if (prev[0] === u) return prev
        const order: Universe[] = ['face', 'body']
        return [u, order.indexOf(u) > order.indexOf(prev[0]) ? 1 : -1]
      })
      scrollToIntro(u, opts?.immediateScroll ?? false)
    },
    [scrollToIntro],
  )

  // Scroll on mount only when the server resolved an explicit service param —
  // missing or invalid means plain default Face: nothing to do.
  useEffect(() => {
    if (initialService !== null) scrollToIntro(initialService, false)
  }, [initialService, scrollToIntro])

  // In-page Link navigations (hero / CTA band / menus) while mounted.
  // The first run is skipped — mount is owned by the effect above.
  useEffect(() => {
    if (!paramSyncSkipped.current) {
      paramSyncSkipped.current = true
      return
    }
    const param = searchParams.get('service')
    const universe: Universe = param === 'body' ? 'body' : 'face'
    // Skip when this change came from `select` below — it already ran `goTo`.
    // Otherwise the navigation came from a Link: same single path.
    if (pushedRef.current === universe) {
      pushedRef.current = null
      return
    }
    goTo(universe)
  }, [searchParams, goTo])

  // Same-URL Link clicks (e.g. Face button while `?service=face` is set) are
  // ignored by the router — same single path, scrolled immediately since the
  // panel is already mounted.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest?.(
        'a[href*="service=face"], a[href*="service=body"]',
      )
      if (!anchor) return
      if (!window.location.pathname.includes('/phytoaestetica')) return
      const target = anchor.getAttribute('href')!.includes('service=body')
        ? ('body' as Universe)
        : ('face' as Universe)
      const current = new URLSearchParams(window.location.search).get('service')
      if (current === target || (current === null && target === 'face')) {
        event.preventDefault()
        goTo(target, { immediateScroll: true })
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [goTo])

  const select = (index: number) => {
    const universe = UNIVERSES[index].key
    if (universe === active) {
      goTo(universe, { immediateScroll: true })
      return
    }
    // `goTo` runs now; the param-sync effect skips its own run for this
    // router-driven change via `pushedRef`.
    pushedRef.current = universe
    router.replace(`${pathname}?service=${universe}`, { scroll: false })
    goTo(universe)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const current = UNIVERSES.findIndex((u) => u.key === active)
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!step && event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? UNIVERSES.length - 1
          : (current + step + UNIVERSES.length) % UNIVERSES.length
    select(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section
      ref={rootRef}
      className="mx-auto max-w-7xl scroll-mt-16 px-4 py-10 sm:px-6 lg:px-8 lg:py-14 lg:scroll-mt-20"
    >
      {/* Tab bar — fixed to the viewport bottom while this part of the page scrolls. */}
      <div
        inert={!visible}
        className={cn(
          'fixed inset-x-0 bottom-0 z-30 transition-all duration-300',
          visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-24 opacity-0',
        )}
      >
        {/* Full-screen glassy underlay — frosted strip fading toward the content. */}
        <div className="bg-gradient-to-t from-background/85 via-background/45 to-transparent px-4 pt-8 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-2xl [mask-image:linear-gradient(to_top,black_55%,transparent)]">
          <div
            role="tablist"
            aria-label={tn('phytoaestetica')}
            onKeyDown={onKeyDown}
            className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-1.5 rounded-full border border-brand/20 bg-brand-subtle/55 p-1.5 shadow-2xl backdrop-blur-2xl backdrop-saturate-150"
          >
          {UNIVERSES.map(({ key, Icon }, i) => (
            <button
              key={key}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`phyto-tab-${key}`}
              aria-selected={active === key}
              aria-controls={`phyto-panel-${key}`}
              tabIndex={active === key ? 0 : -1}
              onClick={() => select(i)}
              className={cn(
                'relative flex items-center justify-center gap-2.5 rounded-full px-6 py-2.5 text-base font-medium transition-colors duration-300',
                active === key
                  ? 'text-brand-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {active === key && (
                <motion.span
                  layoutId="phyto-universe-pill"
                  className="absolute inset-0 rounded-full bg-brand shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              <Icon className="relative z-10 size-6 shrink-0" strokeWidth={1.75} />
              <span className="relative z-10">{tn(key)}</span>
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* Active universe panel — slides toward the newly selected tab. */}
      <div className="relative mt-8 overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={active}
            id={`phyto-panel-${active}`}
            role="tabpanel"
            aria-labelledby={`phyto-tab-${active}`}
            custom={direction}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {active === 'face' ? <FacePanel /> : <BodyPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
