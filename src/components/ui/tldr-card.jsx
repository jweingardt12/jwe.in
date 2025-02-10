'use client'

import { motion } from 'framer-motion'
import React from 'react'
import { TldrLoadingSkeleton } from './tldr-loading-skeleton'

export function TldrCard({ data, isLoading }) {
  const glowRef = React.useRef(null)
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (!glowRef.current) return
      const rect = glowRef.current.getBoundingClientRect()
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }

    const element = glowRef.current
    if (element) {
      element.addEventListener('mousemove', handleMouseMove)
      return () => element.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-700/40 bg-white/50 dark:bg-zinc-800/50 backdrop-blur p-6 max-w-2xl mx-auto">
        <TldrLoadingSkeleton />
      </div>
    )
  }

  if (!data) {
    return null
  }

  const { jobTitle, companyName, introText, bulletPoints, relevantSkills } = data

  return (
    <motion.div
      ref={glowRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`,
      }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-700/40 bg-white/50 dark:bg-zinc-800/50 backdrop-blur p-6 max-w-2xl mx-auto before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:bg-[radial-gradient(circle_at_var(--mouse-x)%_var(--mouse-y)%,theme(colors.purple.400/0.15),transparent_50%)] group-hover:before:opacity-100"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <span className="text-xl">✨</span>
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              TL;DR - Why I'm a Great Fit for {jobTitle} at {companyName}
            </h2>
          </div>
          <button className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300">
            <span className="sr-only">Help</span>
            <span className="text-sm">?</span>
          </button>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400">{introText}</p>

        <div className="space-y-2">
          {bulletPoints?.slice(0, 3).map((point, index) => {
            const [title, content] = point.split(':')
            return (
              <div key={index} className="flex gap-2">
                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium shrink-0">
                  {title.replace(/\*\*/g, '')}:
                </span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {content?.trim()}
                </span>
              </div>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          {relevantSkills?.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
} 