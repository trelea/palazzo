import { useTranslations } from 'next-intl'
import { Bone, Dumbbell, PersonStanding } from 'lucide-react'

import { SectionTitle } from '@/components/section-title'
import { Reveal } from '@/components/reveal'
import { BorderBeam } from '@/components/ui/border-beam'

const ITEMS = [
  { key: 'muscle', Icon: Dumbbell },
  { key: 'joints', Icon: Bone },
  { key: 'back', Icon: PersonStanding },
] as const

export function ImpaccoRelief() {
  const t = useTranslations('ServicePages.impacco.relief')

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="grid items-start gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <Reveal direction="right" inView className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-brand/15 shadow-xl sm:aspect-4/3 lg:aspect-4/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/impacco_img1.jpg"
              alt="Impacco ritual setup"
              className="size-full object-cover object-center"
            />
            <BorderBeam size={120} duration={11} colorFrom="#51623D" colorTo="#9bb06f" />
          </div>
        </Reveal>

        <div className="text-left">
          <Reveal inView>
            <SectionTitle className="text-left">{t('heading')}</SectionTitle>
          </Reveal>

          <div className="mt-5 flex flex-col gap-6 sm:mt-6 sm:gap-7 lg:mt-8 lg:gap-8">
            {ITEMS.map(({ key, Icon }, i) => (
              <Reveal key={key} delay={0.1 * i} inView>
                <div className="text-left">
                  <div className="flex items-start gap-3 text-left">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <Icon className="size-4" strokeWidth={1.75} />
                    </span>
                    <h3 className="text-left font-heading text-lg font-medium text-foreground sm:text-xl">
                      {t(`items.${key}.title`)}
                    </h3>
                  </div>
                  <p className="mt-2 text-left text-base leading-relaxed text-pretty text-muted-foreground">
                    {t(`items.${key}.body`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
