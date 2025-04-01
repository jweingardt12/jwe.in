'use client';

import dynamic from 'next/dynamic';

const DotBackgroundDemo = dynamic(() => import('./ui/dot-background'), { ssr: false });
const MixpanelTracker = dynamic(() => import('./MixpanelTracker'), { ssr: false });
const OpenPanelWrapper = dynamic(() => import('./OpenPanelWrapper'), { ssr: false });

export default function ClientSideImports() {
  return (
    <>
      <DotBackgroundDemo />
      <MixpanelTracker />
      <OpenPanelWrapper />
    </>
  );
}
