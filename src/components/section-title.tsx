import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** The one canonical section-title style — size, font, weight, tracking, balance. */
const SECTION_TITLE_CLASS =
  'font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl'

/**
 * Standard section title used to introduce every page section. `tone="onBrand"`
 * switches to the light text used on brand-coloured panels; the default is
 * `text-foreground`. Alignment and margins are left to the call site via
 * `className` so per-section layout (eyebrow spacing, centering) stays local.
 */
export function SectionTitle({
  children,
  as: Tag = 'h2',
  tone = 'default',
  className,
}: {
  children: ReactNode
  as?: 'h2' | 'h3'
  tone?: 'default' | 'onBrand'
  className?: string
}) {
  return (
    <Tag
      className={cn(
        SECTION_TITLE_CLASS,
        tone === 'onBrand' ? 'text-brand-foreground' : 'text-foreground',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
