'use client'

import { useEffect } from 'react'

import { AGENCY } from '@/lib/site'

/**
 * Console-only developer credit — renders null, so it leaves no UI
 * footprint. A client component (rather than dangerouslySetInnerHTML)
 * so the credit also shows in the browser console, not just in metadata.
 */
export function DevCredit(): null {
  useEffect(() => {
    console.info(`Built by ${AGENCY.name} — ${AGENCY.person.name} · ${AGENCY.url}`)
  }, [])

  return null
}
