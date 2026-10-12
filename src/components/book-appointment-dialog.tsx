import type { ReactNode } from 'react'

import { BOOKING_LINK } from '@/lib/site'

/**
 * Wraps a booking button and navigates to the external booking page on click.
 * Replaces the former Cal.com modal trigger — all booking buttons across the
 * site now share a single destination.
 */
export function BookServiceTrigger({ children }: { children: ReactNode }) {
  return (
    <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

/**
 * Booking link wrapper — renders children as a link to the external booking
 * page. Replaces the former service-picker dialog.
 */
export function BookAppointmentDialog({ children }: { children: ReactNode }) {
  return (
    <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}
