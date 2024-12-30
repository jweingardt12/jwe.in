'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export function CardStack({ images }) {
  const [cards, setCards] = useState(images)
  const [isDragging, setIsDragging] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const moveToBack = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCards(prevCards => [...prevCards.slice(1), prevCards[0]])
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    }, 300)
  }, [isAnimating])

  useEffect(() => {
    let interval
    if (!isDragging && !isPaused && !isAnimating) {
      interval = setInterval(moveToBack, 5000)
    }
    return () => clearInterval(interval)
  }, [isDragging, isPaused, isAnimating, moveToBack])

  return (
    <div 
      className="relative w-[300px] h-[400px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        {cards.map((image, index) => (
          <motion.div
            key={image.src}
            className="absolute w-full h-full rounded-2xl bg-white overflow-hidden cursor-grab active:cursor-grabbing"
            style={{
              zIndex: cards.length - index,
              boxShadow: index === 0 
                ? '0 8px 16px -3px rgba(0,0,0,0.15), 0 2px 8px -3px rgba(0,0,0,0.1)'
                : '0 4px 6px -1px rgba(0,0,0,0.1)',
            }}
            animate={{
              scale: isAnimating && index === 0 ? 0.95 : 1 - index * 0.05,
              y: isAnimating && index === 0 ? 30 : index * 10,
              x: isAnimating && index === 0 ? 30 : index === 1 ? 10 : -10,
              rotateZ: isAnimating && index === 0 ? 3 : index === 1 ? 2 : -2,
            }}
            drag={index === 0 && !isAnimating ? "x" : false}
            dragConstraints={{ left: -20, right: 20 }}
            dragElastic={0.08}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e, { offset, velocity }) => {
              setIsDragging(false)
              if (Math.abs(offset.x) > 15 || Math.abs(velocity.x) > 300) {
                moveToBack()
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
              draggable={false}
              priority={index === 0}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
} 