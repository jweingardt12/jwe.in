'use client'

import { Container } from '../../../components/Container'
import { IconCode } from '@tabler/icons-react'

export default function Technology() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="flex items-center gap-4">
        <IconCode className="h-8 w-8 text-neutral-800 dark:text-neutral-200" />
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          Technology
        </h1>
      </div>
      <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
        Exploring emerging technologies and their practical applications. From software development to AI and beyond.
      </p>
      {/* Add your technology content here */}
    </Container>
  )
} 