'use client'

import { OpenPanelComponent } from '@openpanel/nextjs'

export function OpenPanelProvider() {
  return (
    <OpenPanelComponent
      clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID}
      secret={process.env.NEXT_PUBLIC_OPENPANEL_SECRET}
      trackScreenViews={true}
      trackOutgoingLinks={true}
      trackAttributes={true}
    />
  )
} 