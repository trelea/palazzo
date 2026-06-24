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
  serverExternalPackages: ['jose'],

  // Your Next.js config here
  webpack: (webpackConfig: any, { isServer, webpack }: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // On the production server build, swap @libsql/client's native "node" entry
    // for its pure-JS "web" build (fetch-based). Remote Turso (libsql://) works
    // fully over it, and it needs NO native `libsql` addon — which is what broke
    // on Vercel serverless ("Cannot find module 'libsql'"). Dev keeps the node
    // client so a local `file:` DATABASE_URI still works.
    if (isServer && process.env.NODE_ENV === 'production') {
      webpackConfig.resolve.alias = {
        ...(webpackConfig.resolve.alias || {}),
        '@libsql/client$': '@libsql/client/web',
      }
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
