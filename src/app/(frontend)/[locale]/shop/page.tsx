import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { ShoppingBag } from 'lucide-react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { Card } from '@/components/ui/card'
import { AppointmentCta } from '@/components/appointment-cta'
import { Reveal } from '@/components/reveal'
import { GridBackdrop } from '@/components/grid-backdrop'
import { ShopFilter, type FilterableCard, type ShopFilterOption } from '@/components/shop-filter'
import { productName, productShortDesc, productTypeLabel, type AppLocale } from '@/lib/products'
import { productListJsonLd } from '@/lib/schema'
import { JsonLd } from '@/components/json-ld'
import { pageMetadata } from '@/lib/seo'
import type { Media, Product } from '@/payload-types'

/** First image of a product doc, when present and populated (depth >= 1). */
function coverOf(doc: Product): Media | null {
  const first = doc.product_images?.[0]?.image
  return first && typeof first === 'object' ? first : null
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ filter?: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const { filter } = await searchParams
  const t = await getTranslations({ locale, namespace: 'Meta.shop' })
  const metadata = pageMetadata({
    locale,
    path: '/shop',
    title: t('title'),
    description: t('description'),
  })
  // A filtered view is the same page — keep it out of the index (the canonical
  // already collapses it to `/shop`) but let crawlers follow the product links.
  return filter ? { ...metadata, robots: { index: false, follow: true } } : metadata
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const t = await getTranslations('ShopPage')
  const locale = (await getLocale()) as AppLocale
  const { filter } = await searchParams
  const initialFilter: ShopFilterOption = filter === 'face' || filter === 'body' ? filter : 'all'

  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'products',
    depth: 1,
    sort: '-createdAt',
    limit: 60,
  })

  /** Single-line excerpt of at most `max` chars, with an ellipsis when cut. */
  function excerpt(text: string, max = 256): string {
    const clean = text.replace(/\s+/g, ' ').trim()
    return clean.length > max ? `${clean.slice(0, max).trimEnd()}...` : clean
  }

  /** Locale-independent product-type key used for filtering. */
  function typeKeyOf(doc: Product): string {
    const type = doc.product_type
    if (type && typeof type === 'object') return (type.label_en ?? '').trim().toLowerCase()
    return 'other'
  }

  const cards: FilterableCard[] = docs.map((doc, i) => {
    const name = productName(doc, locale)
    const cover = coverOf(doc)
    return {
      title: name,
      // Full file keeps the original aspect (max 1024, fit inside) — the
      // `card` size is a centre-cropped 768x576 landscape variant that cuts
      // portrait product shots, so it must not be used here.
      src: cover?.url ?? '',
      href: `/shop/${doc.slug}`,
      alt: cover?.alt?.trim() || name,
      typeLabel: productTypeLabel(doc.product_type, locale),
      typeKey: typeKeyOf(doc),
      description: excerpt(productShortDesc(doc, locale)),
      eager: i < 3,
    }
  })

  return (
    <div className="relative isolate">
      <JsonLd
        data={productListJsonLd(
          docs.map((doc) => ({ name: productName(doc, locale), slug: doc.slug })),
          locale,
        )}
      />
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

      {/* ── Product grid ── */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-40 sm:px-6 lg:px-8 lg:pt-14 lg:pb-56">
        {docs.length === 0 ? (
          <Reveal>
            <Card className="mx-auto max-w-xl rounded-2xl border-brand/15 bg-card/60 p-10 text-center shadow-sm backdrop-blur-sm">
              <span className="mx-auto inline-flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <ShoppingBag className="size-5" strokeWidth={1.5} />
              </span>
              <p className="mt-5 text-muted-foreground">{t('empty')}</p>
            </Card>
          </Reveal>
        ) : (
          <ShopFilter cards={cards} initialFilter={initialFilter} gridId="shop-grid" />
        )}
      </section>

      <AppointmentCta />
    </div>
  )
}
