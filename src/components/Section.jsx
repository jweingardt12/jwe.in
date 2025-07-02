import React from 'react'
import { cn } from '../lib/utils'

export function Section({ title, children, className, ...props }) {
  return (
    <section className={cn("mb-16", className)} {...props}>
      {title && (
        <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-3xl mb-6">
          {title}
        </h2>
      )}
      <div className="space-y-16">
        {children}
      </div>
    </section>
  )
}