import React from 'react'

/**
 * Replaces the Payload logo on the admin login screen. The admin panel does
 * not load the frontend Tailwind styles, so brand styling is inlined
 * (brand olive: #51623D, wordmark tracking mirrors the site navbar).
 */
export function Logo() {
  return (
    <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="Palazzo Aesthetics" height={96} src="/palazzo-logo.svg" width={96} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'center' }}>
        <span
          style={{
            color: '#51623D',
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '0.18em',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          Palazzo
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.32em',
            lineHeight: 1,
            opacity: 0.7,
            textTransform: 'uppercase',
          }}
        >
          Aesthetics
        </span>
      </div>
    </div>
  )
}
