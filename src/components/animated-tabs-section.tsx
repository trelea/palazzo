'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { SectionTitle } from '@/components/section-title'
import { Reveal } from '@/components/reveal'

export type TabConfig = {
  key: string
  Icon: LucideIcon
  /** Ordered translation sub-keys under `tabs.<key>`: `p*` renders a
   * paragraph, `h*` renders a subheading. */
  blocks: readonly string[]
  /** When true the panel heading reads `tabs.<key>.title` instead of the
   * (shorter) tab label. */
  title?: boolean
}

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

/** Centered-header tabs section with a sliding brand pill and directional
 * panel transitions. Copy lives under `<namespace>`: `heading`, `subtitle`,
 * and `tabs.<key>.{label,title?,<blocks>}`. */
export function AnimatedTabsSection({
  namespace,
  layoutId,
  tabs,
  gridClass = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
}: {
  namespace: string
  layoutId: string
  tabs: readonly TabConfig[]
  gridClass?: string
}) {
  const t = useTranslations(namespace)
  // Direction rides along with the index so each switch slides toward the new tab.
  const [[active, direction], setActive] = useState<[number, number]>([0, 1])
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (index: number) => {
    if (index === active) return
    setActive([index, index > active ? 1 : -1])
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!step && event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : (active + step + tabs.length) % tabs.length
    select(next)
    tabRefs.current[next]?.focus()
  }

  const tab = tabs[active]

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal inView>
        <div className="mx-auto max-w-2xl text-center">
          <SectionTitle className="mx-auto">{t('heading')}</SectionTitle>
          <p className="mt-4 text-pretty text-muted-foreground">{t('subtitle')}</p>
        </div>
      </Reveal>

      {/* Tab bar — equal-width pills in a responsive grid so every tab stays
          visible and uniform on phones; the brand pill slides to the active one. */}
      <Reveal delay={0.1} inView>
        <div
          role="tablist"
          aria-label={t('heading')}
          onKeyDown={onKeyDown}
          className={cn('mt-12 grid w-full gap-2', gridClass)}
        >
          {tabs.map(({ key, Icon }, i) => (
            <button
              key={key}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${layoutId}-tab-${key}`}
              aria-selected={active === i}
              aria-controls={`${layoutId}-panel-${key}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => select(i)}
              className={cn(
                'relative flex items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-medium transition-colors duration-300 sm:gap-2',
                active === i
                  ? 'text-brand-foreground'
                  : 'bg-brand-subtle/25 text-muted-foreground hover:text-foreground',
              )}
            >
              {active === i && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-full bg-brand shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              <Icon className="relative z-10 size-4 shrink-0" strokeWidth={1.5} />
              <span className="relative z-10 text-center">{t(`tabs.${key}.label`)}</span>
            </button>
          ))}
        </div>
      </Reveal>

      {/* Content panel — slides in from the side the user is moving toward. */}
      <Reveal delay={0.2} inView>
        <div className="relative mt-10 overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={tab.key}
              id={`${layoutId}-panel-${tab.key}`}
              role="tabpanel"
              aria-labelledby={`${layoutId}-tab-${tab.key}`}
              custom={direction}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="px-1 py-4 sm:px-2 sm:py-6"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <tab.Icon className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="font-heading text-2xl font-medium text-foreground">
                  {t(`tabs.${tab.key}.${tab.title ? 'title' : 'label'}`)}
                </h3>
              </div>
              <div className="mt-6 space-y-4">
                {tab.blocks.map((block) =>
                  block.startsWith('h') ? (
                    <h4
                      key={block}
                      className="pt-3 font-heading text-xl font-medium text-foreground"
                    >
                      {t(`tabs.${tab.key}.${block}`)}
                    </h4>
                  ) : (
                    <p
                      key={block}
                      className="text-base leading-relaxed text-pretty text-muted-foreground"
                    >
                      {t(`tabs.${tab.key}.${block}`)}
                    </p>
                  ),
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  )
}
