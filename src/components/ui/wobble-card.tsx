'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

/**
 * Aceternity UI Wobble Card, adapted for this project: the card follows the
 * cursor while its content counter-translates with a slight zoom, giving a
 * soft parallax "wobble". Noise overlay and default background removed —
 * appearance is left to the call site via `containerClassName`/`className`.
 */
export const WobbleCard = ({
  children,
  containerClassName,
  className,
}: {
  children: React.ReactNode
  containerClassName?: string
  className?: string
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = event
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (clientX - (rect.left + rect.width / 2)) / 20
    const y = (clientY - (rect.top + rect.height / 2)) / 20
    setMousePosition({ x, y })
  }

  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        setMousePosition({ x: 0, y: 0 })
      }}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
          : 'translate3d(0px, 0px, 0) scale3d(1, 1, 1)',
        transition: 'transform 0.1s ease-out',
      }}
      className={cn('relative mx-auto w-full overflow-hidden rounded-2xl', containerClassName)}
    >
      <motion.div
        style={{
          transform: isHovering
            ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.03, 1.03, 1)`
            : 'translate3d(0px, 0px, 0) scale3d(1, 1, 1)',
          transition: 'transform 0.1s ease-out',
        }}
        className={cn('h-full', className)}
      >
        {children}
      </motion.div>
    </motion.section>
  )
}
