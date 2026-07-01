import { render } from '@react-email/render'
import { Resend } from 'resend'

import { ContactEmail } from '@/components/emails/contact-email'

/**
 * Contact form endpoint. Receives the visitor's details from the
 * `AppointmentCta` form and emails them to the business inbox via Resend.
 *
 * Required env vars:
 *   RESEND_API_KEY    — your Resend API key.
 * Optional env vars:
 *   CONTACT_FROM_EMAIL — verified sender ("Name <addr@domain>"). Defaults to
 *                        Resend's onboarding sender, which only works while testing.
 *   CONTACT_TO_EMAIL   — business recipient. Defaults to the studio address.
 */

const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? 'Palazzo Aesthetics <onboarding@resend.dev>'
const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'rcv.hw.oficial@gmail.com'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    console.error('[contact] RESEND_API_KEY is not set')
    return Response.json({ error: 'Email service is not configured.' }, { status: 500 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const data = (body ?? {}) as Record<string, unknown>
  const name = asString(data.name)
  const surname = asString(data.surname)
  const email = asString(data.email)
  const phone = asString(data.phone)
  const message = asString(data.message)
  const locale = asString(data.locale)

  if (!name || !surname || !email || !phone) {
    return Response.json({ error: 'Please fill in all required fields.' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: 'Please provide a valid email address.' }, { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const emailProps = { name, surname, email, phone, message, locale }

  try {
    const [html, text] = await Promise.all([
      render(ContactEmail(emailProps)),
      render(ContactEmail(emailProps), { plainText: true }),
    ])

    const { data: sent, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      // Let the business reply straight to the visitor.
      replyTo: email,
      subject: `New contact form submission — ${name} ${surname}`,
      html,
      text,
    })

    if (error) {
      console.error('[contact] Resend error', error)
      return Response.json({ error: 'Could not send your message.' }, { status: 502 })
    }

    return Response.json({ id: sent?.id ?? null })
  } catch (err) {
    console.error('[contact] Unexpected error', err)
    return Response.json({ error: 'Could not send your message.' }, { status: 500 })
  }
}
