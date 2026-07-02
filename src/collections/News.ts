import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'news',
  access: {
    read: () => true, // public read for the frontend; writes stay auth-only (default)
  },
  admin: {
    useAsTitle: 'title_ro',
    defaultColumns: ['title_ro', 'title_en', 'updatedAt'],
  },
  fields: [
    { name: 'title_ro', type: 'text', required: true, label: 'Title (RO)' },
    { name: 'title_ru', type: 'text', required: true, label: 'Title (RU)' },
    { name: 'title_en', type: 'text', required: true, label: 'Title (EN)' },
    { name: 'desc_ro', type: 'richText', required: true, label: 'Description (RO)' },
    { name: 'desc_ru', type: 'richText', required: true, label: 'Description (RU)' },
    { name: 'desc_en', type: 'richText', required: true, label: 'Description (EN)' },
    {
      name: 'images',
      type: 'array',
      maxRows: 10, // no minRows -> 0 images allowed
      labels: { singular: 'Image', plural: 'Images' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}
