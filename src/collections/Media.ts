import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
  upload: {
    // Keep crop disabled: Payload's admin-crop path saves the cropped buffer
    // in its ORIGINAL format under the .webp filename, bypassing the
    // conversion below. focalPoint is a no-op without imageSizes.
    crop: false,
    focalPoint: false,
    // Rule 1: every stored file is webp
    formatOptions: { format: 'webp', options: { quality: 80 } },
    // Rule 2: max 1024x1024, keep aspect ratio, never enlarge
    resizeOptions: { width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true },
    // Smaller pre-generated variant for cards/thumbnails so lists don't
    // download the full-size original.
    imageSizes: [
      {
        name: 'card',
        width: 768,
        height: 576,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
    ],
    adminThumbnail: 'card',
    // Files are content-addressed enough in practice (new uploads get deduped
    // filenames); let browsers cache for a day and reuse stale for a week.
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
      return headers
    },
    // Only formats sharp will convert; excludes SVG/PDF/etc., which would
    // pass through unconverted and violate the webp rule
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/tiff'],
  },
}
