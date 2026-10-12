import type { CollectionConfig } from 'payload'

export const ProductTypes: CollectionConfig = {
  slug: 'product-types',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'label_en',
    defaultColumns: ['label_en', 'label_ro', 'label_ru'],
    group: 'Shop',
  },
  fields: [
    { name: 'label_ro', type: 'text', required: true, label: 'Label (RO)' },
    { name: 'label_ru', type: 'text', required: true, label: 'Label (RU)' },
    { name: 'label_en', type: 'text', required: true, label: 'Label (EN)' },
  ],
}
