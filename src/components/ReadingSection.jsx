'use client'

import { useState } from 'react'
import { LimitedFeedContent } from './LimitedFeedContent'
import { ShareFeed } from './ShareFeed'
import { DrawerComponent } from './Drawer'
import { BlurFade } from './ui/blur-fade'

export function ReadingSection() {
  const [isLoading, setIsLoading] = useState(true)
  
  // Only show the section when content is loaded
  const handleLoadingChange = (loading) => {
    setIsLoading(loading)
  }
  
  return (
    <BlurFade inView delay={0.2} yOffset={10} inViewMargin="-100px" className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
      <div className="bg-zinc-100/50 dark:bg-zinc-800/50 rounded-lg p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-2xl">
            What I'm Reading
          </h2>
        </div>

        <div className="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-700/50 sm:mt-8 sm:pt-8">
          <div className="w-full max-w-2xl mx-auto">
            <LimitedFeedContent limit={3} onLoadingChange={handleLoadingChange} />
          </div>
        </div>
      </div>
    </BlurFade>
  )
}
