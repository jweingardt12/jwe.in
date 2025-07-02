'use client'

import React from 'react'

export default function WysiwygEditor({ value, onChange }) {
  return (
    <textarea
      className="w-full min-h-[400px] px-3 py-2 text-sm font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md resize-y"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Write your content here..."
    />
  )
}