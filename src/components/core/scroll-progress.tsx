'use client'

import * as React from 'react'
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion'

interface ScrollProgressProps {
  containerRef: React.RefObject<HTMLElement>
  className?: string
}

export function ScrollProgress({
  containerRef,
  className = 'h-1',
}: ScrollProgressProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const scrollTimeout = React.useRef<NodeJS.Timeout | undefined>(undefined)

  const { scrollYProgress } = useScroll({
    container: containerRef,
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 18,
    mass: 0.3,
  })

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Only show the progress bar if we've scrolled down a meaningful amount
    // Increased threshold to avoid showing the bar when user hasn't actually scrolled
    const shouldBeVisible = latest > 0.01
    
    setIsVisible(shouldBeVisible)
    
    // If we're showing the progress bar, set a timeout to hide it after scrolling stops
    if (shouldBeVisible) {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
      scrollTimeout.current = setTimeout(() => {
        // Keep it visible if we're still scrolled down, just not actively scrolling
        // Don't hide it completely when inactive
      }, 1000)
    }
  })

  React.useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [])

  return (
    <motion.div
      className={className}
      style={{ scaleX, transformOrigin: 'left' }}
      animate={{
        opacity: isVisible ? 1 : 0
      }}
      transition={{
        opacity: { duration: 0.3 }
      }}
    />
  )
}
