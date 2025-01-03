'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useOpenPanel } from '@openpanel/nextjs'
import { Card } from './Card'

export function Articles({ articles = [] }) {
  const op = useOpenPanel()
  
  const safeTrack = (event, data) => {
    try {
      op?.track(event, data)
    } catch (error) {
      console.warn('OpenPanel tracking failed:', error)
    }
  }

  return (
    <div className="divide-y divide-zinc-200 dark:divide-zinc-700/50">
      {articles.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">
          No articles found or an error occurred.
        </p>
      ) : (
        articles.map((post) => (
          <article key={post.id} className="max-w-3xl py-12 first:pt-0 last:pb-0">
            <Link 
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                safeTrack('article_click', {
                  title: post.title,
                  source: post.publicationName,
                  url: post.href,
                  date_published: post.dateISO,
                  has_image: !!post.imageUrl,
                  description_length: post.description?.length
                })
              }}
              className="group relative block"
            >
              <div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl dark:bg-zinc-800/50" />
              <Card as="div">
                <div className="relative z-10 flex w-full flex-row items-start justify-between gap-x-4 sm:gap-x-6">
                  <div className="flex-1">
                    <Card.Eyebrow
                      as="div"
                      className="flex items-center text-zinc-400 dark:text-zinc-500 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {post.dateDisplay && (
                        <time dateTime={post.dateISO} className="flex-shrink-0">Published {post.dateDisplay}</time>
                      )}
                      {post.publicationName && (
                        <>
                          <span
                            className="mx-2 text-zinc-300 dark:text-zinc-600 flex-shrink-0"
                            aria-hidden="true"
                          >
                            ·
                          </span>
                          <div className="flex items-center truncate">
                            <span className="truncate">{post.publicationName}</span>
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-4 w-4 flex-none fill-zinc-500 transition group-hover:fill-sky-500">
                              <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6Zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8Z" />
                            </svg>
                          </div>
                        </>
                      )}
                    </Card.Eyebrow>

                    <div className="mt-2 text-zinc-800 dark:text-zinc-100 group-hover:text-sky-500">
                      {post.title}
                    </div>

                    <Card.Description>
                      {post.description}
                    </Card.Description>
                  </div>

                  {post.imageUrl && (
                    <div className="flex-shrink-0">
                      <div className="relative h-24 w-24 sm:h-32 sm:w-32 lg:h-44 lg:w-44 overflow-hidden rounded-md">
                        <Image
                          alt=""
                          src={post.imageUrl}
                          fill
                          sizes="(min-width: 1024px) 176px, (min-width: 640px) 128px, 96px"
                          className="object-cover bg-zinc-200 dark:bg-zinc-800 transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          </article>
        ))
      )}
    </div>
  )
}
