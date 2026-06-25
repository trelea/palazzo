import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { cn } from '@/lib/utils'

/**
 * Subtle animated, brand-tinted grid used behind page heroes/headers. Radial
 * mask fades it out toward the edges so it reads as ambient texture, never
 * competing with the copy. Drop into any `relative isolate overflow-hidden`
 * section; it positions itself absolutely at `-z-10`.
 */
export function GridBackdrop({ className }: { className?: string }) {
  return (
    <AnimatedGridPattern
      numSquares={28}
      maxOpacity={0.12}
      duration={4}
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 h-full w-full fill-brand/15 stroke-brand/20 text-brand [mask-image:radial-gradient(60%_55%_at_50%_45%,#000,transparent)]',
        className,
      )}
    />
  )
}
