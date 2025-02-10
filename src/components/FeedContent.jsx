'use client'

import { useEffect, useState } from 'react'
import { Articles } from './Articles'
import { ArticleSkeleton as LoadingSkeleton } from './ArticleSkeleton'

export function FeedContent() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let timeoutId
    
    async function fetchFeed() {
      try {
        const startTime = Date.now()
        const res = await fetch('/api/feed')
        const feed = await res.json()
        
        if (feed.error) {
          throw new Error(feed.error)
        }
        
        const items = feed.items || []
        if (!Array.isArray(items)) {
          throw new Error('Invalid feed format')
        }

        console.log('Raw feed items:', items)
        
        const processedArticles = items.map(item => {
          // Extract image URL from description if present
          const imgMatch = item.content_text?.match(/<img[^>]+src="([^">]+)"/)
          const descriptionImage = imgMatch ? imgMatch[1] : null

          // Get the best available image URL
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

        // Calculate remaining time to show skeleton
        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(2000 - elapsedTime, 0)

        // Set a timeout to ensure skeleton shows for at least 2 seconds
        timeoutId = setTimeout(() => {
          setArticles(processedArticles)
          setIsLoading(false)
        }, remainingTime)

      } catch (error) {
        console.error('Error fetching feed:', error)
        // Even on error, wait 2 seconds before showing error state
        timeoutId = setTimeout(() => {
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

    // Cleanup timeout on unmount
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return <Articles articles={articles} />
}
