'use client'

import React from 'react'

export default function HybridContentRenderer({ content }) {
  // Simple rendering - just display the content as HTML
  return (
    <div 
      className="prose prose-zinc dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}