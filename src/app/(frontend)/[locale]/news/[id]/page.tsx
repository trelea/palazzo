import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getFormatter, getLocale, getTranslations } from 'next-intl/server'
import { ArrowLeft } from 'lucide-react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { Link } from '@/i18n/navigation'
import { AppointmentCta } from '@/components/appointment-cta'
import { Reveal } from '@/components/reveal'
import { GridBackdrop } from '@/components/grid-backdrop'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { lexicalExcerpt } from '@/lib/lexical'
import { newsDesc, newsTitle, type AppLocale } from '@/lib/news'
import type { Media, News } from '@/payload-types'

type Props = { params: Promise<{ locale: string; id: string }> }

/** SQLite ids are positive integers; anything else is a guaranteed 404. */
function parseId(raw: string): number | null {
  const id = Number(raw)
  return Number.isInteger(id) && id > 0 ? id : null
}

/** Deduped between generateMetadata and the page render within one request. */
const fetchNews = cache(async (id: number): Promise<News | null> => {
  const payload = await getPayload({ config: configPromise })
  return payload.findByID({ collection: 'news', id, depth: 1, disableErrors: true })
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: rawId, locale } = await params
  const id = parseId(rawId)
  const doc = id ? await fetchNews(id) : null
  if (!doc) return {}
  return {
    title: `${newsTitle(doc, locale as AppLocale)} | Palazzo Aesthetics`,
    description: lexicalExcerpt(newsDesc(doc, locale as AppLocale)),
  }
}

/**
 * Manual element styling for the Lexical output — the repo has no
 * @tailwindcss/typography, so arbitrary variants target the rendered tags.
 */
const RICH_TEXT_CLASSES = [
  'mt-10 max-w-3xl space-y-4 text-base leading-relaxed text-pretty text-muted-foreground lg:text-lg lg:leading-relaxed',
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

export default async function NewsDetail({ params }: Props) {
  const { id: rawId } = await params
  const id = parseId(rawId)
  if (!id) notFound()

  const doc = await fetchNews(id)
  if (!doc) notFound()

  const t = await getTranslations('NewsPage')
  const format = await getFormatter()
  const locale = (await getLocale()) as AppLocale

  const title = newsTitle(doc, locale)
  const images = (doc.images ?? [])
    .map((row) => row.image)
    .filter((img): img is Media => typeof img === 'object' && img !== null && Boolean(img.url))
  const [hero, ...rest] = images

  // Arrows only make sense when slides overflow the view: 1/view on mobile,
  // 2 from sm, 3 from lg — hide them at breakpoints where everything fits.
  const arrowClasses =
    rest.length === 2 ? 'sm:hidden' : rest.length === 3 ? 'lg:hidden' : ''

  return (
    <div className="relative isolate">
      {/* Subtle left-to-right brand fade across the full page height. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-brand/12 via-brand/5 to-transparent"
      />

      {/* ── Header — first image sits behind the hero, under a readable overlay ── */}
      {/* Taller, vertically-centered header (like the home hero) so the photo
          has room for the fade to read as a soft transition, not a hard box. */}
      <section className="relative isolate flex min-h-[30vh] items-center overflow-hidden px-4 pt-12 pb-10 sm:px-6 lg:min-h-[42vh] lg:px-8 lg:pt-20 lg:pb-14">
        {/* Same ambient grid as the home hero: above the photo on phones
            (-z-10), behind it on desktop (lg:-z-20) so the photo paints over
            it on the right while the grid shows behind the copy on the left. */}
        <GridBackdrop className="-z-10 lg:-z-20" />

        {hero?.url && (
          /* Full-bleed on mobile; from lg the photo occupies only the right half. */
          <div className="absolute inset-y-0 right-0 -z-20 w-full lg:w-1/2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.url}
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              decoding="async"
              className="size-full object-cover object-center"
            />
            {/* Multi-stop fade from the page background into the photo — the
                same transition the home hero uses. */}
            <div aria-hidden="true" className="absolute inset-0 hero-fade-y lg:hero-fade-x" />
          </div>
        )}
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-muted"
            >
              <ArrowLeft className="size-4" />
              {t('back')}
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
              {title}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 text-sm font-medium tracking-wider text-brand uppercase">
              {format.dateTime(new Date(doc.createdAt), { dateStyle: 'long' })}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Article ── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <Reveal>
          <RichText
            data={newsDesc(doc, locale) as unknown as SerializedEditorState}
            className={RICH_TEXT_CLASSES}
          />
        </Reveal>

        {rest.length > 0 && (
          <Reveal delay={0.1}>
            {/* 1 slide on mobile, 2 from sm, 3 from lg. */}
            <Carousel opts={{ align: 'start' }} className="mt-12">
              <CarouselContent>
                {rest.map((img) => (
                  <CarouselItem key={img.id} className="sm:basis-1/2 lg:basis-1/3">
                    <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-brand/15 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.sizes?.card?.url ?? img.url ?? ''}
                        alt={img.alt ?? title}
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
