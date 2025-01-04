'use client'

export function useExternalLinkTracking() {
  const handleExternalClick = (url, options = {}) => {
    try {
      // Extract domain from URL
      const domain = new URL(url).hostname.replace('www.', '')
      
      // Track the click with Umami
      window.umami?.track('external_link_click', {
        domain,
        url,
        ...options
      })
    } catch (error) {
      console.error('Error tracking external link:', error)
    }
  }

  return handleExternalClick
}
