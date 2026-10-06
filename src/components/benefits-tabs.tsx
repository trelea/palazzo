'use client'

import { Bone, Brain, HeartPulse, Sparkles } from 'lucide-react'

import { AnimatedTabsSection, type TabConfig } from '@/components/animated-tabs-section'

/** The four body systems the Galenic Cataplasm acts on; copy lives under
 * `ServicePages.impacco.benefits.tabs.<key>`. */
const TABS: readonly TabConfig[] = [
  { key: 'muscleJoint', Icon: Bone, blocks: ['p1', 'p2', 'p3', 'p4'] },
  { key: 'neurological', Icon: Brain, blocks: ['p1', 'p2', 'p3'] },
  { key: 'circulatory', Icon: HeartPulse, blocks: ['p1', 'p2', 'p3'] },
  { key: 'cutaneous', Icon: Sparkles, blocks: ['p1', 'p2'] },
]

export function BenefitsTabs() {
  return (
    <AnimatedTabsSection
      namespace="ServicePages.impacco.benefits"
      layoutId="benefits-active-pill"
      tabs={TABS}
      gridClass="grid-cols-2 lg:grid-cols-4"
    />
  )
}
