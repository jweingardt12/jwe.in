'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/Card'

export function Articles({ articles = [] }) {
  return (
    <div className="divide-y divide-zinc-200 dark:divide-zinc-700/50">
      {articles.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">
          No articles found or an error occurred.
        </p>
      ) : (
        articles.map((post) => (
          <article key={post.id} className="max-w-3xl py-12 first:pt-0 last:pb-0">
            <Card as="div">
              <div className="flex w-full flex-row items-start justify-between gap-x-6">
                <div className="flex-1">
                  <Card.Eyebrow
                    as="p"
                    className="text-zinc-400 dark:text-zinc-500"
                  >
                    {post.dateDisplay && (
                      <time dateTime={post.dateISO}>Published {post.dateDisplay}</time>
                    )}
                    {post.publicationName && (
                      <>
                        <span
                          className="mx-2 text-zinc-300 dark:text-zinc-600"
                          aria-hidden="true"
                        >
                          ·
                        </span>
                        <Link 
                          href={post.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center hover:text-sky-500"
                        >
                          {post.publicationName}
                          <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-4 w-4 flex-none fill-zinc-500 transition group-hover:fill-sky-500">
                            <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6Zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8Z" />
                          </svg>
                        </Link>
                      </>
                    )}
                  </Card.Eyebrow>

                  <Card.Title 
                    href={post.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-zinc-800 dark:text-zinc-100 hover:text-sky-500 dark:hover:text-sky-500"
                    onClick={(e) => {
                      window.umami?.track('article_click', {
                        title: post.title,
                        source: post.publicationName
                      })
                    }}
                  >
                    {post.title}
                  </Card.Title>

                  <Card.Description>
                    {post.description}
                  </Card.Description>
                </div>

                <div className="flex-shrink-0">
                  <Link 
                    href={post.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="relative h-32 w-32 sm:h-40 sm:w-40 lg:h-44 lg:w-44 overflow-hidden rounded-md">
                      <Image
                        alt=""
                        src={post.imageUrl}
                        fill
                        sizes="(min-width: 1024px) 176px, (min-width: 640px) 160px, 128px"
                        className="object-cover bg-zinc-200 dark:bg-zinc-800 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </Card>
          </article>
        ))
      )}
    </div>
  )
} 