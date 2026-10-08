'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { LayoutGrid, PersonStanding, ScanFace, ShoppingBag, type LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { usePathname, useRouter } from 'next/navigation'

import { Card } from '@/components/ui/card'
import { FocusCards, type FocusCardItem } from '@/components/ui/focus-cards'
import { cn } from '@/lib/utils'

export type ShopFilterOption = 'all' | 'face' | 'body'
export type FilterableCard = FocusCardItem & { typeKey: string }

const OPTIONS: { value: ShopFilterOption; icon: LucideIcon }[] = [
  { value: 'all', icon: LayoutGrid },
  { value: 'face', icon: ScanFace },
  { value: 'body', icon: PersonStanding },
]

function parseParam(value: string | null): ShopFilterOption {
  return value === 'face' || value === 'body' ? value : 'all'
}

export function ShopFilter({
  cards,
  initialFilter,
  gridId,
}: {
  cards: FilterableCard[]
  initialFilter: ShopFilterOption
  /** Section id the fixed bar appears over while it scrolls. */
  gridId: string
}) {
  const t = useTranslations('ShopPage')
  const router = useRouter()
  const pathname = usePathname()
  const [filter, setFilter] = useState<ShopFilterOption>(initialFilter)
  const [visible, setVisible] = useState(false)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const labels: Record<ShopFilterOption, string> = {
    all: t('filterAll'),
    face: t('filterFace'),
    body: t('filterBody'),
  }

  // Fixed bar: appear once the grid scrolls into view, hide past its end.
  useEffect(() => {
    let ticking = false
    const update = () => {
      ticking = false
      const grid = document.getElementById(gridId)
      if (!grid) return
      const vh = window.innerHeight
      const gridBottom = grid.getBoundingClientRect().bottom
      setVisible(gridBottom > vh * 0.5)
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
  }, [gridId])

  const select = useCallback(
    (option: ShopFilterOption) => {
      setFilter(option)
      const params = new URLSearchParams(window.location.search)
      if (option === 'all') params.delete('filter')
      else params.set('filter', option)
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [router, pathname],
  )

  // Back/forward navigation — keep the filter in sync with the URL.
  useEffect(() => {
    const onPopState = () =>
      setFilter(parseParam(new URLSearchParams(window.location.search).get('filter')))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = OPTIONS.findIndex((o) => o.value === filter)
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!step && event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? OPTIONS.length - 1
          : (current + step + OPTIONS.length) % OPTIONS.length
    select(OPTIONS[next].value)
    tabRefs.current[next]?.focus()
  }

  const filtered = filter === 'all' ? cards : cards.filter((card) => card.typeKey === filter)

  return (
    <>
      <div id={gridId} className="scroll-mt-24">
        {filtered.length === 0 ? (
          <Card className="mx-auto max-w-xl rounded-2xl border-brand/15 bg-card/60 p-10 text-center shadow-sm backdrop-blur-sm">
            <span className="mx-auto inline-flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <ShoppingBag className="size-5" strokeWidth={1.5} />
            </span>
            <p className="mt-5 text-muted-foreground">{t('empty')}</p>
          </Card>
        ) : (
          <FocusCards cards={filtered} ctaLabel={t('viewProduct')} />
        )}
      </div>

      {/* Tab bar — fixed to the viewport bottom while the grid scrolls. */}
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
            aria-label={t('title')}
            onKeyDown={onKeyDown}
            className="mx-auto grid w-full max-w-4xl grid-cols-3 gap-1.5 rounded-full border border-brand/20 bg-brand-subtle/55 p-1.5 shadow-2xl backdrop-blur-2xl backdrop-saturate-150"
          >
            {OPTIONS.map(({ value, icon: Icon }, i) => (
              <button
                key={value}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type="button"
                role="tab"
                aria-selected={filter === value}
                tabIndex={filter === value ? 0 : -1}
                onClick={() => select(value)}
                className={cn(
                  'relative flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-base font-medium transition-colors duration-300',
                  filter === value
                    ? 'text-brand-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {filter === value && (
                  <motion.span
                    layoutId="shop-filter-pill"
                    className="absolute inset-0 rounded-full bg-brand shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <Icon className="relative z-10 size-6 shrink-0" strokeWidth={1.75} />
                <span className="relative z-10">{labels[value]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
