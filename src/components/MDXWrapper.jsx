'use client'

import { MDXProvider } from '@mdx-js/react'

const components = {
  // Add any custom components you want to use in MDX here
  h1: props => <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl" {...props} />,
  h2: props => <h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl" {...props} />,
  h3: props => <h3 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-3xl" {...props} />,
  p: props => <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400" {...props} />,
  a: props => <a className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300" {...props} />,
  ul: props => <ul className="mt-6 list-disc list-inside text-zinc-600 dark:text-zinc-400" {...props} />,
  ol: props => <ol className="mt-6 list-decimal list-inside text-zinc-600 dark:text-zinc-400" {...props} />,
  li: props => <li className="mt-2" {...props} />,
  blockquote: props => <blockquote className="mt-6 border-l-2 border-zinc-200 pl-6 italic text-zinc-600 dark:border-zinc-700 dark:text-zinc-400" {...props} />,
  img: props => <img className="rounded-lg" alt={props.alt || ''} {...props} />,
  code: props => <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200" {...props} />,
  pre: props => <pre className="mt-6 overflow-x-auto rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800" {...props} />,
}

export function MDXWrapper({ children }) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
