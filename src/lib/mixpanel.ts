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
        debug: false,
        api_host: 'https://api-js.mixpanel.com',
        track_pageview: false,
        ignore_dnt: true,
        persistence: 'localStorage',
        // @ts-ignore - Session recording config from latest Mixpanel docs
        session_recording: {
          enabled: true,
          recordingPercent: 100,
          minimize_logs: true,
          block_class: 'mp-no-record',
          block_selector: 'img, video',
          mask_text_class: 'mp-mask',
          mask_text_selector: 'input, textarea, [data-mp-mask]',
          collect_fonts: false,
          capture_canvas: false,
          idle_timeout: 1800000, // 30 minutes idle timeout
          max_duration: 3600000 // 1 hour max session length
        }
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

    // Track link clicks
    const link = elements.find(el => el?.tagName === 'A') as HTMLAnchorElement;
    if (link) {
      const isNavLink = link.closest('nav') !== null;
      const isContactButton = link.href?.includes('mailto:') || 
                            link.textContent?.toLowerCase().includes('contact') ||
                            link.classList.contains('contact-button');
      
      track(EVENTS.LINK_CLICK, {
        link_text: link.textContent?.trim() || 'Untitled Link',
        link_url: link.href,
        link_id: link.id || undefined,
        link_class: link.className || undefined,
        is_navigation: isNavLink,
        is_contact: isContactButton,
        is_external: link.hostname !== window.location.hostname,
        link_type: isContactButton ? 'contact' : 
                  isNavLink ? 'navigation' : 
                  link.hostname !== window.location.hostname ? 'external' : 
                  'content',
        current_page: window.location.pathname
      });
    }

    // Track button clicks
    const button = elements.find(el => el?.tagName === 'BUTTON');
    if (button) {
      // Get meaningful text content from button or its children
      let buttonText = button.textContent?.trim() || '';
      if (!buttonText) {
        // Try to get text from aria-label or title
        buttonText = button.getAttribute('aria-label') || 
                    button.getAttribute('title') || 
                    'Untitled Button';
      }

      // Get meaningful description from button's purpose
      const buttonPurpose = 
        (button as HTMLButtonElement).form ? 'form-submit' :
        button.closest('dialog') ? 'dialog' :
        button.closest('nav') ? 'navigation' :
        button.closest('header') ? 'header' :
        button.closest('footer') ? 'footer' :
        'content';

      // Clean up class names to be more readable
      const classList = Array.from(button.classList)
        .filter(cls => 
          !cls.includes('justify-') && 
          !cls.includes('items-') && 
          !cls.includes('mdx-') &&
          !cls.includes('group') &&
          !cls.includes('flex')
        );

      track(EVENTS.BUTTON_CLICK, {
        text: buttonText,
        type: button.getAttribute('type') || undefined,
        id: button.id || undefined,
        classes: classList.length > 0 ? classList.join(' ') : undefined,
        purpose: buttonPurpose,
        has_icon: button.querySelector('svg, img, .icon') !== null,
        current_page: window.location.pathname,
        parent_element: button.parentElement?.tagName.toLowerCase() || undefined,
        location: buttonPurpose
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
        text: trackingElement.textContent?.trim() || 'Untitled Element',
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