'use client'

import { useEffect, useState } from 'react'
import { CondensedArticles } from './CondensedArticles'
import { ArticleSkeleton as LoadingSkeleton } from './ArticleSkeleton'
import { usePlausible } from '@/lib/analytics'

export function LimitedFeedContent({ limit = 3, onLoadingChange }) {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { trackEvent } = usePlausible()

  useEffect(() => {
    let timeoutId
    
    // Notify parent component that loading has started
    if (onLoadingChange) {
      onLoadingChange(true)
    }
    
    async function fetchFeed() {
      try {
        const startTime = Date.now()
        const res = await fetch('/api/feed?fresh=true')
        
        // Check if the response is OK
        if (!res.ok) {
          const errorText = await res.text()
          console.error('Feed API error response:', {
            status: res.status,
            statusText: res.statusText,
            body: errorText.substring(0, 500)
          })
          throw new Error(`API error: ${res.status} ${res.statusText}`)
        }
        
        // Try to parse the JSON
        let feed
        try {
          feed = await res.json()
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError)
          // Try to get the raw text to see what was returned
          try {
            const rawText = await res.text()
            console.error('Raw response that failed JSON parsing:', rawText.substring(0, 500))
          } catch (e) {}
          
          throw new Error(`Invalid JSON response: ${jsonError.message}`)
        }
        
        if (feed.error) {
          throw new Error(feed.error)
        }
        
        const items = feed.items || []
        if (!Array.isArray(items)) {
          throw new Error('Invalid feed format')
        }

        console.log('Raw feed items:', items)
        
        const processedArticles = items.map(item => {
          const imgMatch = item.content_text?.match(/<img[^>]+src="([^"]+)"/) 
          const descriptionImage = imgMatch ? imgMatch[1] : null

          const imageUrl = item._reeder?.media?.[0]?.url || descriptionImage || null

          return {
            ...item,
            id: item.id || Math.random().toString(),
            title: item.title || 'Untitled',
            url: item.url || '#',
            content_text: item.content_text || 'No description available',
            dateDisplay: item.dateDisplay || (item.date_published ? new Date(item.date_published).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }) : ''),
            dateISO: item.dateISO || (item.date_published ? new Date(item.date_published).toISOString().split('T')[0] : ''),
            _reeder: {
              ...item._reeder,
              media: imageUrl ? [{ url: imageUrl }] : []
            }
          }
        })

        // Sort articles by date (newest first) and limit to the specified number
        const sortedArticles = processedArticles
          .sort((a, b) => {
            const dateA = a.date_published ? new Date(a.date_published) : new Date(0)
            const dateB = b.date_published ? new Date(b.date_published) : new Date(0)
            return dateB - dateA
          })
          .slice(0, limit)
        
        trackEvent('Reading List Loaded', {
          articleCount: sortedArticles.length,
          freshData: true,
          limited: true
        })

        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(2000 - elapsedTime, 0)

        timeoutId = setTimeout(() => {
          setArticles(sortedArticles)
          setError(null)
          setIsLoading(false)
          
          // Notify parent component that loading has finished
          if (onLoadingChange) {
            onLoadingChange(false)
          }
        }, remainingTime)

      } catch (error) {
        console.error('Error fetching feed:', error)
        
        // Track the error
        trackEvent('Reading List Error', {
          errorMessage: error.message
        })
        
        timeoutId = setTimeout(() => {
          setError(error.message)
          setArticles([{
            id: 'error',
            title: 'Unable to load articles',
            content_text: `Error: ${error.message}. Please try again later.`,
            url: '#',
            dateDisplay: new Date().toLocaleDateString(),
            dateISO: new Date().toISOString().split('T')[0],
            _reeder: { media: [] }
          }])
          setIsLoading(false)
          
          // Notify parent component that loading has finished (even with error)
          if (onLoadingChange) {
            onLoadingChange(false)
          }
        }, 2000)
      }
    }

    fetchFeed()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [trackEvent, limit, onLoadingChange])

  if (isLoading) {
    return <LoadingSkeleton count={limit} />
  }
  
  if (error) {
    return (
      <div className="py-8 text-center">
        <h3 className="text-xl font-medium text-red-500 mb-2">Error Loading Articles</h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">{error}</p>
        <button 
          onClick={() => {
            setIsLoading(true)
            setError(null)
            // Use setTimeout to ensure state updates before re-fetching
            setTimeout(() => window.location.reload(), 100)
          }}
          className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <>
      <CondensedArticles articles={articles} />
      <div className="mt-8 text-center">
        <a 
          href="/reading" 
          className="inline-flex items-center text-sm font-medium text-sky-500 hover:text-sky-600 dark:hover:text-sky-400"
        >
          View all articles
          <svg 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            className="ml-1 h-4 w-4"
          >
            <path 
              fillRule="evenodd" 
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" 
              clipRule="evenodd" 
            />
          </svg>
        </a>
      </div>
    </>
  )
}
