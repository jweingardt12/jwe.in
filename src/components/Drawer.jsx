'use client'

import {
  Drawer as DrawerPrimitive,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"
import { Button } from "./ui/button"

export function Drawer() {
  return (
    <DrawerPrimitive>
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
            <DrawerTitle>How the Reading Page Works</DrawerTitle>
            <div className="prose dark:prose-invert">
              <p>
                This page displays articles I'e come across from my RSS feeds. Here's how it works:
              </p>
              <ul>
                <li>I use <a href="https://reeder.app">Reeder app</a> to save and organize articles I read across the web</li>
                <li>The app generates a public RSS feed URL that contains articles I've added to a specific collection.</li>
                <li>This page fetches and displays that feed in semi-realtime via this <a href="https://github.com/jweingardt12/jwe.in/blob/main/src/components/FeedContent.jsx"> component</a>.</li>
                <li>The client (browser) handles fetching new items on page-load.</li>
              </ul>
            </div>
            <DrawerClose asChild>
              <Button className="w-full" variant="secondary">Close</Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </DrawerPrimitive>
  )
}
