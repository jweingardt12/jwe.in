'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Hook to fetch and count articles added in the last week
 * @returns {Object} Object containing count of recent articles and loading state
 */
export function useRecentArticles() {
  const [recentCount, setRecentCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [badgeDismissed, setBadgeDismissed] = useState(false)
  const pathname = usePathname()

  // Check if we're on the Reading page and dismiss the badge for the session
  useEffect(() => {
    // Check if localStorage is available (client-side only)
    if (typeof window !== 'undefined') {
      // Check if badge was already dismissed in this session
      const dismissed = localStorage.getItem('readingBadgeDismissed')
      if (dismissed) {
        setBadgeDismissed(true)
      }
      
      // If we're on the Reading page, dismiss the badge for this session
      if (pathname === '/reading') {
        localStorage.setItem('readingBadgeDismissed', 'true')
        setBadgeDismissed(true)
      }
    }
  }, [pathname])

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

  // Return 0 for the badge count when on the Reading page or if badge was dismissed
  return { 
    recentCount: badgeDismissed ? 0 : recentCount, 
    isLoading, 
    error 
  }
}
