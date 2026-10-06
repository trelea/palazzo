import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { ServicePage } from '@/components/service-page'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Meta.phytoaestetica' })
  return pageMetadata({
    locale,
    path: '/phytoaestetica',
    title: t('title'),
    description: t('description'),
  })
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
