/**
 * Stub for `next/navigation` in vitest.
 *
 * `next-intl`'s `createNavigation` (used by `@/i18n/navigation`) imports
 * `next/navigation`, which vitest can't resolve under pnpm's ESM layout
 * ("Cannot find module .../next/navigation"). Aliasing it in
 * `vitest.config.mts` keeps the component under test real while satisfying
 * that import.
 */
export function useRouter() {
  return {
    push: () => {},
    replace: () => {},
    prefetch: () => {},
    back: () => {},
    forward: () => {},
    refresh: () => {},
  }
}

export function usePathname() {
  return '/en'
}

export function useSearchParams() {
  return new URLSearchParams()
}

export function useParams() {
  return {}
}

export function redirect() {}
export function permanentRedirect() {}
export function notFound() {
  throw new Error('notFound() called')
}

export const RedirectType = { push: 'push', replace: 'replace' } as const
