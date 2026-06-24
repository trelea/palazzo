'use client'

import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Check, ChevronDown, Globe } from 'lucide-react'

import { routing } from '@/i18n/routing'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const LOCALE_LABELS: Record<string, string> = {
  ro: 'Română',
  en: 'English',
  ru: 'Русский',
}

type Props = {
  /** Render as a full-width block (used inside the mobile sheet). */
  block?: boolean
  className?: string
}

export function LanguageSwitcher({ block = false, className }: Props) {
  const t = useTranslations('Nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function switchTo(next: string) {
    if (next === locale) return
    startTransition(() => {
      // `pathname` is locale-agnostic here, so the same path is kept.
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={t('language')}
          disabled={isPending}
          className={cn(
            'gap-1.5 text-foreground/70 hover:text-foreground',
            block && 'w-full justify-between',
            className,
          )}
        >
          <span className="flex items-center gap-1.5">
            <Globe className="size-4" />
            <span className="uppercase">{locale}</span>
          </span>
          <ChevronDown className="size-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onSelect={() => switchTo(loc)}
            className="justify-between gap-3"
          >
            <span>{LOCALE_LABELS[loc] ?? loc.toUpperCase()}</span>
            {loc === locale && <Check className="size-4 text-brand" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
