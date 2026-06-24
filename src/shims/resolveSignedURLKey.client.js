// Client-side stub for @payloadcms/plugin-cloud-storage's server-only
// `resolveSignedURLKey`.
//
// The package's `/utilities` barrel statically re-exports this module, which
// imports `payload/internal` (the full server bundle: fs, undici, node:assert,
// child_process …). The R2 *client* upload handler imports `getFileKey` from
// that same barrel, so in the browser bundle webpack follows the barrel into
// `resolveSignedURLKey` and tries to bundle Node built-ins — which fails.
//
// `resolveSignedURLKey` is only ever called server-side (signed-URL client
// uploads), so replacing it with this inert stub in the client build is safe.
// Wired up via webpack's NormalModuleReplacementPlugin in next.config.ts.
export const resolveSignedURLKey = () => {
  throw new Error('resolveSignedURLKey is server-only and is not available in the browser bundle')
}
