'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'

import { cn } from '@/lib/utils'
import { SectionTitle } from '@/components/section-title'
import { Reveal } from '@/components/reveal'
import { WobbleCard } from '@/components/ui/wobble-card'

/** Per-card hover reveal for the brand overlay (side B), echoing the varied
 * flipbox effects on the reference site. `off` is the resting state; `on`
 * brings the overlay in on hover. */
const EFFECTS = {
  slideUp: { off: 'translate-y-full', on: 'group-hover:translate-y-0' },
  slideDown: { off: '-translate-y-full', on: 'group-hover:translate-y-0' },
  slideLeft: { off: 'translate-x-full', on: 'group-hover:translate-x-0' },
  slideRight: { off: '-translate-x-full', on: 'group-hover:translate-x-0' },
  zoom: { off: 'scale-50 opacity-0', on: 'group-hover:scale-100 group-hover:opacity-100' },
  // Flips also fade at rest: an exactly edge-on panel still projects a visible
  // sliver through the parent's perspective.
  flipDown: {
    off: 'origin-top opacity-0 [transform:rotateX(-90deg)]',
    on: 'group-hover:opacity-100 group-hover:[transform:rotateX(0deg)]',
  },
  flipUp: {
    off: 'origin-bottom opacity-0 [transform:rotateX(90deg)]',
    on: 'group-hover:opacity-100 group-hover:[transform:rotateX(0deg)]',
  },
} as const

/** Conditions the Galenic Cataplasm treats; copy lives under
 * `ServicePages.phytotherapy.issues.items.<key>` (`title` + `desc`).
 * Bento layout on a 6-col grid: spans of 2 (1/3), 3 (1/2), 4 (2/3), 6 (full). */
const ISSUES = [
  { key: 'shoulder', img: '/issues/shoulder.jpg', span: 'lg:col-span-3', effect: 'slideRight' },
  { key: 'knee', img: '/issues/knee.jpg', span: 'lg:col-span-3', effect: 'slideUp' },
  { key: 'handElbow', img: '/issues/hand-elbow.jpg', span: 'lg:col-span-4', effect: 'flipDown' },
  { key: 'foot', img: '/issues/foot.jpg', span: 'lg:col-span-2', effect: 'slideLeft' },
  { key: 'neuralgia', img: '/issues/neuralgia.jpg', span: 'lg:col-span-2', effect: 'zoom' },
  { key: 'spine', img: '/issues/spine.jpg', span: 'lg:col-span-2', effect: 'slideDown' },
  { key: 'respiratory', img: '/issues/respiratory.jpg', span: 'lg:col-span-2', effect: 'flipUp' },
  { key: 'circulatory', img: '/issues/circulatory.jpg', span: 'lg:col-span-2', effect: 'slideUp' },
  { key: 'skin', img: '/issues/skin.jpg', span: 'lg:col-span-4', effect: 'slideRight' },
  {
    key: 'abdominal',
    img: '/issues/abdominal.jpg',
    span: 'sm:col-span-2 lg:col-span-6',
    effect: 'zoom',
  },
] as const

export function IssuesTreated() {
  const t = useTranslations('ServicePages.phytotherapy.issues')
  // Touch screens have no hover — tapping a card toggles its overlay instead.
  const [activeKey, setActiveKey] = useState<string | null>(null)

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
      <Reveal inView>
        <div className="mx-auto max-w-2xl text-center">
          <SectionTitle className="mx-auto">{t('heading')}</SectionTitle>
          <p className="mt-4 text-pretty text-muted-foreground">{t('subtitle')}</p>
        </div>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
        {ISSUES.map(({ key, img, span, effect }, i) => {
          const eff = EFFECTS[effect]
          const isActive = activeKey === key
          return (
            <Reveal key={key} delay={0.05 * (i % 3)} inView className={cn('h-full', span)}>
              <WobbleCard containerClassName="group h-full">
                <div
                  onClick={() => setActiveKey(isActive ? null : key)}
                  className="relative flex h-full min-h-[280px] cursor-pointer flex-col justify-end overflow-hidden rounded-2xl [perspective:1200px] sm:min-h-[320px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={t(`items.${key}.title`)}
                    className="absolute inset-0 size-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                  <div className="relative flex items-end justify-between gap-3 p-6 sm:p-7">
                    <h3 className="font-heading text-2xl font-medium text-white sm:text-3xl">
                      {t(`items.${key}.title`)}
                    </h3>
                    {/* Tap affordance — only shown where hover doesn't exist. */}
                    <Plus
                      className="mb-1 hidden size-5 shrink-0 text-white/80 [@media(hover:none)]:block"
                      strokeWidth={2}
                    />
                  </div>

                  {/* Side B — brand overlay with the full info text. Revealed by
                      hover on pointer devices, by tap (isActive) on touch. */}
                  <div
                    className={cn(
                      'absolute inset-0 flex flex-col justify-end gap-3 bg-brand/95 p-6 transition-all duration-500 ease-out sm:p-7',
                      !isActive && eff.off,
                      eff.on,
                    )}
                  >
                    <h3 className="font-heading text-2xl font-medium text-white sm:text-3xl">
                      {t(`items.${key}.title`)}
                    </h3>
                    <p className="text-base leading-relaxed text-white/90 sm:text-lg">
                      {t(`items.${key}.desc`)}
                    </p>
                  </div>
                </div>
              </WobbleCard>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
