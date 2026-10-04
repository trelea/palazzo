'use client'

import { Bone, Brain, HeartPulse, Leaf, Sparkles, Wind } from 'lucide-react'

import { AnimatedTabsSection, type TabConfig } from '@/components/animated-tabs-section'

/** The six body systems the Galenic Cataplasm acts on; copy lives under
 * `ServicePages.impacco.benefits.tabs.<key>`. */
const TABS: readonly TabConfig[] = [
  { key: 'muscleJoint', Icon: Bone, blocks: ['p1', 'p2', 'p3', 'p4'] },
  { key: 'neurological', Icon: Brain, blocks: ['p1', 'p2', 'p3'] },
  { key: 'respiratory', Icon: Wind, blocks: ['p1', 'p2'] },
  { key: 'circulatory', Icon: HeartPulse, blocks: ['p1', 'p2', 'p3'] },
  { key: 'visceral', Icon: Leaf, blocks: ['p1', 'p2'] },
  { key: 'cutaneous', Icon: Sparkles, blocks: ['p1', 'p2'] },
]

export function BenefitsTabs() {
  return (
    <AnimatedTabsSection
      namespace="ServicePages.impacco.benefits"
      layoutId="benefits-active-pill"
      tabs={TABS}
    />
  )
}
