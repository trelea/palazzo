/** Shared Cal.com embed UI config — brand color matches the accent used across service pages (#51623D). */
export const CAL_EMBED_UI_CONFIG = {
  theme: 'light' as const,
  styles: { branding: { brandColor: '#51623D' } },
  hideEventTypeDetails: false,
  layout: 'month_view' as const,
}

/** Config passed to Cal.com modals — shared by data-attribute and programmatic triggers. */
export const CAL_EMBED_MODAL_CONFIG = {
  layout: 'month_view' as const,
  // Prefill the system phone field with Moldova's dial code — Cal.com has no
  // "default phone country" setting (it geo-guesses by IP, falling back to
  // US), but a prefilled value forces the country picker to MD (+373).
  attendeePhoneNumber: '+373',
}

/** JSON string for the `data-cal-config` attribute on trigger elements. */
export const CAL_EMBED_CONFIG_ATTR = JSON.stringify(CAL_EMBED_MODAL_CONFIG)
