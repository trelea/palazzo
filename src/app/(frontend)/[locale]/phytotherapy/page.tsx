import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { ServicePage } from '@/components/service-page'
import { JsonLd } from '@/components/json-ld'
import { IMPACCO_PRICE_MDL } from '@/lib/procedure-prices'
import { serviceCatalogJsonLd } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Meta.phytotherapy' })
  return pageMetadata({
    locale,
    path: '/phytotherapy',
    title: t('title'),
    description: t('description'),
  })
}

export default async function Phytotherapy({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const tMeta = await getTranslations({ locale, namespace: 'Meta.phytotherapy' })
  const t = await getTranslations({ locale, namespace: 'ServicePages.impacco' })
  const tn = await getTranslations({ locale, namespace: 'Nav' })

  return (
    <>
      <JsonLd
        data={serviceCatalogJsonLd({
          locale,
          pagePath: '/phytotherapy',
          name: tMeta('title'),
          procedures: [
            {
              name: tn('impacco'),
              description: `${t('description.body1')} ${t('description.body2')}`,
              price: IMPACCO_PRICE_MDL,
            },
          ],
        })}
      />
      <ServicePage service="impacco" />
    </>
  )
}
