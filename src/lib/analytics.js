/**
 * Utility functions for OpenPanel Analytics
 * This provides a compatible API for components transitioning from OpenPanel
 */

/**
 * Track a custom event with OpenPanel
 * @param {string} eventName - The name of the event to track
 * @param {Object} props - Optional properties to include with the event
 */
export function trackEvent(eventName, props = {}) {
  if (typeof window === 'undefined') return;
  
  try {
    // Get Highlight.io session ID if available
    let highlightSessionId = null;
    let highlightSessionUrl = null;
    
    if (window.H && typeof window.H.getSessionURL === 'function') {
      highlightSessionUrl = window.H.getSessionURL();
      // Extract session ID from URL if available
      if (highlightSessionUrl && typeof highlightSessionUrl === 'string') {
        const urlParts = highlightSessionUrl.split('/');
        highlightSessionId = urlParts[urlParts.length - 1];
      }
    }
    
    // Create and dispatch a custom event that OpenPanel will capture
    const event = new CustomEvent('openpanel', { 
      detail: {
        name: eventName,
        properties: {
          ...props,
          highlightSessionId: highlightSessionId,
          highlightSessionUrl: highlightSessionUrl
        }
      }
    });
    window.dispatchEvent(event);
    
    // Log events in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[OpenPanel] Event tracked: ${eventName}`, {
        ...props,
        highlightSessionId,
        highlightSessionUrl
      });
    }
  } catch (error) {
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
