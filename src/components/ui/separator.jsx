"use client"

import React from "react"

const Separator = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`h-[1px] w-full shrink-0 bg-zinc-200 dark:bg-zinc-800 ${className}`}
    {...props}
  />
))
Separator.displayName = "Separator"

export { Separator } 