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
            
            // Initialize tracking state
            const state = {
              initialized: false,
              endpoint: window.location.origin + '/api/openpanel/track',
              clientId: '${process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID}',
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
                        user_agent: navigator.userAgent,
                        browser: {
                          name: navigator.userAgent.includes('Firefox') ? 'Firefox' :
                                navigator.userAgent.includes('Chrome') ? 'Chrome' :
                                navigator.userAgent.includes('Safari') ? 'Safari' :
                                navigator.userAgent.includes('Edge') ? 'Edge' :
                                'Other',
                          language: navigator.language,
                          platform: navigator.platform,
                          vendor: navigator.vendor
                        },
                        os: {
                          platform: navigator.platform,
                          mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                        },
                        screen: {
                          width: window.screen.width,
                          height: window.screen.height,
                          viewport_width: window.innerWidth,
                          viewport_height: window.innerHeight,
                          pixel_ratio: window.devicePixelRatio,
                          color_depth: window.screen.colorDepth
                        },
                        timestamp: new Date().toISOString()
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

            // Initialize tracking
            window.op('init');

            // Track page view
            window.op('page_view', {
              url: window.location.href,
              path: window.location.pathname
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
