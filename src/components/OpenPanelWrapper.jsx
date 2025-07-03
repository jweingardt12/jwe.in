'use client'

import { useEffect, useRef } from 'react';
import { OpenPanelComponent, useOpenPanel } from '@openpanel/nextjs';

export default function OpenPanelWrapper() {
  // To prevent duplicate click tracking
  const lastClickRef = useRef({ time: 0, target: null });
  const op = useOpenPanel();

  // Make the hook available globally for other tracking utilities
  useEffect(() => {
    if (op && typeof window !== 'undefined') {
      window.__OPENPANEL_HOOK__ = op;
    }
  }, [op]);

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

      // Check if it's a link
      const isLink = el.tagName === 'A' && el.href;
      const isExternalLink = isLink && 
        !el.href.startsWith(window.location.origin) &&
        !el.href.startsWith('/') &&
        !el.href.startsWith('#');
      const isInternalLink = isLink && !isExternalLink;

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
        isExternal: isExternalLink || undefined,
        isInternal: isInternalLink || undefined,
      };
      
      // Track general click event
      op.track('click', details);
      
      // Track specific navigation events
      if (isInternalLink) {
        // Internal navigation - will trigger screen_view automatically via trackScreenViews
        op.track('internal_link_click', {
          from: window.location.pathname,
          to: new URL(el.href, window.location.origin).pathname,
          text: el.innerText?.slice(0, 120) || undefined,
        });
      } else if (isExternalLink) {
        op.track('external_link_click', {
          url: el.href,
          text: el.innerText?.slice(0, 120) || undefined,
          path: window.location.pathname,
          domain: new URL(el.href).hostname,
        });
      }
    }
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [op]);

  return (
    <OpenPanelComponent
      clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID}
      trackScreenViews={true}
      trackAttributes={true}
      trackOutgoingLinks={true}
      trackSessions={true}
    />
  );
}