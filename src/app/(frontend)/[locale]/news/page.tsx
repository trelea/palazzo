import type { Metadata } from 'next'
import { getFormatter, getLocale, getTranslations } from 'next-intl/server'
import { ArrowRight, Newspaper } from 'lucide-react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AppointmentCta } from '@/components/appointment-cta'
import { Reveal } from '@/components/reveal'
import { GridBackdrop } from '@/components/grid-backdrop'
import { lexicalExcerpt } from '@/lib/lexical'
import { newsDesc, newsTitle, type AppLocale } from '@/lib/news'
import { pageMetadata } from '@/lib/seo'
import type { Media, News } from '@/payload-types'

/** First image of a news doc, when present and populated (depth >= 1). */
function coverOf(doc: News): Media | null {
  const first = doc.images?.[0]?.image
  return first && typeof first === 'object' ? first : null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Meta.news' })
  return pageMetadata({
    locale,
    path: '/news',
    title: t('title'),
    description: t('description'),
  })
}

export default async function NewsPage() {
  const t = await getTranslations('NewsPage')
  const format = await getFormatter()
  const locale = (await getLocale()) as AppLocale

  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'news',
    depth: 1,
    sort: '-createdAt',
    limit: 60, // Payload defaults to 10 — must be explicit
  })

  return (
    <div className="relative isolate">
      {/* Subtle left-to-right brand fade across the full page height. */}
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

      {/* ── News grid ── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {docs.length === 0 ? (
          <Reveal>
            <Card className="mx-auto max-w-xl rounded-2xl border-brand/15 bg-card/60 p-10 text-center shadow-sm backdrop-blur-sm">
              <span className="mx-auto inline-flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Newspaper className="size-5" strokeWidth={1.5} />
              </span>
              <p className="mt-5 text-muted-foreground">{t('empty')}</p>
            </Card>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {docs.map((doc, i) => {
              const title = newsTitle(doc, locale)
              const cover = coverOf(doc)
              return (
                <Reveal key={doc.id} delay={Math.min(0.1 * i, 0.4)}>
                  <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border-brand/15 p-0 shadow-sm">
                    <div className="relative h-48 w-full overflow-hidden sm:h-56">
                      {cover?.url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={cover.sizes?.card?.url ?? cover.url}
                          alt={cover.alt ?? title}
                          loading={i < 3 ? 'eager' : 'lazy'}
                          decoding="async"
                          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-brand/10 text-brand">
                          <Newspaper className="size-8" strokeWidth={1.25} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col items-start p-7 sm:p-8">
                      <p className="text-xs font-medium tracking-wider text-brand uppercase">
                        {format.dateTime(new Date(doc.createdAt), { dateStyle: 'long' })}
                      </p>
                      <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-foreground">
                        {title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {lexicalExcerpt(newsDesc(doc, locale))}
                      </p>
                      <Button
                        asChild
                        className="mt-6 h-auto rounded-none bg-brand px-6 py-3 text-sm text-brand-foreground hover:bg-brand-muted"
                      >
                        <Link href={`/news/${doc.id}`}>
                          {t('readMore')}
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </Reveal>
              )
            })}
          </div>
        )}
      </section>

      <AppointmentCta />
    </div>
  )
}
