import React from 'react'
import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { OG_IMAGE, OG_LOCALE, SITE_NAME, SITE_URL } from '@/lib/seo'
import { notFound } from 'next/navigation'
import { localBusinessJsonLd } from '@/lib/schema'
import { JsonLd } from '@/components/json-ld'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

/** Elegant beauty/care typography — serif display for headings, clean sans for body. */
const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})
const body = Jost({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

/**
 * Site-wide SEO metadata, localized via the `Meta` i18n namespace. Icons
 * (favicon.ico / icon.png / apple-icon.png in `src/app`) and the web manifest
 * (`src/app/manifest.ts`) are picked up by Next's file conventions and need no
 * explicit `icons` entry here. Pages override title/description/OG per route
 * via `pageMetadata()` from `@/lib/seo`.
 */
export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'Meta' })
  const title = `${SITE_NAME} — ${t('tagline')}`
  const description = t('description')

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s — ${SITE_NAME}` },
    description,
    applicationName: SITE_NAME,
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url: `/${locale}`,
      locale: OG_LOCALE[locale],
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE.url],
    },
    robots: { index: true, follow: true },
  }
}

export const viewport: Viewport = {
  themeColor: '#51623D',
}

export default async function RootLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: 'Meta' })

  return (
    <html lang={locale} className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-dvh flex-col">
        {/* Site-wide LocalBusiness structured data — one block on every page. */}
        <JsonLd data={localBusinessJsonLd(locale, t('description'))} />
        <NextIntlClientProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
