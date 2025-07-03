/**
 * Utility functions for OpenPanel Analytics
 * This provides a compatible API for components transitioning from Plausible to OpenPanel
 */

/**
 * Track a custom event with OpenPanel
 * @param {string} eventName - The name of the event to track
 * @param {Object} props - Optional properties to include with the event
 */
export function trackEvent(eventName, props = {}) {
  if (typeof window === 'undefined') return;
  
  try {
    // First, try to use the OpenPanel React hook if available
    if (window.__OPENPANEL_HOOK__) {
      window.__OPENPANEL_HOOK__.track(eventName, props);
      return;
    }
    
    // Use the global window.op function that OpenPanel SDK provides
    if (window.op && typeof window.op === 'function') {
      window.op('track', eventName, props);
    } else {
      // Queue events if OpenPanel isn't loaded yet
      window.op = window.op || function(...args) {
        (window.op.q = window.op.q || []).push(args);
      };
      window.op('track', eventName, props);
    }
  } catch (error) {
    // Silently fail in production
    if (process.env.NODE_ENV === 'development') {
      console.error('[OpenPanel] Error tracking event:', error);
    }
  }
}

/**
 * Hook to provide tracking functionality for OpenPanel
 * @returns {Object} - Object containing track function
 */
export function usePlausible() {
  // We'll keep the function name as usePlausible for backward compatibility
  // but it will use OpenPanel tracking instead
  
  return {
    track: (eventName, props = {}) => {
      trackEvent(eventName, props);
    },
    trackEvent: (eventName, props = {}) => {
      trackEvent(eventName, props);
    },
    trackPageview: (url, props = {}) => {
      trackEvent('pageview', { url: url || window.location.href, ...props });
    },
    trackOutboundLinkClick: (url, props = {}) => {
      trackEvent('outbound_link', { url, ...props });
    },
    trackDownload: (url, fileType, props = {}) => {
      trackEvent('download', { url, fileType, ...props });
    },
    trackSearch: (query, resultsCount, props = {}) => {
      trackEvent('search', { query, resultsCount, ...props });
    }
  };
}