'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initMixpanel } from '@/lib/mixpanel'

export default function MixpanelTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Initialize Mixpanel on the client side
    initMixpanel();

    if (typeof window === 'undefined') return;

    const properties = {
      page: pathname,
      url: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    try {
      initMixpanel().track('Page View', properties);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }, [pathname]);

  return null;
} 