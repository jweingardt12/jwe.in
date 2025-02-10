'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card } from './Card'
import { useExternalLinkTracking } from '../lib/useExternalLinkTracking'

function cleanContent(content) {
  if (!content) {
    return {
      mainContent: '',
      comment: ''
    }
  }
  
  // Remove the image tag if it exists
  const withoutImage = content.replace(/<img[^>]+>/, '')
  // Split into comment and rest of content if there's a <br/> tag
  const [mainContent, ...commentParts] = withoutImage.split(/<br\/?>/i)
  return {
    mainContent: mainContent.trim(),
    comment: commentParts.join(' ').trim()
  }
}

export function Articles({ articles = [] }) {
  const trackExternalClick = useExternalLinkTracking()

  if (!articles?.length) {
    return (
      <p className="text-zinc-500 dark:text-zinc-400">
        No articles found or an error occurred.
      </p>
    )
  }

  return (
    <div className="divide-y divide-zinc-200 dark:divide-zinc-700/50 pb-16">
      {articles.map((post) => {
        const { mainContent, comment } = cleanContent(post.content_text)
        const imageUrl = post._reeder?.media?.[0]?.url

        // Debug log
        console.log('Article data:', {
          title: post.title,
          url: post.url,
          id: post.id,
          imageUrl,
          media: post._reeder?.media,
          content: post.content_text?.slice(0, 200)
        })

        return (
          <article key={post.id} className="max-w-3xl py-12 first:pt-0 last:pb-0">
            <Card as="div">
              <div className="flex w-full flex-col md:flex-row items-start justify-between gap-6 md:gap-x-4 lg:gap-x-6">
                <div className="flex-1">
                  {/* Header with date */}
                  <div className="flex items-center space-x-2">
                    {post.dateDisplay && (
                      <Card.Eyebrow as="time" dateTime={post.dateISO} className="text-zinc-400 dark:text-zinc-500">
                        Published {post.dateDisplay}
                      </Card.Eyebrow>
                    )}
                  </div>

                  {/* Title as a link */}
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (post.url && post.url !== '#') {
                        trackExternalClick(post.url, {
                          title: post.title
                        })
                      } else {
                        e.preventDefault()
                      }
                    }}
                    className={`block group ${post.url && post.url !== '#' ? 'cursor-pointer' : ''}`}
                  >
                    <h2 className="mt-4 text-xl font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-sky-500">
                      {post.title}
                    </h2>

                    {/* Mobile Image */}
                    <div className="md:hidden">
                      {imageUrl && (
                        <div className="mt-6 w-full">
                          <div className="h-48 w-full overflow-hidden rounded-md bg-zinc-200 dark:bg-zinc-700">
                            <img
                              alt=""
                              src={imageUrl}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                console.error('Image failed to load:', imageUrl)
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Description/content */}
                    {mainContent && (
                      <div className="mt-6 md:mt-4 space-y-2">
                        <div className="text-zinc-600 dark:text-zinc-400">
                          {mainContent}
                        </div>
                      </div>
                    )}

                    {/* External link indicator */}
                    {post.url && post.url !== '#' && (
                      <div className="mt-6 md:mt-4 flex items-center text-sky-500">
                        <span className="text-sm">Read now</span>
                        <svg 
                          viewBox="0 0 24 24" 
                          aria-hidden="true" 
                          className="ml-1 h-4 w-4 fill-current"
                        >
                          <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6Zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8Z" />
                        </svg>
                      </div>
                    )}
                  </a>

                  {/* User comment */}
                  {comment && (
                    <div className="mt-6 md:mt-4 border-l-4 border-sky-500 pl-4 italic text-zinc-600 dark:text-zinc-400">
                      {comment}
                    </div>
                  )}
                </div>

                {/* Desktop Image */}
                <div className="hidden md:block flex-shrink-0">
                  {imageUrl && (
                    <div className="h-24 w-24 sm:h-32 sm:w-32 lg:h-44 lg:w-44 overflow-hidden rounded-md bg-zinc-200 dark:bg-zinc-700">
                      <img
                        alt=""
                        src={imageUrl}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', imageUrl)
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </article>
        )
      })}
    </div>
  )
}
