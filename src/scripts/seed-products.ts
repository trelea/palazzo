/**
 * Seed the `products` collection from the scraped JSON folders:
 *   products/face/<slug>/<slug>.json (+ <slug>.jpg)
 *   products/body/<slug>/<slug>.json (+ <slug>.jpg)
 *
 * Per product folder the script:
 *  1. skips incomplete entries (any empty name/desc field, or no image
 *     file) with a reason in the final summary,
 *  2. resolves `product_type` ("face"/"body") to the real product-types ID,
 *  3. uploads the sibling image to `media` (no alt — resolved at fetch
 *     level in the components),
 *  4. creates the product with all JSON values verbatim (the slug hook
 *     generates the URL slug from the EN name).
 *
 * Idempotent — products whose slug already exists are skipped.
 *
 * Run with: node v22 + `npx tsx src/scripts/seed-products.ts`
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { slugify } from '../lib/slug'
import type { Product } from '../payload-types'

const PRODUCTS_DIR = path.resolve(process.cwd(), 'products')
const IMAGE_EXTS: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

type SeedRow = {
  file: string
  dir: string
  slug: string
  data: Record<string, unknown>
}

function discover(): SeedRow[] {
  const rows: SeedRow[] = []
  for (const type of ['face', 'body']) {
    const typeDir = path.join(PRODUCTS_DIR, type)
    if (!fs.existsSync(typeDir)) continue
    for (const slug of fs.readdirSync(typeDir)) {
      const file = path.join(typeDir, slug, `${slug}.json`)
      if (!fs.existsSync(file)) continue
      rows.push({ file, dir: path.join(typeDir, slug), slug, data: JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, unknown> })
    }
  }
  return rows
}

function isFilled(value: unknown): boolean {
  if (typeof value === 'string') return value.trim() !== ''
  if (value && typeof value === 'object') {
    const root = (value as { root?: { children?: unknown[] } }).root
    return !!root && Array.isArray(root.children) && root.children.length > 0
  }
  return false
}

/** Completeness gate: all 9 text fields filled + sibling image present. */
function checkComplete(row: SeedRow): { imagePath: string } | { reason: string } {
  const d = row.data
  for (const key of [
    'product_name_en',
    'product_name_ro',
    'product_name_ru',
    'product_short_desc_en',
    'product_short_desc_ro',
    'product_short_desc_ru',
    'product_long_desc_en',
    'product_long_desc_ro',
    'product_long_desc_ru',
  ]) {
    if (!isFilled(d[key])) return { reason: `empty field ${key}` }
  }
  const imagePath = ['.jpg', '.jpeg', '.png', '.webp']
    .map((ext) => path.join(row.dir, `${row.slug}${ext}`))
    .find((p) => fs.existsSync(p))
  if (!imagePath) return { reason: 'missing image file' }
  return { imagePath }
}

async function main() {
  const payload = await getPayload({ config: configPromise })

  const typeIds = new Map<string, number>()
  for (const label of ['Face', 'Body']) {
    const found = await payload.find({
      collection: 'product-types',
      where: { label_en: { equals: label } },
      limit: 1,
      depth: 0,
    })
    if (found.docs.length === 0) throw new Error(`product-type "${label}" not found — run seed-product-types first`)
    typeIds.set(label.toLowerCase(), found.docs[0].id)
  }

  let created = 0
  const skipped: string[] = []
  for (const row of discover()) {
    const check = checkComplete(row)
    if ('reason' in check) {
      skipped.push(`${row.slug}: ${check.reason}`)
      continue
    }
    const expectedSlug = slugify(row.data.product_name_en as string) || 'product'
    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: expectedSlug } },
      limit: 1,
      depth: 0,
      select: { slug: true },
    })
    if (existing.docs.length > 0) {
      skipped.push(`${row.slug}: already seeded`)
      continue
    }

    const buffer = fs.readFileSync(check.imagePath)
    const ext = path.extname(check.imagePath).toLowerCase()
    const media = await payload.create({
      collection: 'media',
      data: {},
      file: {
        data: buffer,
        mimetype: IMAGE_EXTS[ext] ?? 'image/jpeg',
        name: `${row.slug}${ext}`,
        size: buffer.length,
      },
    })

    const d = row.data
    const typeId = typeIds.get((d.product_type as string).toLowerCase())
    if (!typeId) {
      skipped.push(`${row.slug}: unknown product_type ${JSON.stringify(d.product_type)}`)
      continue
    }
    // The slug hook regenerates this identically from the EN name; passing it
    // satisfies the required field in the generated types.
    const data: Omit<Product, 'id' | 'updatedAt' | 'createdAt'> = {
      slug: expectedSlug,
      product_type: typeId,
      product_name_en: d.product_name_en as string,
      product_name_ro: d.product_name_ro as string,
      product_name_ru: d.product_name_ru as string,
      product_short_desc_en: d.product_short_desc_en as string,
      product_short_desc_ro: d.product_short_desc_ro as string,
      product_short_desc_ru: d.product_short_desc_ru as string,
      product_long_desc_en: d.product_long_desc_en as Product['product_long_desc_en'],
      product_long_desc_ro: d.product_long_desc_ro as Product['product_long_desc_ro'],
      product_long_desc_ru: d.product_long_desc_ru as Product['product_long_desc_ru'],
      product_images: [{ image: media.id }],
    }
    await payload.create({ collection: 'products', data })
    created++
    payload.logger.info(`product "${expectedSlug}" created`)
  }

  payload.logger.info(`done — created: ${created}, skipped: ${skipped.length}`)
  for (const s of skipped) payload.logger.info(`  skipped ${s}`)

  if (typeof (payload.db as { destroy?: () => Promise<void> }).destroy === 'function') {
    await (payload.db as { destroy: () => Promise<void> }).destroy()
  }
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
