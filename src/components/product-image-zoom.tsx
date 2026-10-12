'use client'

import { useState } from 'react'
import { Maximize2 } from 'lucide-react'

import { Dialog, DialogContent } from '@/components/ui/dialog'

export function ProductImageZoom({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="View full image"
        className="absolute right-3 top-3 z-20 flex size-10 items-center justify-center rounded-full border border-white/40 bg-white/85 text-brand opacity-0 shadow-sm backdrop-blur-md transition-opacity duration-200 hover:bg-white group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
      >
        <Maximize2 className="size-5" strokeWidth={2} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-screen w-screen max-w-none items-center justify-center border-0 bg-black/80 p-0 m-0 sm:max-w-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="h-full w-full object-contain" />
        </DialogContent>
      </Dialog>
    </>
  )
}
