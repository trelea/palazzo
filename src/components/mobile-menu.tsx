'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown, Menu } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { NAV_ITEMS, LOGO_SRC } from '@/lib/site'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { NavLink } from '@/components/nav-link'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function MobileMenu() {
  const t = useTranslations('Nav')
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={t('openMenu')}
          className="inline-flex size-10 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Menu className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-[min(88vw,22rem)] flex-col p-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_SRC} alt="Palazzo Aesthetics" width={36} height={36} className="size-9" />
            <span className="flex flex-col leading-none">
              <span className="font-heading text-base font-semibold tracking-[0.18em] text-brand uppercase">
                Palazzo
              </span>
              <span className="text-[0.6rem] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                Aesthetics
              </span>
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-1 px-4 py-6">
          {NAV_ITEMS.map((item) =>
            item.type === 'group' ? (
              <Collapsible key={item.key} defaultOpen className="mt-1">
                <CollapsibleTrigger className="group/col flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
                  {t(item.key)}
                  <ChevronDown className="size-4 opacity-60 transition-transform duration-300 group-data-[state=open]/col:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <div className="mt-1 ml-3 flex flex-col gap-1 border-l border-border pl-3">
                    {item.children.map((service) => (
                      <NavLink
                        key={service.href}
                        href={service.href}
                        variant="mobile"
                        onNavigate={close}
                      >
                        {t(service.key)}
                      </NavLink>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <NavLink key={item.href} href={item.href} variant="mobile" onNavigate={close}>
                {t(item.key)}
              </NavLink>
            ),
          )}
        </div>

        <div className="mt-auto border-t px-6 py-5">
          <SheetClose asChild>
            <ShimmerButton
              asChild
              background="var(--brand)"
              shimmerColor="#ffffff"
              borderRadius="10px"
              className="w-full px-5 py-3 text-base font-medium"
            >
              <Link href="/contacts">{t('book')}</Link>
            </ShimmerButton>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
