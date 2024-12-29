
'use client'

import Image from 'next/image'

export function useMDXComponents(components = {}) {
  return {
    ...components,
    img: ({ src, alt }) => (
      <div className="relative my-8 overflow-hidden rounded-xl">
        <Image
          src={src}
          alt={alt || ''}
          width={800}
          height={400}
          className="w-full"
          priority
          unoptimized
        />
      </div>
    ),
  }
}
