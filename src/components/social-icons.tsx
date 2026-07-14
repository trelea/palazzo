/**
 * Brand social icons, inlined because lucide v1 dropped its brand glyphs.
 * Shared by the footer, the homepage social CTA, and the contacts page.
 */

export function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14 9h2.5l.5-3H14V4.5c0-.86.28-1.5 1.6-1.5H17V.3A22 22 0 0 0 14.9 0C12.6 0 11 1.34 11 4.05V6H8.5v3H11v9h3V9Z" />
    </svg>
  )
}
