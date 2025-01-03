'use client'

import Script from 'next/script'

export function OpenPanelScript() {
  return (
    <Script
      id="openpanel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          try {
            console.log('Initializing OpenPanel...');
            console.log('Client ID:', '${process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID}');
            
            // Generate or retrieve profile ID
            function getProfileId() {
              let profileId = localStorage.getItem('op_profile_id');
              if (!profileId) {
                profileId = 'p_' + Math.random().toString(36).substring(2) + '_' + Date.now();
                localStorage.setItem('op_profile_id', profileId);
              }
              return profileId;
            }

            // Initialize tracking state
            const state = {
              initialized: false,
              endpoint: window.location.origin + '/api/openpanel/track',
              clientId: '${process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID}',
              profileId: typeof window !== 'undefined' ? getProfileId() : null,
              queue: []
            };

            // Process queued events
            async function processQueue() {
              if (!state.initialized) return;
              
              while (state.queue.length > 0) {
                const [eventName, eventData] = state.queue.shift();
                try {
                  console.log('Processing event:', eventName, eventData);
                  const response = await fetch(state.endpoint, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      event: eventName,
                      data: {
                        ...eventData,
                        referrer: document.referrer,
                        user_agent: typeof window !== 'undefined' ? navigator.userAgent : null,
                        device: typeof window !== 'undefined' ? (/Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'mobile' : 'desktop') : null,
                        browser: typeof window !== 'undefined' ? (
                          navigator.userAgent.includes('Firefox') ? 'Firefox' :
                          navigator.userAgent.includes('Chrome') ? 'Chrome' :
                          navigator.userAgent.includes('Safari') ? 'Safari' :
                          navigator.userAgent.includes('Edge') ? 'Edge' :
                          'Other'
                        ) : null,
                        browser_language: typeof window !== 'undefined' ? navigator.language : null,
                        browser_vendor: typeof window !== 'undefined' ? navigator.vendor : null,
                        os: typeof window !== 'undefined' ? (
                          /Mac/i.test(navigator.userAgent) ? 'Mac OS' :
                          /Windows/i.test(navigator.userAgent) ? 'Windows' :
                          /Linux/i.test(navigator.userAgent) ? 'Linux' :
                          /Android/i.test(navigator.userAgent) ? 'Android' :
                          /iOS/i.test(navigator.userAgent) ? 'iOS' : 'Other'
                        ) : null,
                        is_mobile: typeof window !== 'undefined' ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) : null,
                        screen_width: typeof window !== 'undefined' ? window.screen.width : null,
                        screen_height: typeof window !== 'undefined' ? window.screen.height : null,
                        viewport_width: typeof window !== 'undefined' ? window.innerWidth : null,
                        viewport_height: typeof window !== 'undefined' ? window.innerHeight : null,
                        pixel_ratio: typeof window !== 'undefined' ? window.devicePixelRatio : null,
                        color_depth: typeof window !== 'undefined' ? window.screen.colorDepth : null,
                        timestamp: new Date().toISOString(),
                        profile_id: state.profileId
                      }
                    })
                  });
                  
                  const result = await response.json();
                  console.log('Tracking response:', {
                    status: response.status,
                    data: result,
                    event: eventName
                  });
                } catch (error) {
                  console.error('Failed to track event:', eventName, error);
                }
              }
            }

            // Initialize queue
            window.op = window.op || function(eventName, eventData) {
              if (eventName === 'init') {
                state.initialized = true;
                console.log('OpenPanel initialized with endpoint:', state.endpoint);
                processQueue();
                return;
              }
              
              state.queue.push([eventName, eventData]);
              console.log('Queued event:', eventName, eventData);
              
              if (state.initialized) {
                processQueue();
              }
            };

            // Track session start
            const sessionStartTime = new Date();
            
            // Initialize tracking
            window.op('init');

            // Track session start
            window.op('session_start', {
              url: window.location.href,
              path: window.location.pathname,
              start_time: sessionStartTime.toISOString()
            });

            // Track page view
            window.op('page_view', {
              url: window.location.href,
              path: window.location.pathname
            });

            // Track session end on page unload
            window.addEventListener('beforeunload', function() {
              const sessionEndTime = new Date();
              const sessionDuration = Math.round((sessionEndTime - sessionStartTime) / 1000); // duration in seconds
              
              // Use sendBeacon for reliable delivery during page unload
              const data = {
                event: 'session_end',
                data: {
                  url: window.location.href,
                  path: window.location.pathname,
                  end_time: sessionEndTime.toISOString(),
                  duration_seconds: sessionDuration,
                  start_time: sessionStartTime.toISOString()
                }
              };
              
              navigator.sendBeacon(state.endpoint, JSON.stringify(data));
            });

            // Add click tracking with external link detection
            document.addEventListener('click', function(e) {
              const target = e.target.closest('a') || e.target;
              const isLink = target.tagName === 'A';
              const href = target.href;
              const isExternal = isLink && href && (
                href.startsWith('http') && !href.includes(window.location.hostname)
              );

              // Track all clicks
              window.op('click', {
                element: target.tagName,
                text: target.innerText,
                url: window.location.href,
                path: window.location.pathname,
                x: e.clientX,
                y: e.clientY,
                is_external_link: isExternal,
                link_url: isExternal ? href : undefined
              });

              // Additional tracking for external links
              if (isExternal) {
                window.op('external_link_click', {
                  url: window.location.href,
                  path: window.location.pathname,
                  destination: href,
                  text: target.innerText || target.getAttribute('aria-label') || 'Unknown'
                });
              }
            });

            console.log('OpenPanel initialization complete');
          } catch (error) {
            console.error('OpenPanel initialization failed:', error);
          }
        `
      }}
    />
  )
}
