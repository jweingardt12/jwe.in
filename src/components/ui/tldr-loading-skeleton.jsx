'use client'

import { Shimmer } from './shimmer'
import { GlowEffect } from '@/components/core/glow-effect'

export function TldrLoadingSkeleton() {
  return (
    <div className="relative max-w-4xl mx-auto mt-4">
      <div className="relative rounded-[16px] p-[1px] group isolate transform-gpu will-change-transform overflow-hidden bg-white dark:bg-zinc-900/80 shadow-xl ring-1 ring-zinc-100/10 dark:ring-white/20">
        <GlowEffect
          colors={['#9333EA', '#3B82F6', '#9333EA', '#3B82F6']}
          mode='colorShift'
          blur='soft'
          duration={3}
          scale={1.02}
        />
        
        {/* Content container */}
        <div className="relative rounded-[15px] bg-white dark:bg-black/60 p-6 transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-2 items-center">
                <Shimmer className="h-4 w-4 bg-zinc-100 dark:bg-zinc-800 rounded" />
                <Shimmer className="h-4 w-40 bg-zinc-100 dark:bg-zinc-800 rounded" />
              </div>
              <Shimmer className="h-5 w-5 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
            </div>

            <Shimmer className="h-3 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded mt-2" />

            <div className="space-y-2 mt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <Shimmer className="h-3 w-3 bg-zinc-100 dark:bg-zinc-800 rounded mt-1" />
                  <div className="flex-1">
                    <div className="flex gap-1 items-center">
                      <Shimmer className="h-4 w-6 bg-zinc-100 dark:bg-zinc-800 rounded" />
                      <Shimmer className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 rounded" />
                    </div>
                    <Shimmer className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded mt-1" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              {[...Array(5)].map((_, i) => (
                <Shimmer
                  key={i}
                  className="h-6 w-24 bg-zinc-100 dark:bg-zinc-800 rounded"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 