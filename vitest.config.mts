import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      // `next-intl`'s createNavigation imports `next/navigation`, which vitest
      // cannot resolve under pnpm's ESM layout. Point it at a stub so component
      // tests can render real next-intl components.
      'next/navigation': fileURLToPath(
        new URL('./tests/int/stubs/next-navigation.ts', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    // `.tsx` is included so component tests (JSX) can live alongside the
    // existing `.ts` integration specs under the same `*.int.spec.*` convention.
    include: ['tests/int/**/*.int.spec.{ts,tsx}'],
    server: {
      deps: {
        // `next-intl` must be processed by Vite rather than externalised, or its
        // internal `next/navigation` import bypasses the alias above and fails to
        // resolve under pnpm's ESM layout.
        inline: ['next-intl'],
      },
    },
  },
})
