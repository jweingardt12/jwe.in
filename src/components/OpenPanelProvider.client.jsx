'use client'

import { OpenPanelComponent, useOpenPanel } from '@openpanel/nextjs'
import { useEffect } from 'react'

export function OpenPanelProvider() {
  const clientId = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID
  const isDev = process.env.NODE_ENV === 'development'
  const { track } = useOpenPanel()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Log initialization
      console.log('OpenPanel Debug:', {
        clientId,
        isDev,
        location: window.location.pathname,
        timestamp: new Date().toISOString()
      })

      // Track test event
      try {
        track('test_event', {
          path: window.location.pathname,
          timestamp: new Date().toISOString()
        })
        console.log('OpenPanel test event tracked')
      } catch (err) {
        console.error('OpenPanel tracking error:', err)
      }
    }
  }, [track])

  if (!clientId) {
    console.warn('OpenPanel client ID is not configured')
    return null
  }

  return (
    <OpenPanelComponent
      clientId={clientId}
      trackScreenViews
      trackOutgoingLinks
      trackAttributes
      debug={isDev}
      cdnUrl="https://openpanel.dev"
      onError={(err) => console.error('OpenPanel error:', err)}
      onInit={() => console.log('OpenPanel initialized')}
    />
  )
}
