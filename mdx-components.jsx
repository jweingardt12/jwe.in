
'use client'

import Image from 'next/image'

const components = {
  h1: ({ children }) => (
    <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-8 text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mt-6 list-disc pl-4 text-zinc-600 dark:text-zinc-400">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-6 list-decimal pl-4 text-zinc-600 dark:text-zinc-400">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="mt-2">{children}</li>
  ),
  img: ({ src, alt }) => (
    <div className="relative my-8 overflow-hidden rounded-lg">
      <Image
        src={src}
        alt={alt || ''}
        width={800}
        height={400}
        className="w-full"
        priority
      />
    </div>
  ),
  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-200">
      {children}
    </pre>
  ),
  code: ({ children, className }) => {
    const isInline = !className
    return isInline ? (
      <code className="rounded bg-zinc-200 px-1 py-0.5 text-sm font-mono text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
        {children}
      </code>
    ) : (
      <code className="block text-sm font-mono text-zinc-200">{children}</code>
    )
  },
  figure: ({ children }) => (
    <figure className="mt-8 mb-6">
      {children}
    </figure>
  ),
  figcaption: ({ children }) => (
    <figcaption className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
      {children}
    </figcaption>
  ),
}

export function useMDXComponents() {
  return components
}
