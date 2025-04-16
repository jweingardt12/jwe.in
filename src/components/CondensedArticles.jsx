'use client'

import Link from 'next/link'
import { useExternalLinkTracking } from '../lib/useExternalLinkTracking'

function cleanContent(content) {
  if (!content) {
    return {
      mainContent: '',
      comment: ''
    }
  }
  
  // Remove the image tag if it exists
  const withoutImage = content.replace(/\<img[^\>]+\>/, '')
  // Split into comment and rest of content if there's a <br/> tag
  const [mainContent, ...commentParts] = withoutImage.split(/\<br\/?\>/i)
  return {
    mainContent: mainContent.trim(),
    comment: commentParts.join(' ').trim()
  }
}

export function CondensedArticles({ articles = [] }) {
  const trackExternalClick = useExternalLinkTracking()

  if (!articles?.length) {
    return (
      <p className="text-zinc-500 dark:text-zinc-400">
        No articles found or an error occurred.
      </p>
    )
  }

  return (
    <ul className="space-y-4">
      {articles.map((post) => {
        // Format date if available
        const formattedDate = post.dateDisplay ? 
          post.dateDisplay.split(' ').slice(0, 2).join(' ') : ''

        return (
          <li key={post.id} className="group mb-6 last:mb-0">
            <div className="flex flex-col">
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
                className="block group"
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-zinc-800 dark:text-zinc-100 group-hover:text-sky-500">
                      {post.title}
                    </h3>
                    
                    <div className="mt-1 flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                      {formattedDate && (
                        <span className="mr-2">{formattedDate}</span>
                      )}
                      <span className="text-sky-500 group-hover:underline">Read →</span>
                    </div>
                  </div>
                </div>
              </a>
              
              {/* User comment */}
              {(() => {
                const { comment } = cleanContent(post.content_text)
                return comment ? (
                  <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 italic border-l-2 border-sky-500/50 pl-3">
                    {comment}
                  </div>
                ) : null
              })()}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
