import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ro', 'en', 'ru'],

  // Used when no locale matches
  defaultLocale: 'ro',

  // Always send unprefixed requests (e.g. `/`) to `defaultLocale` instead of
  // inferring the locale from the browser's `Accept-Language` header.
  localeDetection: false,
})
