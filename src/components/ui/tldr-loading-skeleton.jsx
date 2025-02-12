'use client'

import { Shimmer } from './shimmer'

export function TldrLoadingSkeleton() {
  return (
    <div className="relative max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="relative p-[1px] rounded-[16px] overflow-hidden bg-gradient-to-r from-purple-500/20 to-blue-500/20 dark:from-purple-500/10 dark:to-blue-500/10">
        {/* Animated gradient border */}
        <div 
          className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite]"
          style={{
            background: "conic-gradient(from 0deg, #9333EA, #3B82F6, #9333EA)",
            opacity: "0.9",
          }}
        />
        
        {/* Content container */}
        <div className="relative rounded-[16px] bg-white/95 dark:bg-zinc-900/60 backdrop-blur-sm p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-2 items-center">
                <Shimmer className="h-4 w-4 bg-zinc-100 dark:bg-zinc-700 rounded" />
                <Shimmer className="h-4 w-40 bg-zinc-100 dark:bg-zinc-700 rounded" />
              </div>
              <Shimmer className="h-5 w-5 bg-zinc-100 dark:bg-zinc-700 rounded-full" />
            </div>

            <Shimmer className="h-3 w-3/4 bg-zinc-100 dark:bg-zinc-700 rounded mt-2" />

            <div className="space-y-2 mt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <Shimmer className="h-3 w-3 bg-zinc-100 dark:bg-zinc-700 rounded mt-1" />
                  <div className="flex-1">
                    <div className="flex gap-1 items-center">
                      <Shimmer className="h-4 w-6 bg-zinc-100 dark:bg-zinc-700 rounded" />
                      <Shimmer className="h-4 w-24 bg-zinc-100 dark:bg-zinc-700 rounded" />
                    </div>
                    <Shimmer className="h-4 w-full bg-zinc-100 dark:bg-zinc-700 rounded mt-1" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-zinc-100/30 dark:border-zinc-700/30">
              {[...Array(5)].map((_, i) => (
                <Shimmer
                  key={i}
                  className="h-6 w-24 bg-zinc-100 dark:bg-zinc-700 rounded"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 