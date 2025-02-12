import mixpanel from 'mixpanel-browser';

let initialized = false;

// Standard event names
export const EVENTS = {
  PAGE_VIEW: 'Page View',
  BUTTON_CLICK: 'Button Click',
  LINK_CLICK: 'Link Click',
  FORM_SUBMIT: 'Form Submit',
  SEARCH: 'Search',
  ERROR: 'Error Occurred',
  FEATURE_USED: 'Feature Used',
  FILE_DOWNLOAD: 'File Download',
  VIDEO_PLAY: 'Video Play',
  VIDEO_COMPLETE: 'Video Complete',
  SIGNUP_START: 'Signup Started',
  SIGNUP_COMPLETE: 'Signup Completed',
  LOGIN: 'Login',
  LOGOUT: 'Logout'
} as const;

export const initMixpanel = () => {
  if (initialized) return;
  
  const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

  if (!MIXPANEL_TOKEN) {
    console.warn('Mixpanel token not found in environment variables');
    return;
  }

  if (typeof window !== 'undefined') {
    try {
      mixpanel.init(MIXPANEL_TOKEN, {
        debug: process.env.NODE_ENV === 'development',
        api_host: 'https://api-js.mixpanel.com',
        track_pageview: true,
        ignore_dnt: true,
        persistence: 'localStorage'
      });

      initialized = true;

      // Register device ID for proper session tracking
      const deviceId = mixpanel.get_distinct_id();
      mixpanel.register({
        $device_id: deviceId,
        distinct_id: `$device:${deviceId}`,
        // Register super properties that will be included with all events
        $initial_referrer: document.referrer,
        $initial_referring_domain: document.referrer ? new URL(document.referrer).hostname : '',
        platform: 'Web',
        screen_height: window.screen.height,
        screen_width: window.screen.width,
        viewport_height: window.innerHeight,
        viewport_width: window.innerWidth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });

      // Track initial page view
      track(EVENTS.PAGE_VIEW, {
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        title: document.title
      });

      // Set up click tracking
      setupClickTracking();

    } catch (error) {
      console.error('Error initializing Mixpanel:', error);
    }
  }
};

const setupClickTracking = () => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (!target) return;

    // Get the clicked element and its parents up to 3 levels
    const elements = [
      target,
      target.parentElement,
      target.parentElement?.parentElement,
      target.parentElement?.parentElement?.parentElement
    ].filter(Boolean);

    // Track button clicks
    const button = elements.find(el => el?.tagName === 'BUTTON');
    if (button) {
      track(EVENTS.BUTTON_CLICK, {
        button_text: button.textContent?.trim(),
        button_type: button.getAttribute('type'),
        button_id: button.id,
        button_class: button.className
      });
    }

    // Track custom data attribute elements
    const trackingElement = elements.find(el => 
      el?.hasAttribute('data-mp-track') || 
      el?.hasAttribute('data-mp-track-name') ||
      el?.hasAttribute('data-mp-track-all')
    );

    if (trackingElement) {
      const eventName = trackingElement.getAttribute('data-mp-track-name') || EVENTS.FEATURE_USED;
      const properties = {
        element: trackingElement.tagName.toLowerCase(),
        text: trackingElement.textContent?.trim(),
        'data-mp-track': trackingElement.getAttribute('data-mp-track'),
        href: (trackingElement as HTMLAnchorElement).href,
        path: window.location.pathname,
        ...Object.fromEntries(
          Array.from(trackingElement.attributes)
            .filter(attr => attr.name.startsWith('data-mp-prop-'))
            .map(attr => [attr.name.replace('data-mp-prop-', ''), attr.value])
        )
      };

      track(eventName, properties);
    }
  });
};

// Helper functions for tracking
export const track = (eventName: string, properties?: any) => {
  if (!initialized || typeof window === 'undefined') return;
  
  try {
    mixpanel.track(eventName, {
      ...properties,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export const identify = (userId: string, userProperties?: any) => {
  if (!initialized || typeof window === 'undefined') return;
  
  try {
    mixpanel.identify(userId);
    if (userProperties) {
      mixpanel.people.set({
        ...userProperties,
        $last_seen: new Date().toISOString(),
        $last_login: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error identifying user:', error);
  }
};

export const reset = () => {
  if (!initialized || typeof window === 'undefined') return;
  
  try {
    mixpanel.reset();
  } catch (error) {
    console.error('Error resetting:', error);
  }
};

// Additional tracking utilities
export const trackError = (error: Error, context?: any) => {
  track(EVENTS.ERROR, {
    error_name: error.name,
    error_message: error.message,
    error_stack: error.stack,
    ...context
  });
};

export const trackFeature = (featureName: string, properties?: any) => {
  track(EVENTS.FEATURE_USED, {
    feature_name: featureName,
    ...properties
  });
};

export const trackSearch = (query: string, properties?: any) => {
  track(EVENTS.SEARCH, {
    search_query: query,
    ...properties
  });
};

export default mixpanel; 