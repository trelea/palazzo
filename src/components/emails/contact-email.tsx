import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

import { LOGO_SRC } from '@/lib/site'

/** Absolute logo URL — email clients can't resolve the site-relative path. */
const LOGO_URL = `${(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')}${LOGO_SRC}`

export interface ContactEmailProps {
  name: string
  surname: string
  email: string
  phone: string
  /** Optional free-text message, if the form ever collects one. */
  message?: string
  /** UI locale the visitor submitted from (e.g. `ro`, `ru`, `en`). */
  locale?: string
}

/**
 * Brand palette mirrored from the site's `globals.css` (olive green from the
 * logo, #51623D). Hex values are used here because email clients don't support
 * the `oklch()` CSS variables the web app relies on.
 */
const brand = {
  DEFAULT: '#51623d',
  muted: '#6b7d4f',
  subtle: '#f2f5ec',
  foreground: '#fbfbf8',
}

/** A labelled row — uppercase tracked label over the value, echoing the site UI. */
function FieldRow({
  label,
  children,
  last,
}: {
  label: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <Section className={last ? 'py-4' : 'border-b border-solid border-[#efefec] py-4'}>
      <Text className="m-0 text-[11px] font-medium uppercase tracking-[0.14em] text-[#a3a39d]">
        {label}
      </Text>
      <Text className="m-0 mt-1 text-[15px] leading-6 text-[#1c1c1a]">{children}</Text>
    </Section>
  )
}

/**
 * The email the business receives whenever a visitor submits the contact form.
 * Authored with React Email + Tailwind to match the landing page; rendered to
 * an HTML string in the route handler (Resend's `react` option is incompatible
 * with React 19 in this project).
 */
export function ContactEmail({ name, surname, email, phone, message, locale }: ContactEmailProps) {
  const fullName = [name, surname].filter(Boolean).join(' ') || '—'

  return (
    <Html>
      <Head />
      <Preview>{`New contact form submission — ${fullName}`}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: { brand },
            },
          },
        }}
      >
        <Body className="m-0 bg-[#faf9f6] py-10 font-sans">
          <Container className="mx-auto max-w-[480px] px-6">
            {/* Wordmark — small and centered, not a heavy banner. */}
            <Section className="pb-7 text-center">
              <Img src={LOGO_URL} width="36" height="36" alt="Palazzo Aesthetics" className="mx-auto" />
            </Section>

            <Container className="rounded-[20px] border border-solid border-[#eeede8] bg-white px-8 py-8">
              <Text className="m-0 text-[11px] font-medium uppercase tracking-[0.16em] text-brand">
                New inquiry
              </Text>
              <Heading className="m-0 mt-1.5 text-[21px] font-semibold tracking-tight text-[#1c1c1a]">
                {fullName}
              </Heading>
              <Text className="m-0 mt-1 text-[13px] leading-5 text-[#a3a39d]">
                Submitted via the website contact form{locale ? ` · ${locale.toUpperCase()}` : ''}
              </Text>

              <Section className="mt-6">
                <FieldRow label="Email">
                  <Link href={`mailto:${email}`} className="text-brand underline">
                    {email}
                  </Link>
                </FieldRow>
                <FieldRow label="Phone" last={!message}>
                  <Link href={`tel:${phone}`} className="text-brand underline">
                    {phone}
                  </Link>
                </FieldRow>
                {message ? (
                  <FieldRow label="Message" last>
                    {message}
                  </FieldRow>
                ) : null}
              </Section>
            </Container>

            <Text className="m-0 mt-6 text-center text-[12px] leading-5 text-[#a3a39d]">
              Palazzo Aesthetics · Str. Igor Vieru 16/1, Chișinău
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
