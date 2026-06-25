import { cn } from '@/lib/utils'

/**
 * Server-rendered entrance animation (CSS only, no client JS) — drop-in
 * replacement for Magic UI's client `BlurFade`. Plays on load via
 * tw-animate-css utilities; `delay` is in seconds to match the old API.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  /** Accepted for call-site compatibility; CSS reveal plays on load. */
  inView?: boolean
}) {
  const slide = {
    up: 'slide-in-from-bottom-3',
    down: 'slide-in-from-top-3',
    left: 'slide-in-from-right-4',
    right: 'slide-in-from-left-4',
  }[direction]

  return (
    <div
      className={cn('animate-in fade-in-0 fill-mode-both duration-700 ease-out', slide, className)}
      style={delay ? { animationDelay: `${delay * 1000}ms` } : undefined}
    >
      {children}
    </div>
  )
}
