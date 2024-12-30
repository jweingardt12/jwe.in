/* File: /src/app/reading/page.jsx (Server Component) */

import { Suspense } from 'react'
import { Container } from '@/components/Container'
import { ShareFeed } from '@/components/ShareFeed'
import { LoadingSkeleton } from '@/components/ArticleSkeleton'
import { FeedContent } from '@/components/FeedContent'

export const metadata = {
  title: 'Reading',
  description: 'What I\'ve been reading, straight from my RSS feed.',
}

export default function ReadingPage() {
  const feedUrl = 'https://reederapp.net/9QMh31cCQtuxnR8Np2_N5g.json'
  
  return (
    <Container className="mt-16 sm:mt-32">
      <h2 className="text-4xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
        What I'm Reading
      </h2>
      <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
        What I've been reading, straight from my RSS feed. Want to follow along? Copy the URL below into the RSS reader of your choice.
      </p>
      
      <ShareFeed url={feedUrl} />

      <div className="mt-10 border-t border-zinc-100 pt-10 dark:border-zinc-700 sm:mt-16 sm:pt-16">
        <Suspense fallback={<LoadingSkeleton />}>
          <FeedContent feedUrl={feedUrl} />
        </Suspense>
      </div>
    </Container>
  )
}
