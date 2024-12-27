
'use client'

import Image from 'next/image'

export function useMDXComponents(components) {
  return {
    ...components,
    img: (props) => (
      <Image
        {...props}
        alt={props.alt || ''}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
      />
    ),
  }
}
