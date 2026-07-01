'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, CalendarCheck, CheckCircle2, Loader2, Mail, Phone } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { CONTACT, calBookingLink, type ServiceKey } from '@/lib/site'
import { CAL_EMBED_CONFIG_ATTR } from '@/lib/cal'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { BorderBeam } from '@/components/ui/border-beam'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { SectionTitle } from '@/components/section-title'

/** Minimalist underline input — a thin bottom rule in brand green that darkens on focus. */
const FIELD_INPUT =
  'h-11 rounded-none border-0 border-b border-brand/60 bg-transparent px-0 transition-colors focus-visible:border-brand focus-visible:ring-0'

/** A labelled form field — stacks a shadcn `Label` over an underline-only control. */
function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={id}
        className="text-[0.7rem] font-semibold tracking-[0.12em] text-foreground uppercase"
      >
        {label}
      </Label>
      {children}
    </div>
  )
}

/**
 * Shared appointment CTA — two separate panels: the LEFT panel invites the
 * visitor to book an appointment and carries the booking button (plus direct
 * contact details); the RIGHT panel is a stand-alone contact form (name +
 * surname, email, phone). Copy lives in the `Cta` i18n namespace so the block
 * can be reused across pages (home, contacts, …).
 *
 * Client component: the form submit is handled locally. Wire `onSubmit` to a
 * real endpoint/route handler when one is available.
 */
type SubmitStatus = 'idle' | 'sending' | 'success' | 'error'

export function AppointmentCta({
  className,
  service,
}: {
  className?: string
  /**
   * When set (only from `ServicePage`), the book button opens the Cal.com
   * modal for this service instead of linking to `/contacts`. Requires a
   * `<CalEmbedInit namespace={service} />` mounted on the page (ServicePage
   * does this) so the click listener is already registered.
   */
  service?: ServiceKey
}) {
  const t = useTranslations('Cta')
  const locale = useLocale()

  const [status, setStatus] = useState<SubmitStatus>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get('name') ?? ''),
      surname: String(formData.get('surname') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      locale,
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Request failed')
      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className={cn('mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-6 lg:px-8', className)}>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── LEFT — book an appointment ── */}
        <div className="relative isolate flex flex-col overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-brand to-brand-muted p-8 text-brand-foreground shadow-sm sm:p-10 lg:p-12">
          <div className="flex items-center gap-4">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10">
              <CalendarCheck className="size-5" />
            </span>
            <SectionTitle tone="onBrand">{t('appointmentHeading')}</SectionTitle>
          </div>
          <p className="mt-5 max-w-md text-base leading-relaxed text-brand-foreground/85 sm:text-lg">
            {t('appointmentBody')}
          </p>

          {/* Booking button lives in this panel. On service pages this opens
              the Cal.com modal for that service; elsewhere it links to
              /contacts. */}
          {service ? (
            <Button
              type="button"
              data-cal-namespace={service}
              data-cal-link={calBookingLink(service)}
              data-cal-config={CAL_EMBED_CONFIG_ATTR}
              className="mt-8 h-auto w-fit rounded-lg bg-white px-6 py-3 text-sm font-medium text-brand hover:bg-white/90"
            >
              {t('appointmentButton')}
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              asChild
              className="mt-8 h-auto w-fit rounded-lg bg-white px-6 py-3 text-sm font-medium text-brand hover:bg-white/90"
            >
              <Link href="/contacts">
                {t('appointmentButton')}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}

          <div className="mt-8 space-y-3 border-t border-white/15 pt-8">
            {CONTACT.phone && (
              <a
                href={CONTACT.phoneHref ?? undefined}
                className="flex items-center gap-3 text-sm text-brand-foreground/90 transition-colors hover:text-brand-foreground"
              >
                <Phone className="size-4 shrink-0" />
                {CONTACT.phone}
              </a>
            )}
            <a
              href={CONTACT.emailHref}
              className="flex items-center gap-3 text-sm text-brand-foreground/90 transition-colors hover:text-brand-foreground"
            >
              <Mail className="size-4 shrink-0" />
              {CONTACT.email}
            </a>
          </div>

          {/* Full-bleed photo filling the bottom half of the panel, edge-to-edge.
              The image is masked so its top fades to transparent — the brand
              panel shows through, giving a real colour-into-photo transition. */}
          <div className="relative -mx-8 -mb-8 mt-10 h-56 sm:-mx-10 sm:-mb-10 sm:h-72 lg:-mx-12 lg:-mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photo2.jpeg"
              alt="A Palazzo Aesthetics physiotherapy treatment room"
              className="size-full object-cover object-center [mask-image:linear-gradient(to_bottom,transparent_0%,#000_55%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,#000_55%)]"
            />
          </div>

          <BorderBeam size={160} duration={12} colorFrom="#ffffff" colorTo="#9bb06f" />
        </div>

        {/* ── RIGHT — contact us form ── */}
        <div className="rounded-3xl border border-brand/15 bg-card p-8 shadow-sm sm:p-10 lg:p-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t('formHeading')}
          </h2>

          <form className="mt-8 flex flex-col gap-7" onSubmit={handleSubmit}>
            <div className="grid gap-7 sm:grid-cols-2">
              <Field id="cta-name" label={t('formNameLabel')}>
                <Input
                  id="cta-name"
                  name="name"
                  required
                  autoComplete="given-name"
                  placeholder={t('formNamePlaceholder')}
                  className={FIELD_INPUT}
                />
              </Field>
              <Field id="cta-surname" label={t('formSurnameLabel')}>
                <Input
                  id="cta-surname"
                  name="surname"
                  required
                  autoComplete="family-name"
                  placeholder={t('formSurnamePlaceholder')}
                  className={FIELD_INPUT}
                />
              </Field>
            </div>

            <Field id="cta-email" label={t('formEmailLabel')}>
              <Input
                id="cta-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder={t('formEmailPlaceholder')}
                className={FIELD_INPUT}
              />
            </Field>

            <Field id="cta-phone" label={t('formPhoneLabel')}>
              <Input
                id="cta-phone"
                type="tel"
                name="phone"
                required
                autoComplete="tel"
                placeholder={t('formPhonePlaceholder')}
                className={FIELD_INPUT}
              />
            </Field>

            <Button
              type="submit"
              disabled={status === 'sending'}
              className="mt-1 h-auto w-fit rounded-lg bg-brand px-6 py-3 text-sm font-medium text-brand-foreground hover:bg-brand-muted"
            >
              {status === 'sending' ? t('formSending') : t('formSubmit')}
              {status === 'sending' ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowRight className="size-4" />
              )}
            </Button>

            <div aria-live="polite" className="min-h-5">
              {status === 'error' && (
                <p className="text-sm font-medium text-destructive">{t('formError')}</p>
              )}
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">{t('formConsent')}</p>
          </form>
        </div>
      </div>

      {/* Confirmation modal — opens once the submission succeeds. */}
      <Dialog
        open={status === 'success'}
        onOpenChange={(open) => {
          if (!open) setStatus('idle')
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <div className="flex flex-col items-center gap-5 px-2 py-4 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-brand/10">
              <CheckCircle2 className="size-7 text-brand" strokeWidth={1.5} />
            </span>

            <div className="space-y-2">
              <DialogTitle className="text-2xl">{t('successDialogTitle')}</DialogTitle>
              <DialogDescription className="text-balance">
                {t('successDialogBody')}
              </DialogDescription>
            </div>

            <DialogClose asChild>
              <Button className="mt-1 h-auto w-full rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-brand-foreground hover:bg-brand-muted">
                {t('successDialogClose')}
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
