'use client'

import { useEffect, useState } from 'react'
import { Articles } from '@/components/Articles'
import { LoadingSkeleton } from '@/components/ArticleSkeleton'

const FEED_URL = 'https://reederapp.net/9QMh31cCQtuxnR8Np2_N5g.json'

function getDescription(item) {
  // Try content_text first as it's usually the cleanest
  if (item.content_text) {
    return item.content_text.slice(0, 200) + '...'
  }
  
  // Then try content_html but strip HTML tags
  if (item.content_html) {
    const div = document.createElement('div')
    div.innerHTML = item.content_html
    const text = div.textContent || div.innerText || ''
    return text.slice(0, 200) + '...'
  }
  
  // Fall back to description or summary
  if (item.description) {
    return item.description.slice(0, 200) + '...'
  }
  
  if (item.summary) {
    return item.summary.slice(0, 200) + '...'
  }
  
  return 'No description available'
}

function getImage(item) {
  // Check all possible image locations in order of preference
  if (item.image) return item.image
  if (item.banner_image) return item.banner_image
  if (item.thumbnail) return item.thumbnail
  
  // Check for images in the content
  if (item.content_html) {
    const div = document.createElement('div')
    div.innerHTML = item.content_html
    const firstImage = div.querySelector('img')
    if (firstImage && firstImage.src) {
      return firstImage.src
    }
  }
  
  // Check for external images
  if (item._external_images && item._external_images.length > 0) {
    return item._external_images[0]
  }
  
  // Check for attachments
  if (item.attachments && item.attachments.length > 0) {
    const image = item.attachments.find(a => a.mime_type?.startsWith('image/'))
    if (image?.url) return image.url
  }
  
  // Check for media content
  if (item.media_content && item.media_content.length > 0) {
    const image = item.media_content.find(m => m.type?.startsWith('image/'))
    if (image?.url) return image.url
  }

  return 'https://via.placeholder.com/256?text=No+Image'
}

export function FeedContent() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchFeed() {
      try {
        const res = await fetch('/api/feed')
        if (!res.ok) throw new Error('Failed to fetch feed')
        const feed = await res.json()
        
        const processedArticles = (feed.items || []).map(item => {
          const dateLiked = item.date_published || item.pubDate || null
          
          let displayDate = ''
          let isoDate = ''
          if (dateLiked) {
            const d = new Date(dateLiked)
            displayDate = d.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
            isoDate = d.toISOString().split('T')[0]
          }

          // Get the publication name from the URL if not provided
          let publicationName = item.site_name
          if (!publicationName && item.url) {
            try {
              const url = new URL(item.url)
              publicationName = url.hostname.replace('www.', '').split('.')[0]
              // Capitalize first letter
              publicationName = publicationName.charAt(0).toUpperCase() + publicationName.slice(1)
            } catch (e) {
              publicationName = ''
            }
          }

          return {
            id: item.url || Math.random(),
            title: item.title || 'Untitled',
            href: item.url || '#',
            description: getDescription(item),
            publicationName,
            dateDisplay: displayDate,
            dateISO: isoDate,
            imageUrl: getImage(item),
          }
        })

        setArticles(processedArticles)
      } catch (error) {
        console.error('Error fetching feed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeed()
  }, [])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return <Articles articles={articles} />
} 