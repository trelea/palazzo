import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { ServicePage } from '@/components/service-page'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ service?: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const { service } = await searchParams
  const t = await getTranslations({ locale, namespace: 'Meta.phytoaestetica' })
  const metadata = pageMetadata({
    locale,
    path: '/phytoaestetica',
    title: t('title'),
    description: t('description'),
  })
  // `?service=face|body` selects a tab on the same page — canonical already
  // points at `/phytoaestetica`, so keep the variant out of the index.
  return service ? { ...metadata, robots: { index: false, follow: true } } : metadata
}

export default async function Phytoaestetica({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>
}) {
  const { service } = await searchParams
  // Server-owned initial tab: only an explicit, valid param selects a
  // universe — missing or garbage means plain default Face, no scrolling.
  const initialService = service === 'face' || service === 'body' ? service : null
  return <ServicePage service="phytoaestetica" initialService={initialService} />
}
