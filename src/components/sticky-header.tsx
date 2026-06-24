'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

/**
 * Thin client wrapper that owns ONLY the scroll-aware background state.
 * Its `children` are rendered on the server and passed through, so the logo,
 * nav links and CTA stay in the Server Component tree.
 */
export function StickyHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-[colors,box-shadow] duration-300',
        scrolled
          ? 'border-border/60 bg-background/80 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/65'
          : 'border-transparent bg-background/0 shadow-none',
      )}
    >
      {children}
    </header>
  )
}
