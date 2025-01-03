'use client'

import { useEffect } from 'react'
import { OpenPanelComponent } from '@openpanel/nextjs'

export function OpenPanelProvider() {
  useEffect(() => {
    // Log OpenPanel initialization for debugging
    console.log('OpenPanel Config:', {
      clientId: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID,
      apiUrl: process.env.NEXT_PUBLIC_OPENPANEL_API_URL,
      hasClientId: !!process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID,
      hasApiUrl: !!process.env.NEXT_PUBLIC_OPENPANEL_API_URL
    })
  }, [])

  if (!process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID || !process.env.NEXT_PUBLIC_OPENPANEL_API_URL) {
    console.warn('OpenPanel environment variables are not configured:', {
      hasClientId: !!process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID,
      hasApiUrl: !!process.env.NEXT_PUBLIC_OPENPANEL_API_URL
    })
    return null
  }

  return (
    <OpenPanelComponent
      clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID}
      apiUrl="/api/openpanel"
      trackScreenViews={true}
      trackOutgoingLinks={true}
      trackAttributes={true}
    />
  )
}
