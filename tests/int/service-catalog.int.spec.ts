import { describe, expect, it } from 'vitest'

import en from '../../messages/en.json'
import ro from '../../messages/ro.json'
import ru from '../../messages/ru.json'
import {
  FACE_PROCEDURE_KEYS,
  IMPACCO_PRICE_MDL,
  PHYTO_PROCEDURE_ORDER,
  PROCEDURE_PRICES_MDL,
} from '@/lib/procedure-prices'
import { serviceCatalogJsonLd } from '@/lib/schema'

type Messages = typeof en

const LOCALES = { ro, en, ru } as const

/** Face-universe keys resolve to the Face copy, the rest to the Body copy. */
const FACE_KEY_SET = new Set<string>(FACE_PROCEDURE_KEYS)

function procedureOf(messages: Messages, key: string) {
  const phyto = messages.ServicePages.phytoaestetica
  const entry = (
    FACE_KEY_SET.has(key)
      ? (phyto.face.procedures as Record<string, { name: string; body: string }>)
      : (phyto.body.procedures as Record<string, { name: string; body: string }>)
  )[key]
  return {
    name: entry.name,
    description: entry.body,
    price: PROCEDURE_PRICES_MDL[key as keyof typeof PROCEDURE_PRICES_MDL],
  }
}

describe('serviceCatalogJsonLd', () => {
  it('covers all 8 deduped phyto procedures with MDL prices', () => {
    expect(PHYTO_PROCEDURE_ORDER).toHaveLength(8)
    expect(new Set(PHYTO_PROCEDURE_ORDER).size).toBe(8)
    for (const key of PHYTO_PROCEDURE_ORDER) {
      expect(PROCEDURE_PRICES_MDL).toHaveProperty(key)
    }
  })

  it.each(Object.keys(LOCALES))('emits localized names and MDL offers for %s', (locale) => {
    const messages = LOCALES[locale as keyof typeof LOCALES]
    const procedures = PHYTO_PROCEDURE_ORDER.map((key) => procedureOf(messages, key))
    const data = serviceCatalogJsonLd({
      locale,
      pagePath: '/phytoaestetica',
      name: 'Phyto',
      procedures,
    }) as {
      '@type': string
      inLanguage: string
      url: string
      hasOfferCatalog: { itemListElement: { priceCurrency: string; price: string; name: string }[] }
    }

    expect(data['@type']).toBe('Service')
    expect(data.inLanguage).toBe(locale)
    expect(data.url).toContain(`/${locale}/phytoaestetica`)
    const offers = data.hasOfferCatalog.itemListElement
    expect(offers).toHaveLength(8)
    for (const offer of offers) {
      expect(offer.priceCurrency).toBe('MDL')
    }
    // Spot-check: localized names come from that locale's messages.
    expect(offers[0].name).toBe(procedures[0].name)
    expect(offers[0].price).toBe(String(procedures[0].price))
  })

  it('emits the Impacco offer at 800 MDL', () => {
    const data = serviceCatalogJsonLd({
      locale: 'ro',
      pagePath: '/phytotherapy',
      name: 'Fito',
      procedures: [{ name: 'Impacco', description: 'desc', price: IMPACCO_PRICE_MDL }],
    }) as {
      hasOfferCatalog: { itemListElement: { price: string; priceCurrency: string }[] }
    }
    expect(IMPACCO_PRICE_MDL).toBe(800)
    expect(data.hasOfferCatalog.itemListElement).toHaveLength(1)
    expect(data.hasOfferCatalog.itemListElement[0]).toMatchObject({
      price: '800',
      priceCurrency: 'MDL',
    })
  })
})
