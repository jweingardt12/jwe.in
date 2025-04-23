'use client'

import { OpenPanelComponent } from '@openpanel/nextjs'

import { useEffect, useRef } from 'react';
import OpenPanel from '../components/analytics/OpenPanel';
import { OpenPanelComponent } from '@openpanel/nextjs';

export default function OpenPanelWrapper() {
  // To prevent duplicate click tracking
  const lastClickRef = useRef({ time: 0, target: null });

  useEffect(() => {
    function handleClick(e) {
      // Only fire for left-clicks
      if (e.button !== 0) return;
      const now = Date.now();
      // Debounce: skip if same element within 500ms
      if (
        lastClickRef.current.target === e.target &&
        now - lastClickRef.current.time < 500
      ) {
        return;
      }
      lastClickRef.current = { time: now, target: e.target };

      // Find the closest clickable element
      let el = e.target;
      while (el && el !== document.body) {
        if (
          el.tagName === 'A' ||
          el.tagName === 'BUTTON' ||
          el.onclick ||
          el.getAttribute('role') === 'button' ||
          el.tabIndex >= 0
        ) {
          break;
        }
        el = el.parentElement;
      }
      if (!el || el === document.body) el = e.target;

      // Collect details
      const details = {
        tag: el.tagName,
        id: el.id || undefined,
        class: el.className || undefined,
        text: el.innerText?.slice(0, 120) || undefined,
        href: el.href || undefined,
        role: el.getAttribute('role') || undefined,
        name: el.getAttribute('name') || undefined,
        ariaLabel: el.getAttribute('aria-label') || undefined,
        dataAttrs: Array.from(el.attributes)
          .filter(attr => attr.name.startsWith('data-'))
          .reduce((acc, attr) => { acc[attr.name] = attr.value; return acc; }, {}),
        path: window.location.pathname,
      };
      OpenPanel.track('click', details);
    }
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return (
    <OpenPanelComponent
      clientId="6382021f-a0bc-43de-bb62-e1ddee2d1396"
      publicKey={process.env.NEXT_PUBLIC_OPENPANEL_PUBLIC_KEY}
      trackScreenViews={true}
      trackAttributes={true}
      trackOutgoingLinks={true}
      trackSessions={true}
    />
  );
}

