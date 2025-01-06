'use client'

import { Container } from '@/components/Container'

export default function MeetPage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          Schedule a Meeting
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          Looking to chat? Find a time that works for both us below. The module here syncs to all of my calendars, so my availability is always up to date.
        </p>
      </header>

      <div className="mt-10">
        <object 
          data="https://app.reclaim.ai/e/e9e1ba3e-9767-4c9c-8749-2b1b83efd563" 
          width="100%" 
          height="700px" 
          style={{ outline: 'none' }}
        />
      </div>
    </Container>
  )
} 