'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Leaf,
  PersonStanding,
  ScanFace,
  Sparkles,
} from 'lucide-react'
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'

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
  phytoaestetica: Sparkles,
  face: ScanFace,
  body: PersonStanding,
  impacco: Leaf,
}

const matches = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

/**
 * Hover intent delays, in ms. Radix's root `DropdownMenuTrigger` opens on
 * pointerdown / Enter / Space / ArrowDown only — it has NO hover handler — so
 * hover-to-open has to be added here. Both timers exist to absorb sloppy
 * pointer movement: without the open delay, sweeping the cursor across the
 * navbar pops the menu open on every pass; without the close delay, the menu
 * closes in the gap while crossing from the trigger into the panel.
 */
const HOVER_OPEN_DELAY = 120
const HOVER_CLOSE_DELAY = 180

/**
 * Desktop "Services" dropdown — one panel listing the top-level destinations.
 *
 * The Phyto-Esthetics row owns a nested flyout (`DropdownMenuPrimitive.Sub`)
 * with Face / Body. They belong to Phyto-Esthetics, so they appear only when
 * that row is hovered — not as inline rows in the root panel.
 *
 * Two details keep this robust:
 *
 * - The sub trigger is `SubTrigger asChild` around the next-intl `Link`, so
 *   the row stays a real link to its own page (click navigates) while hover
 *   still opens the flyout via Radix's native sub-open behaviour — no custom
 *   timers at this level. The shared root hover timers own the whole menu:
 *   Radix renders the sub panel inline INSIDE the root panel's DOM (no
 *   portal), so the cursor never leaves the root panel while moving between
 *   the two — the root handlers alone cover both. Attaching close handlers
 *   to the sub panel would be a bug: leaving the flyout schedules a close
 *   that entering the main panel can never cancel, killing the whole menu.
 * - Alignment is explicit: `align="start" alignOffset={-8}` lifts the flyout
 *   to the top edge of the root panel (which has `p-2`, and Phyto-Esthetics
 *   is the first row, so its top sits 8px below the panel top). Radix forces
 *   the side to the right for sub panels, so only the vertical offset is
 *   ours to tune. If the panel padding or row order changes, this offset
 *   must move with it.
 *
 * A Magic UI `BorderBeam` traces the root panel for a subtle branded accent.
 * Client because of the Radix menu + active-state (`usePathname`); on mobile
 * the same data renders as collapsibles in `mobile-menu.tsx`.
 */
export function ServicesMenu() {
  const t = useTranslations('Nav')
  const ts = useTranslations('HomePage.services')
  const pathname = usePathname()
  const active = SERVICE_LINKS.some(
    (s) => matches(pathname, s.href) || s.children.some((c) => matches(pathname, c.href)),
  )

  // Controlled so hover can drive `open` alongside Radix's own click/keyboard
  // toggling — `onOpenChange` keeps Escape, outside-click and item selection
  // working exactly as before.
  const [open, setOpen] = useState(false)
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current)
    if (closeTimer.current) clearTimeout(closeTimer.current)
    openTimer.current = null
    closeTimer.current = null
  }, [])

  // Don't leave a timer running after unmount (e.g. navigating away mid-hover).
  useEffect(() => clearTimers, [clearTimers])

  /** Touch fires `pointerenter` too — that would open the menu on every tap. */
  const isHoverable = (event: React.PointerEvent) => event.pointerType !== 'touch'

  const handleTriggerEnter = (event: React.PointerEvent) => {
    if (!isHoverable(event)) return
    clearTimers()
    openTimer.current = setTimeout(() => setOpen(true), HOVER_OPEN_DELAY)
  }

  const handleTriggerLeave = (event: React.PointerEvent) => {
    if (!isHoverable(event)) return
    clearTimers()
    closeTimer.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY)
  }

  /** Crossing into the panel cancels the pending close. */
  const handleContentEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = null
  }

  const handleContentLeave = () => {
    clearTimers()
    closeTimer.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY)
  }

  return (
    <DropdownMenu
      // Non-modal is required for a hover menu: with the default `modal`
      // Radix locks `pointer-events` on the body while open, so the cursor —
      // still sitting on the trigger — instantly fires `pointerleave`,
      // schedules a close, then re-fires `pointerenter` after the close and
      // reopens: an infinite render/disappear flicker without moving the mouse.
      modal={false}
      open={open}
      onOpenChange={(next) => {
        // Any Radix-driven change (Escape, outside click, picking an item)
        // cancels queued hover timers: a pending close would shut a
        // click-opened menu behind the user, and a pending open would reopen
        // a just-dismissed one.
        clearTimers()
        setOpen(next)
      }}
    >
      <DropdownMenuTrigger
        onPointerEnter={handleTriggerEnter}
        onPointerLeave={handleTriggerLeave}
        className={cn(
          'group/svc relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors outline-none',
          // Invisible hover bridge covering the `sideOffset` gap below the
          // trigger: without it the cursor briefly hovers neither trigger
          // nor panel while crossing, and a slow crossing (> close delay)
          // shuts the menu just as the user reaches it. Absolute, so it adds
          // no layout size; `after:` stays free for the underline.
          'before:absolute before:inset-x-0 before:-bottom-2.5 before:h-2.5 before:content-[""]',
          'after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 hover:after:scale-x-100 data-[state=open]:after:scale-x-100',
          active
            ? 'text-brand after:scale-x-100'
            : 'text-foreground/70 hover:text-foreground data-[state=open]:text-foreground',
        )}
      >
        {t('services')}
        <ChevronDown className="size-3.5 opacity-60 transition-transform duration-300 group-data-[state=open]/svc:rotate-180" />
      </DropdownMenuTrigger>

      {/* `relative` is safe here: this is the root content, positioned by Radix
          via a wrapper — and it is the positioning context `BorderBeam` needs.
          The pointer handlers keep the panel open while the cursor moves from the
          trigger down into it. */}
      <DropdownMenuContent
        align="start"
        sideOffset={10}
        onPointerEnter={handleContentEnter}
        onPointerLeave={handleContentLeave}
        className="relative w-[21rem] overflow-hidden rounded-xl border-brand/15 p-2"
      >
        <BorderBeam size={70} duration={8} colorFrom="#51623D" colorTo="#9bb06f" />

        <div className="grid gap-1">
          {SERVICE_LINKS.map((service) => {
            const Icon = SERVICE_ICON[service.key]
            const isActive =
              matches(pathname, service.href) ||
              service.children.some((c) => matches(pathname, c.href))

            // A service with children owns a hover flyout. `SubTrigger asChild`
            // keeps the row a real link: hovering opens Face/Body, clicking
            // navigates to the service page itself.
            if (service.children.length > 0) {
              return (
                <DropdownMenuPrimitive.Sub key={service.href}>
                  <DropdownMenuPrimitive.SubTrigger asChild>
                    <Link
                      href={service.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'group/item flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors outline-none select-none focus:bg-brand-subtle/60 data-[state=open]:bg-brand-subtle/60',
                        isActive && 'bg-brand-subtle/40',
                      )}
                    >
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

                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            'block font-heading text-sm font-medium',
                            isActive ? 'text-brand' : 'text-foreground',
                          )}
                        >
                          {t(service.key)}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {ts(`${service.key}Focus`)}
                        </span>
                      </span>

                      <ChevronRight className="size-4 shrink-0 text-brand/70" />
                    </Link>
                  </DropdownMenuPrimitive.SubTrigger>

                  <DropdownMenuPrimitive.SubContent
                    align="start"
                    sideOffset={10}
                    alignOffset={-8}
                    className="relative z-50 w-[21rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-xl border-brand/15 bg-popover p-2 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=right]:slide-in-from-left-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
                  >
                    <div className="grid gap-1">
                      {service.children.map((child) => {
                        const ChildIcon = SERVICE_ICON[child.key]
                        const isChildActive = matches(pathname, child.href)
                        return (
                          <DropdownMenuItem
                            key={child.href}
                            asChild
                            className={cn(
                              'group/item cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors focus:bg-brand-subtle/60',
                              isChildActive && 'bg-brand-subtle/40',
                            )}
                          >
                            <Link
                              href={child.href}
                              aria-current={isChildActive ? 'page' : undefined}
                            >
                              <span
                                className={cn(
                                  'inline-flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors',
                                  isChildActive
                                    ? 'bg-brand text-brand-foreground'
                                    : 'bg-brand/10 text-brand group-hover/item:bg-brand/15 group-focus/item:bg-brand/15',
                                )}
                              >
                                <ChildIcon className="size-5" strokeWidth={1.6} />
                              </span>

                              <div className="min-w-0 flex-1">
                                <p
                                  className={cn(
                                    'font-heading text-sm font-medium',
                                    isChildActive ? 'text-brand' : 'text-foreground',
                                  )}
                                >
                                  {t(child.key)}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {ts(`${child.key}Focus`)}
                                </p>
                              </div>

                              <ArrowRight className="size-4 shrink-0 -translate-x-1 text-brand opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus/item:translate-x-0 group-focus/item:opacity-100" />
                            </Link>
                          </DropdownMenuItem>
                        )
                      })}
                    </div>
                  </DropdownMenuPrimitive.SubContent>
                </DropdownMenuPrimitive.Sub>
              )
            }

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
