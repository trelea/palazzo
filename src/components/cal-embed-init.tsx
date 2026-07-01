'use client'

import { useEffect } from 'react'
import { getCalApi } from '@calcom/embed-react'

import { CAL_EMBED_UI_CONFIG } from '@/lib/cal'

/**
 * Registers Cal.com's document-level click listener for a given namespace,
 * once per page. Any element elsewhere on the page with
 * `data-cal-namespace={namespace}` + `data-cal-link` then opens the Cal.com
 * popup modal on click — no per-button JS required.
 */
export function CalEmbedInit({ namespace }: { namespace: string }): null {
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const cal = await getCalApi({ namespace })
      if (cancelled) return
      cal('ui', CAL_EMBED_UI_CONFIG)
    })()
    return () => {
      cancelled = true
    }
  }, [namespace])

  return null
}
