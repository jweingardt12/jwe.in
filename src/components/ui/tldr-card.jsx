'use client'

import { motion } from 'framer-motion'
import { TldrLoadingSkeleton } from './tldr-loading-skeleton'

export function TldrCard({ data, isLoading }) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-700/40 bg-white/50 dark:bg-zinc-800/50 backdrop-blur p-6 max-w-2xl mx-auto"
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