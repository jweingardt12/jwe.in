'use client'

import { OpenPanelComponent } from '@openpanel/nextjs'

export default function OpenPanelProvider() {
  return (
    <OpenPanelComponent
      clientId="92f043db-86e1-444e-9a0a-899cfc61b387"
      trackScreenViews={true}
      trackAttributes={true}
      trackOutgoingLinks={true}
      trackSessions={true}
      enable={true}
    />
  )
} 