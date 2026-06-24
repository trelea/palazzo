'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Tiny client leaf: the ONLY reason it's client is `usePathname` for the
 * active-state styling. The label text is passed in as server-rendered
 * children.
 */
export function NavLink({
  href,
  children,
  variant = 'desktop',
  onNavigate,
}: {
  href: string
  children: React.ReactNode
  variant?: 'desktop' | 'mobile'
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const active = isActive(pathname, href)

  if (variant === 'mobile') {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'rounded-lg px-3 py-3 text-base font-medium transition-colors',
          active
            ? 'bg-brand/10 text-brand'
            : 'text-foreground/80 hover:bg-muted hover:text-foreground',
        )}
      >
        {children}
      </Link>
    )
  }

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative px-3 py-2 text-sm font-medium transition-colors',
        'after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 hover:after:scale-x-100',
        active
          ? 'text-brand after:scale-x-100'
          : 'text-foreground/70 hover:text-foreground',
      )}
    >
      {children}
    </Link>
  )
}
