
'use client'

import Image from 'next/image'

export function useMDXComponents(components) {
  return {
    ...components,
    img: (props) => (
      <div className="relative mt-8 overflow-hidden rounded-xl">
        <Image
          {...props}
          alt={props.alt || ''}
          className="w-full"
          width={800}
          height={400}
        />
      </div>
    ),
  }
}
