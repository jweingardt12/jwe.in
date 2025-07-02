import React from 'react'
import { cn } from '../../lib/utils'

export const Shimmer = ({ className }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent",
        className
      )}
    />
  )
}