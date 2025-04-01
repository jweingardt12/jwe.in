'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to fetch and count articles added in the last week
 * @returns {Object} Object containing count of recent articles and loading state
 */
export function useRecentArticles() {
  const [recentCount, setRecentCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    
    async function fetchAndCountRecentArticles() {
      try {
        // Add fresh=true parameter to get fresh data on each page load
        const res = await fetch('/api/feed?fresh=true')
        
        if (!res.ok) {
          throw new Error(`Failed to fetch articles: ${res.status} ${res.statusText}`)
        }
        
        const data = await res.json()
        
        if (!isMounted) return
        
        if (data.error || !Array.isArray(data.items)) {
          console.error('Error fetching articles:', data.error || 'Invalid data format')
          setRecentCount(0)
          setError(data.error || 'Invalid data format')
          return
        }
        
        // Calculate the date one week ago
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        
        // Count articles published in the last week
        const count = data.items.filter(item => {
          if (!item.date_published) return false
          const pubDate = new Date(item.date_published)
          return pubDate >= oneWeekAgo
        }).length
        
        if (isMounted) {
          setRecentCount(count)
          setError(null)
        }
      } catch (error) {
        console.error('Error in useRecentArticles:', error)
        if (isMounted) {
          setRecentCount(0)
          setError(error.message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchAndCountRecentArticles()
    
    return () => {
      isMounted = false
    }
  }, [])

  return { recentCount, isLoading, error }
}
