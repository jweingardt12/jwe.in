'use client'

import { cn } from '@/lib/utils'

export const Shimmer = ({ className }) => {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-200/50 dark:via-zinc-700/50 to-transparent" />
    </div>
  )
} 