'use client'

import { MDXProvider } from '@mdx-js/react'
import Image from 'next/image'

const components = {
  img: (props) => (
    <div className="relative aspect-[16/9] my-8 overflow-hidden rounded-lg">
      <Image
        {...props}
        fill
        className="object-cover"
        loading="lazy"
        sizes="(min-width: 768px) 42rem, 100vw"
      />
    </div>
  ),
}

export function MDXContent({ children }) {
  return (
    <MDXProvider components={components}>
      <div className="prose dark:prose-invert max-w-none">
        {children}
      </div>
    </MDXProvider>
  )
}
