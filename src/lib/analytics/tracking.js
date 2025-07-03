/**
 * Centralized analytics tracking utilities for consistent event tracking
 */

// Event categories for better organization
export const EventCategories = {
  NAVIGATION: 'navigation',
  CONTENT: 'content',
  WORK: 'work',
  NOTES: 'notes',
  AUTH: 'auth',
  SOCIAL: 'social',
};

// Standard event names
export const EventNames = {
  // Navigation
  LINK_CLICK: 'link_click',
  NAVIGATION_CLICK: 'navigation_click',
  
  // Content interactions
  PROJECT_CLICKED: 'project_clicked',
  ARTICLE_LINK_CLICK: 'article_link_click',
  LINK_PREVIEW_CLICK: 'link_preview_click',
  TOOL_LINK_CLICK: 'tool_link_click',
  ABOUT_TOOL_LINK_CLICK: 'about_tool_link_click',
  SOURCE_CODE_LINK_CLICK: 'source_code_link_click',
  
  // Social
  SOCIAL_LINK_CLICK: 'social_link_click',
  FOOTER_SOCIAL_LINK_CLICK: 'footer_social_link_click',
  
  // Work/Professional
  COMPANY_LINK_CLICK: 'company_link_click',
  COMPANY_WEBSITE_CLICK: 'company_website_click',
  PRODUCT_LINK_CLICK: 'product_link_click',
  TESTIMONIAL_LINKEDIN_CLICK: 'testimonial_linkedin_click',
  HEADLINE_LINK_CLICK: 'headline_link_click',
  
  // Notes
  NOTE_CREATED: 'note_created',
  NOTE_EDITED: 'note_edited',
  NOTE_PUBLISHED: 'note_published',
  NOTE_UNPUBLISHED: 'note_unpublished',
  NOTE_DELETED: 'note_deleted',
  NOTE_LINK_COPIED: 'note_link_copied',
  
  // Auth
  ADMIN_LOGOUT: 'admin_logout',
  
  // Session
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
  
  // Navigation
  SCREEN_VIEW: 'screen_view',
  EXTERNAL_LINK_CLICK: 'external_link_click',
};

/**
 * Base tracking function with common properties
 */
function trackEvent(eventName, properties = {}) {
  if (typeof window === 'undefined') return;
  
  const commonProps = {
    timestamp: Date.now(),
    path: window.location.pathname,
    referrer: document.referrer || undefined,
  };
  
  try {
    // Use the global window.op function that OpenPanel SDK provides
    if (window.op && typeof window.op === 'function') {
      window.op('track', eventName, {
        ...commonProps,
        ...properties,
      });
    } else {
      // Queue events if OpenPanel isn't loaded yet
      window.op = window.op || function(...args) {
        (window.op.q = window.op.q || []).push(args);
      };
      window.op('track', eventName, {
        ...commonProps,
        ...properties,
      });
    }
  } catch (error) {
    // Silently fail
  }
}

/**
 * Track link clicks with consistent properties
 */
export function trackLinkClick(eventName, {
  url,
  title,
  type,
  location,
  category = EventCategories.NAVIGATION,
  ...additionalProps
}) {
  trackEvent(eventName, {
    url,
    title,
    type,
    location,
    category,
    ...additionalProps,
  });
}

/**
 * Track social media link clicks
 */
export function trackSocialClick({
  platform,
  url,
  location = 'unknown',
}) {
  const eventName = location === 'footer' 
    ? EventNames.FOOTER_SOCIAL_LINK_CLICK 
    : EventNames.SOCIAL_LINK_CLICK;
    
  trackLinkClick(eventName, {
    platform,
    url,
    type: 'social',
    location,
    category: EventCategories.SOCIAL,
  });
}

/**
 * Track project interactions
 */
export function trackProjectClick(project) {
  trackEvent(EventNames.PROJECT_CLICKED, {
    project_id: project.id,
    project_title: project.title,
    project_url: typeof project.link === 'object' ? project.link.url : project.link,
    type: 'project',
    location: 'homepage_showcase',
    category: EventCategories.CONTENT,
  });
}

/**
 * Track article/blog post clicks
 */
export function trackArticleClick(article) {
  trackLinkClick(EventNames.ARTICLE_LINK_CLICK, {
    url: article.url,
    title: article.title,
    type: 'article',
    location: 'reading_list',
    category: EventCategories.CONTENT,
  });
}

/**
 * Track work-related link clicks
 */
export function trackWorkClick(type, { company, url, location, ...props }) {
  const eventMap = {
    company: EventNames.COMPANY_LINK_CLICK,
    website: EventNames.COMPANY_WEBSITE_CLICK,
    product: EventNames.PRODUCT_LINK_CLICK,
    testimonial: EventNames.TESTIMONIAL_LINKEDIN_CLICK,
    headline: EventNames.HEADLINE_LINK_CLICK,
  };
  
  trackLinkClick(eventMap[type] || EventNames.LINK_CLICK, {
    company,
    url,
    type,
    location: location || 'work_page',
    category: EventCategories.WORK,
    ...props,
  });
}

/**
 * Track note management actions
 */
export function trackNoteAction(action, { noteId, title, slug }) {
  const eventMap = {
    create: EventNames.NOTE_CREATED,
    edit: EventNames.NOTE_EDITED,
    publish: EventNames.NOTE_PUBLISHED,
    unpublish: EventNames.NOTE_UNPUBLISHED,
    delete: EventNames.NOTE_DELETED,
    copy_link: EventNames.NOTE_LINK_COPIED,
  };
  
  trackEvent(eventMap[action], {
    noteId,
    title,
    slug,
    action,
    category: EventCategories.NOTES,
  });
}

/**
 * Track authentication events
 */
export function trackAuthEvent(action) {
  const eventMap = {
    logout: EventNames.ADMIN_LOGOUT,
  };
  
  trackEvent(eventMap[action], {
    action,
    category: EventCategories.AUTH,
  });
}

/**
 * Get platform name from URL
 */
export function getPlatformFromUrl(url) {
  const platformMap = {
    'twitter.com': 'twitter',
    'x.com': 'twitter',
    'github.com': 'github',
    'linkedin.com': 'linkedin',
    'instagram.com': 'instagram',
    'youtube.com': 'youtube',
    'facebook.com': 'facebook',
    'threads.net': 'threads',
  };
  
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    return platformMap[hostname] || hostname.split('.')[0];
  } catch {
    return 'unknown';
  }
}

// Export base tracking function for custom events
export { trackEvent };