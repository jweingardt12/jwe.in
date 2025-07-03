'use client'

import * as React from 'react'
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion'

interface ScrollProgressProps {
  containerRef?: React.RefObject<HTMLElement>
  className?: string
}

export function ScrollProgress({
  containerRef,
  className = 'h-1',
}: ScrollProgressProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  // Track scroll progress of the window
  const { scrollYProgress } = useScroll()

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 30,
    restDelta: 0.001
  })

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Show the progress bar as soon as there's any scroll
    setIsVisible(latest > 0)
  })

  return (
    <motion.div
      className={className}
      style={{ 
        scaleX, 
        transformOrigin: 'left',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0
      }}
      transition={{
        opacity: { duration: 0.2 }
      }}
    />
  )
}
