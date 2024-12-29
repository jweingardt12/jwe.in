
'use client'

import { Container } from '@/components/Container'
import { useContext, createContext } from 'react'
import { Prose } from '@/components/Prose'

export function ArticleLayout({ article, children }) {
  return (
    <Container className="mt-16 lg:mt-32">
      <div className="xl:relative">
        <div className="mx-auto max-w-2xl">
          <article>
            <header className="flex flex-col">
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                {article.title}
              </h1>
              {article.date && (
                <time dateTime={new Date(article.date).toISOString()} className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
            </header>
            <Prose className="mt-8" data-mdx-content>
              {children}
            </Prose>
          </article>
        </div>
      </div>
    </Container>
  )
}
