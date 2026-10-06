'use client'

import { useTranslations } from 'next-intl'
import { ArrowRight, CalendarCheck, Mail, Phone } from 'lucide-react'

import { CONTACT, BOOKING_LINK } from '@/lib/site'
import { cn } from '@/lib/utils'
import { BorderBeam } from '@/components/ui/border-beam'
import { SectionTitle } from '@/components/section-title'
import { ContactForm } from '@/components/contact-form'

/**
 * Shared appointment CTA — two separate panels: the LEFT panel invites the
 * visitor to book an appointment and carries the booking button (plus direct
 * contact details); the RIGHT panel renders the shared `ContactForm`.
 * Copy lives in the `Cta` i18n namespace so the block can be reused across
 * pages (home, contacts, …).
 */
export function AppointmentCta({ className }: { className?: string }) {
  const t = useTranslations('Cta')

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

          <a
            href={BOOKING_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-auto w-fit items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-brand transition-colors hover:bg-white/90"
          >
            {t('appointmentButton')}
            <ArrowRight className="size-4" />
          </a>

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
              alt="A Palazzo Aesthetics treatment room"
              className="size-full object-cover object-center [mask-image:linear-gradient(to_bottom,transparent_0%,#000_55%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,#000_55%)]"
            />
          </div>

          <BorderBeam size={160} duration={12} colorFrom="#ffffff" colorTo="#9bb06f" />
        </div>

        {/* ── RIGHT — contact us form (shared component) ── */}
        <div className="rounded-3xl border border-brand/15 bg-card p-8 shadow-sm sm:p-10 lg:p-12">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
