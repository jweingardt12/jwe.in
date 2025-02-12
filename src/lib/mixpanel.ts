import mixpanel from 'mixpanel-browser';

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

const initMixpanel = () => {
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
        persistence: 'localStorage',
        // Enable automatic click tracking
        track_clicks: true,
        // Enable link click tracking
        track_links: true,
        // Configure session recording
        record_sessions_percent: 100, // Record 100% of sessions
        record_block_class: 'mp-no-record',
        record_block_selector: '.mp-no-record, [data-mp-no-record], img, video',
        record_mask_text_class: 'mp-mask',
        record_mask_text_selector: '.mp-mask, [data-mp-mask], input, textarea',
        record_collect_fonts: false,
        record_canvas: false,
        record_idle_timeout_ms: 1800000, // 30 minutes
        record_max_ms: 3600000, // 1 hour (adjust as needed, max 24 hours)
        record_min_ms: 8000, // 8 seconds minimum recording
        // Configure what elements to track
        property_blacklist: ['password']
      });

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

      // Add session recording properties to all subsequent events
      const sessionProps = mixpanel.get_session_recording_properties();
      if (sessionProps) {
        mixpanel.register(sessionProps);
      }

      // Track page views with UTM parameters
      const trackPageView = () => {
        const url = new URL(window.location.href);
        const utmParams = {
          utm_source: url.searchParams.get('utm_source'),
          utm_medium: url.searchParams.get('utm_medium'),
          utm_campaign: url.searchParams.get('utm_campaign'),
          utm_term: url.searchParams.get('utm_term'),
          utm_content: url.searchParams.get('utm_content')
        };

        track(EVENTS.PAGE_VIEW, {
          url: window.location.href,
          path: window.location.pathname,
          referrer: document.referrer,
          title: document.title,
          ...utmParams
        });
      };

      // Track initial page view
      trackPageView();

      // Set up click tracking for elements with data attributes
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

      // Track form submissions
      document.addEventListener('submit', (event) => {
        const form = event.target as HTMLFormElement;
        if (!form) return;

        track(EVENTS.FORM_SUBMIT, {
          form_id: form.id,
          form_name: form.name,
          form_class: form.className,
          form_action: form.action
        });
      });

    } catch (error) {
      console.error('Error initializing Mixpanel:', error);
    }
  }
};

// Initialize on module load
initMixpanel();

// Helper functions for tracking
export const track = (eventName: string, properties?: any) => {
  if (typeof window !== 'undefined') {
    try {
      // Get fresh session recording properties for each event
      const sessionProps = mixpanel.get_session_recording_properties();
      mixpanel.track(eventName, {
        ...properties,
        ...sessionProps,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }
};

export const identify = (userId: string, userProperties?: any) => {
  if (typeof window !== 'undefined') {
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
  }
};

export const reset = () => {
  if (typeof window !== 'undefined') {
    try {
      mixpanel.reset();
    } catch (error) {
      console.error('Error resetting:', error);
    }
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