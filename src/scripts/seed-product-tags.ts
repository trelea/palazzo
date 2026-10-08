/**
 * Seed the `product-tags` collection from `tags.json` (repo root).
 *
 * The JSON holds three parallel arrays — `ro[i]`, `ru[i]`, `en[i]` are the
 * same tag in three languages — mapped to one doc per index:
 * `{ label_ro, label_ru, label_en }`.
 *
 * Idempotent — skips rows whose `label_en` already exists.
 *
 * Run with: node v22 + `npx tsx src/scripts/seed-product-tags.ts`
 * (`import 'dotenv/config'` must stay the first import so env is loaded
 * before the payload config module is evaluated.)
 */
import 'dotenv/config'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import tags from '../../tags.json'

const BATCH_LOG_EVERY = 100

async function main() {
  const { ro, ru, en } = tags as { ro: string[]; ru: string[]; en: string[] }
  if (ro.length !== ru.length || ro.length !== en.length) {
    throw new Error(
      `tags.json arrays out of sync: ro=${ro.length} ru=${ru.length} en=${en.length}`,
    )
  }

  const payload = await getPayload({ config: configPromise })

  const existing = await payload.find({
    collection: 'product-tags',
    limit: 5000,
    depth: 0,
    select: { label_en: true },
  })
  const seen = new Set(existing.docs.map((doc) => doc.label_en))
  payload.logger.info(`product-tags already in DB: ${seen.size}`)

  let created = 0
  let skipped = 0
  for (let i = 0; i < en.length; i++) {
    const row = { label_en: en[i], label_ro: ro[i], label_ru: ru[i] }
    if (!row.label_en.trim() || !row.label_ro.trim() || !row.label_ru.trim()) {
      throw new Error(`tags.json has an empty label at index ${i}`)
    }
    if (seen.has(row.label_en)) {
      skipped++
      continue
    }
    await payload.create({ collection: 'product-tags', data: row })
    seen.add(row.label_en)
    created++
    if (created % BATCH_LOG_EVERY === 0) {
      payload.logger.info(`created ${created}/${en.length}…`)
    }
  }
  payload.logger.info(`done — created: ${created}, skipped: ${skipped}`)

  // Close the DB connection so the script exits cleanly. The libSQL client
  // can keep sockets open, so force-exit explicitly.
  if (typeof (payload.db as { destroy?: () => Promise<void> }).destroy === 'function') {
    await (payload.db as { destroy: () => Promise<void> }).destroy()
  }
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
