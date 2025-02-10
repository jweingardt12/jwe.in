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
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
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
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
      }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-700/40 bg-white/50 dark:bg-zinc-800/50 backdrop-blur p-6 max-w-2xl mx-auto before:absolute before:w-80 before:h-80 before:-left-40 before:-top-40 before:bg-purple-500 before:rounded-full before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-500 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:group-hover:opacity-20 before:blur-[100px] after:absolute after:w-96 after:h-96 after:-left-48 after:-top-48 after:bg-indigo-500 after:rounded-full after:opacity-0 after:pointer-events-none after:transition-opacity after:duration-500 after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)] after:group-hover:opacity-20 after:blur-[100px] hover:border-zinc-200 dark:hover:border-zinc-600/50"
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