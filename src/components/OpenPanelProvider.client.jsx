'use client'

import { useOpenPanel } from '@openpanel/nextjs'

export function OpenPanelProvider() {
  useOpenPanel({
    clientId: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID,
    secret: process.env.NEXT_PUBLIC_OPENPANEL_SECRET,
    config: {
      trackScreenViews: true,
      trackOutgoingLinks: true,
      trackAttributes: true,
      domain: 'https://jwe.in'
    }
  })

  return null
} 