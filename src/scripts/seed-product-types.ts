/**
 * Seed the `product-types` collection with the two base rows: Face / Body.
 * Idempotent — skips rows whose `label_en` already exists.
 *
 * Run with: node v22 + `npx tsx src/scripts/seed-product-types.ts`
 * (dotenv is loaded from `.env` automatically by the script.)
 */
import 'dotenv/config'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const ROWS = [
  { label_en: 'Face', label_ro: 'Față', label_ru: 'Лицо' },
  { label_en: 'Body', label_ro: 'Corp', label_ru: 'Тело' },
]

async function main() {
  const payload = await getPayload({ config: configPromise })
  for (const row of ROWS) {
    const existing = await payload.find({
      collection: 'product-types',
      where: { label_en: { equals: row.label_en } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs.length > 0) {
      payload.logger.info(`product-type "${row.label_en}" already exists — skipping`)
      continue
    }
    await payload.create({ collection: 'product-types', data: row })
    payload.logger.info(`product-type "${row.label_en}" created`)
  }
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
