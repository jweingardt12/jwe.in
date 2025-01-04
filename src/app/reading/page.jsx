'use client'

import { Container } from '../../components/Container'
import { FeedContent } from '../../components/FeedContent'
import { ShareFeed } from '../../components/ShareFeed'
import { DrawerComponent } from '../../components/Drawer'

const FEED_URL = 'https://reederapp.net/9QMh31cCQtuxnR8Np2_N5g.json'

export default function ReadingPage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <h2 className="text-4xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
        Reading
      </h2>
      <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
        What I've been reading, straight from my RSS feed. <br />
        <br />
        Want to follow along? Copy the URL below into the RSS reader of your choice.
      </p>
      
      <ShareFeed url={FEED_URL} />

      <div className="mt-6 text-base">
        <DrawerComponent />
      </div>

      <div className="mt-10 border-t border-zinc-100 pt-10 dark:border-zinc-700 sm:mt-16 sm:pt-16">
        <FeedContent />
      </div>
    </Container>
  )
}
