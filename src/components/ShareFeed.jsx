'use client'

import { useState } from 'react'
import { ClipboardIcon } from '@heroicons/react/24/outline'
import { useToast } from "@/components/ui/use-toast"

export function ShareFeed({ url }) {
  const { toast } = useToast()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Copied!",
        description: "RSS feed URL copied to clipboard",
        duration: 2000,
        className: "dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
      })
      console.log('Toast triggered')
    } catch (err) {
      console.error('Failed to copy:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy URL to clipboard",
        duration: 2000,
      })
    }
  }

  return (
    <div className="mt-6 flex items-center gap-4 text-sm">
      <div className="min-w-0 sm:min-w-fit">
        <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800/50 px-4 py-2 font-mono text-zinc-600 dark:text-zinc-400 overflow-x-auto">
          {url}
        </div>
      </div>
      <div className="flex-none">
        <button
          type="button"
          onClick={copyToClipboard}
          className="flex items-center gap-1 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <ClipboardIcon className="h-4 w-4" />
          <span>Copy</span>
        </button>
      </div>
    </div>
  )
} 