'use client'

import { Card } from './Card'

export function ArticleSkeleton() {
  return (
    <article className="max-w-3xl py-12 first:pt-0 last:pb-0 animate-pulse">
      <Card as="div">
        <div className="flex w-full flex-row items-start justify-between gap-x-4 sm:gap-x-6">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
              <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            </div>
            <div className="mt-4 h-6 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded"></div>
              <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="h-24 w-24 sm:h-32 sm:w-32 lg:h-44 lg:w-44 bg-zinc-200 dark:bg-zinc-700 rounded-md"></div>
          </div>
        </div>
      </Card>
    </article>
  )
}

export function LoadingSkeleton() {
  return (
    <div className="divide-y divide-zinc-200 dark:divide-zinc-700/50">
      {[...Array(3)].map((_, i) => (
        <ArticleSkeleton key={i} />
      ))}
    </div>
  )
}
