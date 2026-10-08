import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { ArrowLeft } from 'lucide-react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { Link } from '@/i18n/navigation'
import { AppointmentCta } from '@/components/appointment-cta'
import { Reveal } from '@/components/reveal'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { ProductImageZoom } from '@/components/product-image-zoom'
import { BrandImage } from '@/components/brand-image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  productLongDesc,
  productName,
  productShortDesc,
  productTypeLabel,
  type AppLocale,
} from '@/lib/products'
import { productJsonLd, breadcrumbJsonLd } from '@/lib/schema'
import { JsonLd } from '@/components/json-ld'
import { pageMetadata, truncate } from '@/lib/seo'
import type { Media, Product } from '@/payload-types'

type Props = { params: Promise<{ locale: string; slug: string }> }

/** Deduped between generateMetadata and the page render within one request. */
const fetchProduct = cache(async (slug: string): Promise<Product | null> => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
    disableErrors: true,
  })
  return (docs[0] as Product | undefined) ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const doc = await fetchProduct(slug)
  if (!doc) return {}
  const cover = doc.product_images?.[0]?.image
  const ogImage = cover && typeof cover === 'object' ? (cover.url ?? undefined) : undefined
  return pageMetadata({
    locale,
    path: `/shop/${slug}`,
    title: productName(doc, locale as AppLocale),
    description: truncate(productShortDesc(doc, locale as AppLocale)),
    ogImage,
  })
}

const RICH_TEXT_CLASSES = [
  'mt-10 space-y-4 text-base leading-relaxed text-pretty font-light text-foreground lg:text-lg lg:leading-relaxed',
  '[&_h1]:mt-8 [&_h1]:font-heading [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-foreground',
  '[&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground',
  '[&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-2xl [&_h3]:font-medium [&_h3]:text-foreground',
  '[&_h4]:mt-6 [&_h4]:font-heading [&_h4]:text-xl [&_h4]:font-medium [&_h4]:text-foreground',
  '[&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-brand-muted',
  '[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-1',
  '[&_blockquote]:border-l-2 [&_blockquote]:border-brand/40 [&_blockquote]:pl-4 [&_blockquote]:italic',
  '[&_strong]:font-semibold [&_strong]:text-foreground',
  '[&_hr]:my-8 [&_hr]:border-brand/15',
  '[&_img]:rounded-2xl',
].join(' ')

export default async function ProductDetail({ params }: Props) {
  const { slug } = await params
  const doc = await fetchProduct(slug)
  if (!doc) notFound()

  const t = await getTranslations('ShopPage')
  const tn = await getTranslations('Nav')
  const locale = (await getLocale()) as AppLocale

  const name = productName(doc, locale)
  const typeLabel = productTypeLabel(doc.product_type, locale)
  const tags = (doc.product_tags ?? []).filter(
    (tag): tag is Exclude<typeof tag, number> => typeof tag === 'object' && tag !== null,
  )
  const images = (doc.product_images ?? [])
    .map((row) => row.image)
    .filter((img): img is Media => typeof img === 'object' && img !== null && Boolean(img.url))
  const [hero, ...rest] = images

  const arrowClasses = rest.length === 2 ? 'sm:hidden' : rest.length === 3 ? 'lg:hidden' : ''

  return (
    <div className="relative isolate">
      <JsonLd
        data={productJsonLd(doc, locale, images.map((img) => img.url).filter(Boolean) as string[])}
      />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: tn('home'), path: '/' },
          { name: t('title'), path: '/shop' },
          { name, path: `/shop/${slug}` },
        ])}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-brand/12 via-brand/5 to-transparent"
      />

      {/* ── Product overview: image left, name + short desc right ── */}
      <section className="relative isolate mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 lg:px-8 lg:pt-16 lg:pb-20">
        <AnimatedGridPattern
          numSquares={20}
          maxOpacity={0.04}
          duration={5}
          repeatDelay={1}
          className="[mask-image:radial-gradient(ellipse_70%_80%_at_50%_30%,black,transparent)]"
        />
        <Reveal>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-muted"
          >
            <ArrowLeft className="size-4" />
            {t('back')}
          </Link>
        </Reveal>
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal delay={0.1}>
            <div className="group relative aspect-square w-full overflow-hidden bg-white shadow-md">
              {hero?.url ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.url}
                    alt=""
                    aria-hidden="true"
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 size-full scale-200 object-cover blur-2xl"
                  />
                  <BrandImage
                    src={hero.url}
                    alt={hero.alt?.trim() || name}
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 z-10 size-full scale-[0.8] object-contain"
                  />
                  <ProductImageZoom src={hero.url} alt={hero.alt?.trim() || name} />
                </>
              ) : (
                <div className="flex size-full items-center justify-center text-brand">
                  <span className="text-sm text-muted-foreground">No image</span>
                </div>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col items-start">
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl lg:text-4xl">
                {name}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {typeLabel && (
                  <p className="text-sm font-medium tracking-wider text-brand uppercase">
                    {typeLabel}
                  </p>
                )}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag[`label_${locale}`]}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-pretty font-light text-foreground sm:text-lg">
                {productShortDesc(doc, locale)}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Long description + gallery ── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <Reveal>
          <RichText
            data={productLongDesc(doc, locale) as unknown as SerializedEditorState}
            className={RICH_TEXT_CLASSES}
          />
        </Reveal>

        {rest.length > 0 && (
          <Reveal delay={0.1}>
            <Carousel opts={{ align: 'start' }} className="mt-12">
              <CarouselContent>
                {rest.map((img) => (
                  <CarouselItem key={img.id} className="sm:basis-1/2 lg:basis-1/3">
                    <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-brand/15 shadow-sm">
                      <BrandImage
                        src={img.sizes?.card?.url ?? img.url ?? ''}
                        alt={img.alt?.trim() || name}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {rest.length > 1 && (
                <>
                  <CarouselPrevious
                    className={cn(
                      'left-3 border-brand/30 text-brand hover:bg-brand/10 hover:text-brand',
                      arrowClasses,
                    )}
                  />
                  <CarouselNext
                    className={cn(
                      'right-3 border-brand/30 text-brand hover:bg-brand/10 hover:text-brand',
                      arrowClasses,
                    )}
                  />
                </>
              )}
            </Carousel>
          </Reveal>
        )}
      </section>

      <AppointmentCta />
    </div>
  )
}
