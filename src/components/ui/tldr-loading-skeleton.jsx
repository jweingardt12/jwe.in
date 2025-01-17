'use client'

import { Shimmer } from './shimmer'

export function TldrLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <Shimmer className="h-5 w-5 bg-zinc-100 dark:bg-zinc-800 rounded" />
          <Shimmer className="h-5 w-48 bg-zinc-100 dark:bg-zinc-800 rounded" />
        </div>
        <Shimmer className="h-5 w-5 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
      </div>

      <Shimmer className="h-4 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded mt-2" />

      <div className="space-y-2 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Shimmer className="h-3 w-3 bg-zinc-100 dark:bg-zinc-800 rounded" />
            <Shimmer className="h-4 flex-1 bg-zinc-100 dark:bg-zinc-800 rounded" />
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
  )
} 