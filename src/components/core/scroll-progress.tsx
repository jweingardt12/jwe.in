'use client'

import * as React from 'react'
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion'

interface ScrollProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  containerRef: React.RefObject<HTMLElement>
  className?: string
}

export function ScrollProgress({
  containerRef,
  className = 'h-1',
  ...props
}: ScrollProgressProps) {
  const [isScrolling, setIsScrolling] = React.useState(false)
  const scrollTimeout = React.useRef<NodeJS.Timeout>()

  const { scrollYProgress } = useScroll({
    container: containerRef,
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 18,
    mass: 0.3,
  })

  useMotionValueEvent(scrollYProgress, "change", () => {
    setIsScrolling(true)
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false)
    }, 1000)
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
        opacity: isScrolling ? 1 : 0
      }}
      transition={{
        opacity: { duration: 0.3 }
      }}
      {...props}
    />
  )
}
