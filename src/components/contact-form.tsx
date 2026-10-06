'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'

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

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error'

/**
 * Stand-alone contact form (name + surname, email, phone) with its
 * confirmation modal. Rendered identically inline (appointment band) and
 * inside `ContactDialog` — one component, one endpoint, one flow.
 *
 * `idPrefix` keeps label/input ids unique when several instances share a page.
 */
export function ContactForm({ idPrefix = 'cta' }: { idPrefix?: string }) {
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

  const id = (name: string) => `${idPrefix}-${name}`

  return (
    <>
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {t('formHeading')}
      </h2>

      <form className="mt-8 flex flex-col gap-7" onSubmit={handleSubmit}>
        <div className="grid gap-7 sm:grid-cols-2">
          <Field id={id('name')} label={t('formNameLabel')}>
            <Input
              id={id('name')}
              name="name"
              required
              autoComplete="given-name"
              placeholder={t('formNamePlaceholder')}
              className={FIELD_INPUT}
            />
          </Field>
          <Field id={id('surname')} label={t('formSurnameLabel')}>
            <Input
              id={id('surname')}
              name="surname"
              required
              autoComplete="family-name"
              placeholder={t('formSurnamePlaceholder')}
              className={FIELD_INPUT}
            />
          </Field>
        </div>

        <Field id={id('email')} label={t('formEmailLabel')}>
          <Input
            id={id('email')}
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder={t('formEmailPlaceholder')}
            className={FIELD_INPUT}
          />
        </Field>

        <Field id={id('phone')} label={t('formPhoneLabel')}>
          <Input
            id={id('phone')}
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
    </>
  )
}
