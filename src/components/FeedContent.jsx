'use client'

import { useEffect, useState } from 'react'
import { Articles } from './Articles'
import { ArticleSkeleton as LoadingSkeleton } from './ArticleSkeleton'
import { usePlausible } from '@/lib/analytics'

export function FeedContent() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { trackEvent } = usePlausible()

  useEffect(() => {
    let timeoutId
    
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

          console.log('Processing item:', {
            title: item.title,
            url: item.url,
            imageUrl,
            mediaUrls: item._reeder?.media?.map(m => m.url),
            descriptionImage,
            content: item.content_text?.slice(0, 100)
          })

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

        console.log('All processed articles:', processedArticles)
        
        trackEvent('Reading List Loaded', {
          articleCount: processedArticles.length,
          freshData: true
        })

        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(2000 - elapsedTime, 0)

        timeoutId = setTimeout(() => {
          setArticles(processedArticles)
          setError(null)
          setIsLoading(false)
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
        }, 2000)
      }
    }

    fetchFeed()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [trackEvent])

  if (isLoading) {
    return <LoadingSkeleton />
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

  return <Articles articles={articles} />
}
