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

export default function Phytoaestetica() {
  return <ServicePage service="phytoaestetica" />
}
