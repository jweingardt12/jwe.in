'use client'

import { Container } from '../../../components/Container'
import { IconBallBaseball } from '@tabler/icons-react'

export default function Baseball() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="flex items-center gap-4">
        <IconBallBaseball className="h-8 w-8 text-neutral-800 dark:text-neutral-200" />
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          Baseball
        </h1>
      </div>
      <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
        A lifelong passion for America's pastime. From playing to analyzing statistics and following the game's evolution.
      </p>
      {/* Add your baseball content here */}
    </Container>
  )
} 