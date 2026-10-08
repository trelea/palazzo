import type { CollectionConfig, FieldHook } from 'payload'

import { slugify } from '../lib/slug'

/** First free slug for `base`: `base`, `base-2`, `base-3`, … */
async function firstFreeSlug(
  req: Parameters<FieldHook>[0]['req'],
  base: string,
): Promise<string> {
  const root = base || 'product'
  let candidate = root
  let counter = 1
  for (;;) {
    const existing = await req.payload.find({
      collection: 'products',
      where: { slug: { equals: candidate } },
      limit: 1,
      depth: 0,
      select: { slug: true },
    })
    if (existing.docs.length === 0) return candidate
    counter++
    // Re-trim so `base` + suffix never grows unboundedly on long names.
    candidate = `${root.slice(0, 80).replace(/-+$/g, '')}-${counter}`
  }
}

/**
 * Generates the slug once, on create, from Product Name (EN). Updates pass
 * the stored value through untouched so published URLs never break.
 */
const generateSlug: FieldHook = async ({ value, data, req, operation }) => {
  if (operation !== 'create' || value) return value
  const base = slugify(data?.product_name_en as string | undefined)
  return firstFreeSlug(req, base)
}

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'product_name_en',
    defaultColumns: ['product_name_en', 'slug', 'product_type', 'updatedAt'],
    group: 'Shop',
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug (URL name)',
      admin: {
        readOnly: true,
        description: 'Auto-generated from Product Name (EN) on creation — not editable.',
      },
      hooks: {
        beforeValidate: [generateSlug],
      },
    },
    {
      name: 'product_type',
      type: 'relationship',
      relationTo: 'product-types',
      required: true,
      label: 'Product Type',
    },
    { name: 'product_name_en', type: 'text', required: true, label: 'Product Name (EN)' },
    { name: 'product_name_ro', type: 'text', required: true, label: 'Product Name (RO)' },
    { name: 'product_name_ru', type: 'text', required: true, label: 'Product Name (RU)' },
    {
      name: 'product_short_desc_en',
      type: 'textarea',
      required: true,
      label: 'Short Description (EN)',
    },
    {
      name: 'product_short_desc_ro',
      type: 'textarea',
      required: true,
      label: 'Short Description (RO)',
    },
    {
      name: 'product_short_desc_ru',
      type: 'textarea',
      required: true,
      label: 'Short Description (RU)',
    },
    {
      name: 'product_long_desc_en',
      type: 'richText',
      required: true,
      label: 'Long Description (EN)',
    },
    {
      name: 'product_long_desc_ro',
      type: 'richText',
      required: true,
      label: 'Long Description (RO)',
    },
    {
      name: 'product_long_desc_ru',
      type: 'richText',
      required: true,
      label: 'Long Description (RU)',
    },
    {
      name: 'product_images',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      label: 'Product Images',
      labels: { singular: 'Product Image', plural: 'Product Images' },
      admin: { description: 'At least one image is required.' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'product_tags',
      type: 'relationship',
      relationTo: 'product-tags',
      hasMany: true,
      required: false,
      label: 'Product Tags',
    },
  ],
}
