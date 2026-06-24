'use client'

import { useTranslations } from 'next-intl'
import { Check, ChevronDown } from 'lucide-react'

import { Link, usePathname } from '@/i18n/navigation'
import { SERVICE_LINKS } from '@/lib/site'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const matches = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

/**
 * Desktop "Services" dropdown. Styled to match the language switcher so it
 * reads as part of the same family. Client because of the Radix menu +
 * active-state (`usePathname`); on mobile the links live in a collapsible.
 */
export function ServicesMenu() {
  const t = useTranslations('Nav')
  const pathname = usePathname()
  const active = SERVICE_LINKS.some((s) => matches(pathname, s.href))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'group/svc relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors outline-none',
          'after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 hover:after:scale-x-100 data-[state=open]:after:scale-x-100',
          active
            ? 'text-brand after:scale-x-100'
            : 'text-foreground/70 hover:text-foreground data-[state=open]:text-foreground',
        )}
      >
        {t('services')}
        <ChevronDown className="size-3.5 opacity-60 transition-transform duration-300 group-data-[state=open]/svc:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44">
        {SERVICE_LINKS.map((service) => {
          const isActive = matches(pathname, service.href)
          return (
            <DropdownMenuItem key={service.href} asChild>
              <Link
                href={service.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn('cursor-pointer justify-between gap-3', isActive && 'text-brand')}
              >
                <span>{t(service.key)}</span>
                {isActive && <Check className="size-4 text-brand" />}
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
