'use client'

import { useEffect } from 'react'
import { OpenPanelComponent } from '@openpanel/nextjs'

export function OpenPanelProvider() {
  useEffect(() => {
    // Log OpenPanel initialization for debugging
    console.log('OpenPanel Config:', {
      clientId: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID,
      hasSecret: !!process.env.NEXT_PUBLIC_OPENPANEL_SECRET
    })
  }, [])

  if (!process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID || !process.env.NEXT_PUBLIC_OPENPANEL_SECRET) {
    console.warn('OpenPanel environment variables are not configured')
    return null
  }

  return (
    <OpenPanelComponent
      clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID}
      secret={process.env.NEXT_PUBLIC_OPENPANEL_SECRET}
      apiUrl={process.env.NEXT_PUBLIC_OPENPANEL_API_URL}
      trackScreenViews={true}
      trackOutgoingLinks={true}
      trackAttributes={true}
    />
  )
}
