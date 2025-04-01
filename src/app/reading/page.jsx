'use client'

import { Container } from '@/components/Container'
import { FeedContent } from '@/components/FeedContent'
import { ShareFeed } from '@/components/ShareFeed'
import { DrawerComponent } from '@/components/Drawer'

const FEED_URL = 'https://bg.raindrop.io/rss/public/51518726'

export default function ReadingPage() {
  return (
    <Container className="mt-8 sm:mt-16">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          Reading
        </h2>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
          What I've been reading, straight from my RSS feed.
          <br /><br />
          Want to follow along? Copy the URL below into the RSS reader of your choice.
        </p>
        
        <div className="mt-6 w-full max-w-md">
          <ShareFeed url={FEED_URL} />
        </div>

        <div className="mt-6 text-base w-full max-w-md">
          <DrawerComponent />
        </div>
      </div>

      <div className="mt-10 border-t border-zinc-100 pt-10 dark:border-zinc-700 sm:mt-16 sm:pt-16 flex justify-center">
        <div className="w-full max-w-3xl text-left">
          <FeedContent />
        </div>
      </div>
    </Container>
  )
}
