import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  // Keep the libsql native client out of the webpack bundle so it (and its
  // native `.node` binary) gets traced into the serverless function instead —
  // otherwise Vercel throws "Cannot find module 'libsql'" at runtime.
  serverExternalPackages: ['jose', '@libsql/client', 'libsql'],

  // pnpm nests libsql + its native `.node` binaries under node_modules/.pnpm,
  // which Vercel's file tracer misses. Force them into every server function so
  // the runtime `require('libsql')` resolves.
  outputFileTracingIncludes: {
    '**': [
      './node_modules/.pnpm/libsql@*/node_modules/libsql/**/*',
      './node_modules/.pnpm/@libsql+linux-x64-gnu@*/node_modules/@libsql/linux-x64-gnu/**/*',
      './node_modules/.pnpm/@libsql+linux-x64-musl@*/node_modules/@libsql/linux-x64-musl/**/*',
    ],
  },

  // Your Next.js config here
  webpack: (webpackConfig: any, { isServer, webpack }: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // @payloadcms/plugin-cloud-storage's `/utilities` barrel re-exports the
    // server-only `resolveSignedURLKey` alongside the client-safe `getFileKey`
    // that the R2 client upload handler needs. webpack (no tree-shaking in dev)
    // would otherwise pull payload's server internals into the browser bundle.
    // Replace that one module with an inert stub in the client build only.
    if (!isServer) {
      webpackConfig.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /[\\/]resolveSignedURLKey(\.js)?$/,
          path.resolve(dirname, 'src/shims/resolveSignedURLKey.client.js'),
        ),
      )
    }

    // pino-pretty (pulled in by Payload's default dev logger) does a top-level
    // `require('worker_threads')`, which has no browser equivalent and breaks
    // the client bundle. Stub the Node built-ins it touches on the client.
    webpackConfig.resolve.fallback = {
      ...webpackConfig.resolve.fallback,
      worker_threads: false,
    }

    return webpackConfig
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(withPayload(nextConfig, { devBundleServerPackages: false }))
