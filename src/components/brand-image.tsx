'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import { LOGO_SRC } from '@/lib/site'

/**
 * Image with a brand skeleton. Until the picture paints, a softly pulsing
 * panel showing the Palazzo mark covers the (already aspect-ratio'd) container,
 * so cards and galleries never flash in from blank space.
 *
 * The skeleton is an absolutely-positioned overlay *above* the image and fades
 * out on load — the `<img>` keeps its own classes untouched, so hover
 * transforms and object-fit behave exactly as before. The caller supplies the
 * `relative` container, so there is no layout shift.
 */
export function BrandImage({
  src,
  alt,
  className,
  skeletonClassName,
  logoClassName,
  loading,
  fetchPriority,
  decoding = 'async',
}: {
  src: string
  alt: string
  /** Classes for the `<img>` itself (positioning, object-fit, hover transforms). */
  className?: string
  /** Extra classes for the skeleton overlay (background tint, etc.). */
  skeletonClassName?: string
  /** Extra classes for the centred brand mark. */
  logoClassName?: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
  decoding?: 'async' | 'sync' | 'auto'
}) {
  const ref = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  // `onLoad` may have already fired for a cached image before hydration — catch
  // that so the skeleton never gets stuck over an image that is already there.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true)
  }, [])

  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-brand-subtle/70 transition-opacity duration-500 ease-out',
          loaded ? 'opacity-0' : 'animate-pulse opacity-100',
          skeletonClassName,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_SRC}
          alt=""
          aria-hidden="true"
          className={cn('h-1/3 max-h-16 w-auto opacity-40', logoClassName)}
        />
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        onLoad={() => setLoaded(true)}
        className={className}
      />
    </>
  )
}
