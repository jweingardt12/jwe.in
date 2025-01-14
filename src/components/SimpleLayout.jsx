'use client'

import { useState, useEffect } from 'react'
import { Container } from './Container'

export function SimpleLayout({ title, customTitle, intro, children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Container className="mt-8 sm:mt-16">
      <header className="max-w-2xl">
        {customTitle || (
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            {title}
          </h1>
        )}
        <div className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          {intro}
        </div>
      </header>
      {children && <div className="mt-8 sm:mt-12">{children}</div>}
    </Container>
  )
}
