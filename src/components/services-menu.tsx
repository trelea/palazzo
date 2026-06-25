'use client'

import { useTranslations } from 'next-intl'
import { ArrowRight, ChevronDown, HeartPulse, Leaf } from 'lucide-react'

import { Link, usePathname } from '@/i18n/navigation'
import { SERVICE_LINKS, type ServiceKey } from '@/lib/site'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BorderBeam } from '@/components/ui/border-beam'

/** Icon per discipline — mirrors the homepage service metadata. */
const SERVICE_ICON: Record<ServiceKey, typeof Leaf> = {
  physiotherapy: HeartPulse,
  phytotherapy: Leaf,
}

const matches = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

/**
 * Desktop "Services" dropdown — a compact mega-menu. Each service is a rich row
 * (icon tile + name + focus tagline + reveal arrow) so the menu communicates
 * what each discipline is, not just its name. A Magic UI `BorderBeam` traces the
 * panel for a subtle branded accent. Client because of the Radix menu +
 * active-state (`usePathname`); on mobile the links live in a collapsible.
 */
export function ServicesMenu() {
  const t = useTranslations('Nav')
  const ts = useTranslations('HomePage.services')
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

      <DropdownMenuContent
        align="start"
        sideOffset={10}
        className="relative w-[21rem] overflow-hidden rounded-xl border-brand/15 p-2"
      >
        <BorderBeam size={70} duration={8} colorFrom="#51623D" colorTo="#9bb06f" />

        <div className="grid gap-1">
          {SERVICE_LINKS.map((service) => {
            const Icon = SERVICE_ICON[service.key]
            const isActive = matches(pathname, service.href)
            return (
              <DropdownMenuItem
                key={service.href}
                asChild
                className={cn(
                  'group/item cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors focus:bg-brand-subtle/60',
                  isActive && 'bg-brand-subtle/40',
                )}
              >
                <Link href={service.href} aria-current={isActive ? 'page' : undefined}>
                  <span
                    className={cn(
                      'inline-flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors',
                      isActive
                        ? 'bg-brand text-brand-foreground'
                        : 'bg-brand/10 text-brand group-hover/item:bg-brand/15 group-focus/item:bg-brand/15',
                    )}
                  >
                    <Icon className="size-5" strokeWidth={1.6} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'font-heading text-sm font-medium',
                        isActive ? 'text-brand' : 'text-foreground',
                      )}
                    >
                      {t(service.key)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {ts(`${service.key}Focus`)}
                    </p>
                  </div>

                  <ArrowRight className="size-4 shrink-0 -translate-x-1 text-brand opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus/item:translate-x-0 group-focus/item:opacity-100" />
                </Link>
              </DropdownMenuItem>
            )
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
