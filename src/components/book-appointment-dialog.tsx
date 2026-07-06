'use client'

import { useState, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { getCalApi } from '@calcom/embed-react'
import { ArrowRight, HeartPulse, Leaf } from 'lucide-react'
import { Slot } from 'radix-ui'

import { SERVICE_LINKS, calBookingLink, type ServiceKey } from '@/lib/site'
import { CAL_EMBED_MODAL_CONFIG, CAL_EMBED_UI_CONFIG } from '@/lib/cal'
import { CalEmbedInit } from '@/components/cal-embed-init'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

/** Icon per discipline — mirrors the desktop/mobile services menus. */
const SERVICE_ICON: Record<ServiceKey, typeof Leaf> = {
  physiotherapy: HeartPulse,
  phytotherapy: Leaf,
}

/**
 * Opens the Cal.com booking popup for a service programmatically. Unlike the
 * `data-cal-*` attribute pattern (used on service pages), this works from
 * handlers that also unmount their trigger — e.g. closing our own dialog on
 * the same click — because it doesn't rely on Cal's document-level click
 * listener reading the clicked element.
 */
export async function openCalModal(service: ServiceKey) {
  const cal = await getCalApi({ namespace: service })
  cal('ui', CAL_EMBED_UI_CONFIG)
  cal('modal', { calLink: calBookingLink(service), config: CAL_EMBED_MODAL_CONFIG })
}

/**
 * Slot wrapper that opens the Cal.com booking popup for a fixed service on
 * click — for buttons that already know their service (e.g. the per-service
 * cards on the home page) and don't need the picker dialog.
 */
export function BookServiceTrigger({
  service,
  children,
}: {
  service: ServiceKey
  children: ReactNode
}) {
  return <Slot.Root onClick={() => void openCalModal(service)}>{children}</Slot.Root>
}

/**
 * Service-picker appointment dialog. Wraps its trigger (`children`, slotted —
 * pass a styled button) and, on click, opens a small modal listing the
 * services; picking one closes the dialog and opens the Cal.com booking popup
 * for that service.
 */
export function BookAppointmentDialog({
  children,
  onServiceSelected,
}: {
  /** Trigger element — slotted via `DialogTrigger asChild`. */
  children: ReactNode
  /** Extra cleanup on pick — e.g. the mobile menu passes its sheet `close`. */
  onServiceSelected?: () => void
}) {
  const t = useTranslations('BookDialog')
  const tn = useTranslations('Nav')
  const ts = useTranslations('HomePage.services')

  const [open, setOpen] = useState(false)
  // Cal's embed script only loads once the dialog is first opened — the
  // navbar renders this component sitewide, so eager init would pull the
  // script on every page.
  const [primed, setPrimed] = useState(false)

  function pick(service: ServiceKey) {
    setOpen(false)
    onServiceSelected?.()
    void openCalModal(service)
  }

  return (
    <>
      {primed &&
        SERVICE_LINKS.map(({ key }) => <CalEmbedInit key={key} namespace={key} />)}

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (next) setPrimed(true)
        }}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="gap-6 p-8 sm:max-w-xl sm:p-10"
          // Keep Radix from restoring focus to the trigger — the Cal.com
          // modal is taking over right after the dialog closes.
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-3xl">{t('title')}</DialogTitle>
            <DialogDescription className="text-base">{t('description')}</DialogDescription>
          </DialogHeader>

          {/* min-w-0 lets the grid track compress below the cards' intrinsic
              width — the truncated subline otherwise forces the column past
              the panel's padding on narrow screens. */}
          <div className="flex min-w-0 flex-col gap-3">
            {SERVICE_LINKS.map(({ key }) => {
              const Icon = SERVICE_ICON[key]
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => pick(key)}
                  className="group/item flex items-center gap-4 rounded-xl border border-brand/15 p-4 text-left transition-colors hover:bg-brand-subtle/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:p-5"
                >
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors group-hover/item:bg-brand group-hover/item:text-brand-foreground sm:size-14">
                    <Icon className="size-6 sm:size-7" strokeWidth={1.6} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-lg font-semibold text-foreground sm:text-xl">
                      {tn(key)}
                    </p>
                    <p className="truncate text-sm text-muted-foreground sm:text-base">
                      {ts(`${key}Focus`)}
                    </p>
                  </div>
                  <ArrowRight className="size-5 shrink-0 text-brand opacity-0 transition-opacity group-hover/item:opacity-100" />
                </button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
