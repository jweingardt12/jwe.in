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
          console.log('Processing item:', item)

          // Get publication name from _reeder.feed.title if available
          const publicationName = item._reeder?.feed?.title || 'Unknown Source'
          console.log('Publication name:', publicationName)
          
          // Get image from multiple possible sources
          const imageUrl = item.image || // Direct image URL
                         item.attachments?.[0]?.url || // First attachment URL
                         item._reeder?.media?.[0]?.url || // Media from _reeder
                         null // Fallback to null if no image found
          console.log('Image URL:', imageUrl)

          const processed = {
            id: item.id || Math.random().toString(),
            title: item.title || 'Untitled',
            href: item.url || '#',
            description: item.content_text?.slice(0, 200) + '...' || 'No description available',
            publicationName,
            dateDisplay: item.date_published ? new Date(item.date_published).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }) : '',
            dateISO: item.date_published ? new Date(item.date_published).toISOString().split('T')[0] : '',
            imageUrl
          }
          console.log('Processed article:', processed)
          return processed
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
            description: `Error: ${error.message}. Please try again later.`,
            href: '#',
            publicationName: 'Error',
            dateDisplay: new Date().toLocaleDateString(),
            dateISO: new Date().toISOString().split('T')[0]
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
