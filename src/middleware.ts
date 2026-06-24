import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Handles locale detection and prefixing. Hitting `/` redirects to the
// default locale (`/ro`), e.g. `/` → `/ro`, `/about` → `/ro/about`.
export default createMiddleware(routing)

export const config = {
  // Run only on frontend paths. Exclude Payload (`/admin`, `/api`), the demo
  // `/my-route`, Next.js internals, and any request with a file extension
  // (favicon.ico, images, etc.) — otherwise the CMS routes would be rewritten
  // to `/ro/admin`, `/ro/api`, … and break.
  matcher: ['/((?!api|admin|my-route|_next|_vercel|.*\\..*).*)'],
}
