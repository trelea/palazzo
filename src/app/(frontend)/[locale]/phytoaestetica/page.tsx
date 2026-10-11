import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { ServicePage } from '@/components/service-page'
import { JsonLd } from '@/components/json-ld'
import {
  FACE_PROCEDURE_KEYS,
  PHYTO_PROCEDURE_ORDER,
  PROCEDURE_PRICES_MDL,
} from '@/lib/procedure-prices'
import { serviceCatalogJsonLd } from '@/lib/schema'
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

/** Face-universe keys — shared rituals resolve to the Face copy in metadata. */
const FACE_KEY_SET = new Set<string>(FACE_PROCEDURE_KEYS)

export default async function Phytoaestetica({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ service?: string }>
}) {
  const { locale } = await params
  const { service } = await searchParams
  // Server-owned initial tab: only an explicit, valid param selects a
  // universe — missing or garbage means plain default Face, no scrolling.
  const initialService = service === 'face' || service === 'body' ? service : null

  const tMeta = await getTranslations({ locale, namespace: 'Meta.phytoaestetica' })
  const tService = await getTranslations({ locale, namespace: 'ServicePages' })
  const procedures = PHYTO_PROCEDURE_ORDER.map((key) => {
    const universe = FACE_KEY_SET.has(key) ? 'face' : 'body'
    return {
      name: tService(`phytoaestetica.${universe}.procedures.${key}.name`),
      description: tService(`phytoaestetica.${universe}.procedures.${key}.body`),
      price: PROCEDURE_PRICES_MDL[key],
    }
  })

  return (
    <>
      <JsonLd
        data={serviceCatalogJsonLd({
          locale,
          pagePath: '/phytoaestetica',
          name: tMeta('title'),
          procedures,
        })}
      />
      <ServicePage service="phytoaestetica" initialService={initialService} />
    </>
  )
}
