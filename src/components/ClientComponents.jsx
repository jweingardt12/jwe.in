'use client';

import dynamic from 'next/dynamic';

const DotBackgroundDemo = dynamic(() => import('./ui/dot-background'), { ssr: false });
const MixpanelTracker = dynamic(() => import('./MixpanelTracker'), { ssr: false });
const OpenPanelWrapper = dynamic(() => import('./OpenPanelWrapper'), { ssr: false });

export function DotBackground() {
  return <DotBackgroundDemo />;
}

export function MixpanelTrackerComponent() {
  return <MixpanelTracker />;
}

export function OpenPanelComponent() {
  return <OpenPanelWrapper />;
}
