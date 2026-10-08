import { ArrowRight, PersonStanding, ScanFace, ShoppingBag, type LucideIcon } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { BrandImage } from '@/components/brand-image'

/** Map a product-type label (EN/RO/RU) to an icon + badge colors. */
function productTypeStyle(typeLabel: string): { Icon: LucideIcon; badgeClass: string } {
  const normalized = typeLabel.trim().toLowerCase()
  if (['face', 'față', 'fata', 'лицо'].includes(normalized))
    return { Icon: ScanFace, badgeClass: 'border-rose-200/60 bg-rose-100/90 text-rose-800' }
  if (['body', 'corp', 'тело'].includes(normalized))
    return { Icon: PersonStanding, badgeClass: 'border-lime-200/60 bg-lime-100/90 text-lime-800' }
  return { Icon: ShoppingBag, badgeClass: 'border-white/40 bg-white/85 text-brand' }
}

export type FocusCardItem = {
  title: string
  src: string
  href: string
  alt?: string
  /** Product-type label — exposed only to screen readers, shown visually as an icon. */
  typeLabel?: string
  /** Short excerpt revealed on hover below the title. */
  description?: string
  eager?: boolean
}

export function Card({ card, ctaLabel }: { card: FocusCardItem; ctaLabel: string }) {
  const { Icon: TypeIcon, badgeClass } = card.typeLabel
    ? productTypeStyle(card.typeLabel)
    : { Icon: ShoppingBag, badgeClass: 'border-white/40 bg-white/85 text-brand' }
  return (
    <Link
      href={card.href}
      aria-label={card.title}
      className="group relative block aspect-[3/4] w-full overflow-hidden bg-white shadow-sm transition-shadow duration-200 ease-out hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2"
    >
      {card.src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.src}
            alt=""
            aria-hidden="true"
            loading={card.eager ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute inset-0 size-full scale-200 object-cover blur-2xl"
          />
          <BrandImage
            src={card.src}
            alt={card.alt?.trim() || card.title}
            loading={card.eager ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute inset-0 z-10 size-full scale-[0.7] object-contain"
          />
        </>
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-brand">
          <ShoppingBag className="size-10" strokeWidth={1.25} />
        </span>
      )}
      {card.typeLabel && (
        <span
          className={`absolute top-3 left-3 z-20 inline-flex size-10 items-center justify-center rounded-full border shadow-sm backdrop-blur-md ${badgeClass}`}
        >
          <TypeIcon className="size-6" strokeWidth={2} aria-hidden="true" />
          <span className="sr-only">{card.typeLabel}</span>
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/25 to-transparent px-4 pt-10 pb-4 transition-[padding] duration-200 ease-out group-hover:from-black group-hover:via-black/70 group-hover:pb-[10%]">
        <div className="line-clamp-2 bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text text-lg font-medium text-transparent md:text-xl">
          {card.title}
        </div>
        {card.description && (
          <p className="mt-0 line-clamp-4 max-h-0 overflow-hidden text-lg leading-relaxed text-neutral-200 opacity-0 transition-all duration-200 ease-out group-hover:mt-2 group-hover:max-h-36 group-hover:opacity-100">
            {card.description}
          </p>
        )}
        <span className="mt-0 flex max-h-0 w-full items-center justify-center gap-2 overflow-hidden rounded bg-brand px-4 py-0 text-base font-medium text-brand-foreground opacity-0 transition-all duration-200 ease-out group-hover:mt-3 group-hover:max-h-12 group-hover:py-2.5 group-hover:opacity-100 group-hover:bg-brand-muted">
          {ctaLabel}
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}

export function FocusCards({ cards, ctaLabel }: { cards: FocusCardItem[]; ctaLabel: string }) {
  return (
    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.href} card={card} ctaLabel={ctaLabel} />
      ))}
    </div>
  )
}
