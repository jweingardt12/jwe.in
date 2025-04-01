'use client'

import { useState, useEffect } from 'react'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import rehypePrismPlus from 'rehype-prism-plus'
import Image from 'next/image'

const components = {
  h2: (props) => (
    <h2 className="mt-12 text-2xl font-bold text-zinc-800 dark:text-zinc-100" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-8 text-xl font-bold text-zinc-800 dark:text-zinc-100" {...props} />
  ),
  p: (props) => (
    <p className="mt-6 text-base leading-7 text-zinc-600 dark:text-zinc-400" {...props} />
  ),
  a: (props) => (
    <a className="font-medium text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300" {...props} />
  ),
  ul: (props) => (
    <ul className="mt-8 list-disc pl-8 space-y-3 text-zinc-600 dark:text-zinc-400" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-8 list-decimal pl-8 space-y-3 text-zinc-600 dark:text-zinc-400" {...props} />
  ),
  li: (props) => (
    <li className="leading-7" {...props} />
  ),
  blockquote: (props) => (
    <blockquote className="mt-6 border-l-2 border-zinc-200 pl-6 italic text-zinc-600 dark:border-zinc-700 dark:text-zinc-400" {...props} />
  ),
  img: ({ src, alt }) => (
    <Image
      src={src}
      alt={alt || ''}
      width={1200}
      height={600}
      className="w-full rounded-lg my-8"
      priority
    />
  ),
  pre: (props) => (
    <pre className="mt-6 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-zinc-200" {...props} />
  ),
  code: (props) => (
    <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200" {...props} />
  ),
}

export default function MDXContent({ content }) {
  const [mdxSource, setMdxSource] = useState(null)
  
  useEffect(() => {
    const processMdx = async () => {
      if (!content) return
      
      try {
        const result = await serialize(content, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [[rehypePrismPlus, { ignoreMissing: true, showLineNumbers: true }]],
          },
        })
        setMdxSource(result)
      } catch (error) {
        console.error('Error processing MDX:', error)
      }
    }
    
    processMdx()
  }, [content])
  
  if (!mdxSource) {
    return <div>Loading content...</div>
  }
  
  return (
    <div className="prose dark:prose-invert max-w-none">
      <MDXRemote {...mdxSource} components={components} />
    </div>
  )
}
