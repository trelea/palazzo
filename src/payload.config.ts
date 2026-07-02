import path from 'path'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { News } from './collections/News'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      graphics: {
        Icon: '/components/payload/Icon#Icon',
        Logo: '/components/payload/Logo#Logo',
      },
    },
    meta: {
      description: 'Palazzo Aesthetics content management',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/palazzo-logo.svg' }],
      titleSuffix: '- Palazzo Aesthetics',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, News],
  editor: lexicalEditor(),
  // Required for upload formatOptions/resizeOptions — without this they are
  // silently ignored.
  sharp,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // libSQL/Turso over a plain URL + token — works on any runtime (no bindings).
  db: sqliteAdapter({
    // Schema is managed via migrations (pnpm payload migrate:create + pnpm
    // migrate). Dev-mode push is disabled: it fights the shared Turso DB's
    // schema and fails on already-existing indexes.
    push: false,
    client: {
      url: process.env.DATABASE_URI || '',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  plugins: [
    // S3-compatible storage via access keys. Points at Cloudflare R2's S3 API
    // here, but works with any S3 provider by swapping the env values.
    s3Storage({
      collections: { media: true },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'auto',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true,
      },
    }),
  ],
})
