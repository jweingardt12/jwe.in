'use client'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"
import { Button } from "./ui/button"
import { trackLinkClick, EventNames } from '@/lib/analytics/tracking'

export function DrawerComponent() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button 
          className="text-zinc-600 dark:text-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs"
        >
          How does this page work?
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl px-6">
          <div className="flex flex-col gap-6 py-6">
            <DrawerTitle>How does this page work?</DrawerTitle>
            <div className="prose dark:prose-invert">
              <p>
                This page displays articles I've come across from my RSS feeds. Here's how it works:
              </p>
              <ul>
                <li>I use <a 
                    href="https://raindrop.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => {
                      window.umami?.track('external_link_click', { 
                        domain: 'raindrop.io',
                        url: 'https://raindrop.io',
                        type: 'tool'
                      })
                      // Track with centralized utility
                      trackLinkClick(EventNames.TOOL_LINK_CLICK, {
                        title: 'Raindrop.io',
                        url: 'https://raindrop.io',
                        type: 'tool',
                        location: 'reading_drawer'
                      })
                    }}
                  >Raindrop.io</a> to save and organize articles I read across the web</li>
                <li>The app generates a public RSS feed URL that contains articles I've added to a specific collection.</li>
                <li>This page fetches and displays that feed in semi-realtime via this <a 
                    href="https://github.com/jweingardt12/jwe.in/blob/main/src/components/FeedContent.jsx"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      window.umami?.track('external_link_click', {
                        domain: 'github.com',
                        url: 'https://github.com/jweingardt12/jwe.in/blob/main/src/components/FeedContent.jsx',
                        type: 'source'
                      })
                      // Track with centralized utility
                      trackLinkClick(EventNames.SOURCE_CODE_LINK_CLICK, {
                        title: 'FeedContent.jsx',
                        url: 'https://github.com/jweingardt12/jwe.in/blob/main/src/components/FeedContent.jsx',
                        type: 'source',
                        location: 'reading_drawer',
                        repository: 'jwe.in',
                        file: 'FeedContent.jsx'
                      })
                    }}
                  > component</a>.</li>
                <li>The client handles fetching new items on page-load, with some protections against Raindrop's rate limiting.</li>
              </ul>
            </div>
            <DrawerClose asChild>
              <Button className="w-full" variant="secondary">Close</Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
