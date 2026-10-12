'use client'

import { useTranslations } from 'next-intl'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ContactForm } from '@/components/contact-form'

/**
 * The contact form as a modal — the exact same `ContactForm` component (same
 * fields, same endpoint, same success flow) as the appointment band, opened
 * on demand from the Face/Body intros.
 */
export function ContactDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations('Cta')
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {/* Screen-reader title (Radix requirement) — the visible heading comes
            from `ContactForm` itself. */}
        <DialogTitle className="sr-only">{t('formHeading')}</DialogTitle>
        <div className="px-1 py-2">
          <ContactForm idPrefix="contact-dialog" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
