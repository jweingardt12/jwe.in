'use client'

import { OpenPanelComponent } from '@openpanel/nextjs'

export default function OpenPanelWrapper() {
  return (
    <OpenPanelComponent
      clientId="6382021f-a0bc-43de-bb62-e1ddee2d1396"
      publicKey={process.env.NEXT_PUBLIC_OPENPANEL_PUBLIC_KEY}
      trackScreenViews={true}
      trackAttributes={true}
      trackOutgoingLinks={true}
      trackSessions={true}
    />
  )
}
