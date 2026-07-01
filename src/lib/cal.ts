/** Shared Cal.com embed UI config — brand color matches the accent used across service pages (#51623D). */
export const CAL_EMBED_UI_CONFIG = {
  theme: 'light' as const,
  styles: { branding: { brandColor: '#51623D' } },
  hideEventTypeDetails: false,
  layout: 'month_view' as const,
}

/** JSON string for the `data-cal-config` attribute on trigger elements. */
export const CAL_EMBED_CONFIG_ATTR = JSON.stringify({ layout: 'month_view' })
