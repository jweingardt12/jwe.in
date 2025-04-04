'use client';

// This is a client-side wrapper for OpenPanel analytics
const OpenPanel = {
  track: (eventName, properties = {}) => {
    if (typeof window !== 'undefined' && window.openpanel) {
      try {
        window.openpanel.track(eventName, properties);
        console.log(`[OpenPanel] Tracked event: ${eventName}`, properties);
      } catch (error) {
        console.error(`[OpenPanel] Error tracking event ${eventName}:`, error);
      }
    } else {
      console.log(`[OpenPanel] Event not tracked (OpenPanel not loaded): ${eventName}`, properties);
    }
  },
  
  identify: (userId, traits = {}) => {
    if (typeof window !== 'undefined' && window.openpanel) {
      try {
        window.openpanel.identify(userId, traits);
        console.log(`[OpenPanel] Identified user: ${userId}`, traits);
      } catch (error) {
        console.error(`[OpenPanel] Error identifying user ${userId}:`, error);
      }
    } else {
      console.log(`[OpenPanel] User not identified (OpenPanel not loaded): ${userId}`, traits);
    }
  },
  
  page: (name, properties = {}) => {
    if (typeof window !== 'undefined' && window.openpanel) {
      try {
        window.openpanel.page(name, properties);
        console.log(`[OpenPanel] Tracked page view: ${name}`, properties);
      } catch (error) {
        console.error(`[OpenPanel] Error tracking page view ${name}:`, error);
      }
    } else {
      console.log(`[OpenPanel] Page view not tracked (OpenPanel not loaded): ${name}`, properties);
    }
  }
};

export default OpenPanel;
