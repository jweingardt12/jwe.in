'use client'

import { useState, useRef } from 'react'
import { useOpenPanel } from '@openpanel/nextjs'

export function ShareFeed({ url }) {
  const [copied, setCopied] = useState(false)
  const urlRef = useRef(null)
  const op = useOpenPanel()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      op.track('rss_feed_copied', {
        feed_url: url
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleUrlClick = () => {
    if (urlRef.current) {
      const range = document.createRange()
      range.selectNodeContents(urlRef.current)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }

  return (
    <div className="mt-6 flex gap-4 sm:w-fit">
      <div className="relative overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
        <div 
          ref={urlRef}
          onClick={handleUrlClick}
          className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 truncate font-mono cursor-pointer"
        >
          {url}
        </div>
      </div>
      <button
        type="button"
        className="flex-none inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600"
        onClick={handleCopy}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
} 