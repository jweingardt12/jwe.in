
'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export function CardStack({ images }) {
  const [cards, setCards] = useState(images)
  const [isDragging, setIsDragging] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState(0)

  const moveToBack = useCallback((fromDrag = false) => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(fromDrag ? direction : Math.random() > 0.5 ? 1 : -1)
    
    setTimeout(() => {
      setCards(prevCards => [...prevCards.slice(1), prevCards[0]])
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    }, 300)
  }, [isAnimating, direction])

  useEffect(() => {
    let interval
    if (!isDragging && !isPaused && !isAnimating) {
      interval = setInterval(moveToBack, 5000)
    }
    return () => clearInterval(interval)
  }, [isDragging, isPaused, isAnimating, moveToBack])

  return (
    <div 
      className="relative w-[300px] h-[400px] mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {cards.map((image, index) => (
          <motion.div
            key={image.src}
            className="absolute w-full h-full rounded-2xl bg-white overflow-hidden cursor-grab active:cursor-grabbing"
            style={{
              zIndex: cards.length - index,
              transformOrigin: direction >= 0 ? '0% 100%' : '100% 100%',
              boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
            }}
            animate={{
              scale: 1 - index * 0.05,
              y: index * 15,
              rotate: (index === 0 && isAnimating) ? (direction >= 0 ? 5 : -5) : 0,
              x: (index === 0 && isAnimating) ? (direction >= 0 ? 50 : -50) : 0,
            }}
            exit={{
              x: direction >= 0 ? 200 : -200,
              y: 50,
              rotate: direction >= 0 ? 20 : -20,
              opacity: 0,
            }}
            drag={index === 0 && !isAnimating ? "x" : false}
            dragConstraints={{ left: -100, right: 100 }}
            dragElastic={0.9}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e, { offset, velocity }) => {
              setIsDragging(false)
              if (Math.abs(offset.x) > 100 || Math.abs(velocity.x) > 500) {
                setDirection(offset.x > 0 ? 1 : -1)
                moveToBack(true)
              }
            }}
            transition={{
              duration: 0.3,
              ease: [0.32, 0.72, 0, 1]
            }}
          >
            <Image
              src={image}
              alt={`Card ${index + 1}`}
              fill
              className="object-cover pointer-events-none rounded-2xl"
              sizes="(min-width: 640px) 300px, 300px"
              priority={index === 0}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
