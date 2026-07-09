'use client'

import {
  Apple,
  Brain,
  ClipboardList,
  Droplets,
  Dumbbell,
  PersonStanding,
  Sparkles,
} from 'lucide-react'

import { AnimatedTabsSection, type TabConfig } from '@/components/animated-tabs-section'

/** The seven physio-aesthetic treatments; copy lives under
 * `ServicePages.phytoaestetica.treatments.tabs.<key>`. */
const TABS: readonly TabConfig[] = [
  { key: 'consultation', Icon: ClipboardList, blocks: ['p1', 'p2'], title: true },
  {
    key: 'cellularReactivation',
    Icon: Sparkles,
    blocks: ['h1', 'p1', 'p2', 'p3', 'p4', 'h2', 'p5', 'p6', 'p7'],
  },
  { key: 'lymphaticDrainage', Icon: Droplets, blocks: ['p1', 'p2', 'p3'], title: true },
  { key: 'posturalReeducation', Icon: PersonStanding, blocks: ['p1', 'p2'] },
  { key: 'nutrition', Icon: Apple, blocks: ['p1', 'p2'] },
  { key: 'personalTraining', Icon: Dumbbell, blocks: ['p1', 'p2'] },
  { key: 'mentalCoaching', Icon: Brain, blocks: ['p1', 'p2'] },
]

export function PhytoTreatmentsTabs() {
  return (
    <AnimatedTabsSection
      namespace="ServicePages.phytoaestetica.treatments"
      layoutId="treatments-active-pill"
      tabs={TABS}
      gridClass="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
    />
  )
}
