"use client"

import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { MagicCard } from "@/components/ui/magic-card"

/** Responsive 3-column grid for bento cards — stacks on phones. */
function BentoGrid({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[minmax(0,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  )
}

function BentoCard({
  Icon,
  title,
  body,
  className,
  gradientColor = "rgba(81, 98, 61, 0.12)",
}: {
  Icon: LucideIcon
  title: string
  body: string
  className?: string
  gradientColor?: string
}) {
  return (
    <MagicCard
      gradientColor={gradientColor}
      gradientSize={220}
      className={cn(
        "rounded-3xl border-brand/15 bg-card p-6 shadow-sm sm:p-7",
        className,
      )}
    >
      <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <h3 className="mt-5 font-heading text-lg leading-snug font-medium text-balance text-foreground">
        {title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-pretty text-muted-foreground">{body}</p>
    </MagicCard>
  )
}

export { BentoGrid, BentoCard }
