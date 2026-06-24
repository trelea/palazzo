import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { NAV_ITEMS, LOGO_SRC } from '@/lib/site'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { StickyHeader } from '@/components/sticky-header'
import { NavLink } from '@/components/nav-link'
import { ServicesMenu } from '@/components/services-menu'
import { LanguageSwitcher } from '@/components/language-switcher'
import { MobileMenu } from '@/components/mobile-menu'

function Wordmark() {
  return (
    <Link
      href="/"
      aria-label="Palazzo Aesthetics — home"
      className="flex items-center gap-2.5 transition-opacity hover:opacity-80 sm:gap-3"
    >
      {/* SVG logo served directly (Next/Image would route SVGs through the optimizer). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_SRC}
        alt="Palazzo Aesthetics"
        width={48}
        height={48}
        className="size-9 shrink-0 sm:size-11"
      />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-base font-semibold tracking-[0.18em] text-brand uppercase sm:text-lg">
          Palazzo
        </span>
        <span className="text-[0.6rem] font-medium tracking-[0.32em] text-muted-foreground uppercase sm:text-[0.65rem]">
          Aesthetics
        </span>
      </span>
    </Link>
  )
}

export default function Navbar() {
  // Server-side translation — resolves at render, ships no JS.
  const t = useTranslations('Nav')

  return (
    <StickyHeader>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Wordmark />

        {/* Desktop links — server-rendered labels; interactivity via tiny client leaves */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) =>
            item.type === 'group' ? (
              <li key={item.key}>
                <ServicesMenu />
              </li>
            ) : (
              <li key={item.href}>
                <NavLink href={item.href}>{t(item.key)}</NavLink>
              </li>
            ),
          )}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <ShimmerButton
            asChild
            background="var(--brand)"
            shimmerColor="#ffffff"
            borderRadius="10px"
            shimmerDuration="3s"
            className="px-5 py-2.5 text-sm font-medium"
          >
            <Link href="/contacts">{t('book')}</Link>
          </ShimmerButton>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher />
          <MobileMenu />
        </div>
      </nav>
    </StickyHeader>
  )
}
