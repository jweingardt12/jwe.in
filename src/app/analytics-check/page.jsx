'use client';

import { useEffect, useState } from 'react';
import { useOpenPanel } from '@openpanel/nextjs';

export default function AnalyticsCheck() {
  const op = useOpenPanel();
  const [status, setStatus] = useState({
    clientId: 'Loading...',
    hookAvailable: false,
    windowOp: false,
    testSent: false
  });

  useEffect(() => {
    // Check configuration
    const clientId = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID || 'NOT SET';
    const hookAvailable = !!op;
    const windowOp = !!(window.op || window.openpanel);
    
    setStatus({
      clientId,
      hookAvailable,
      windowOp,
      testSent: false
    });

    // Log to console for debugging
    console.log('[Analytics Check] Configuration:', {
      clientId,
      hookAvailable,
      windowOp,
      hook: op,
      'window.op': window.op,
      'window.__OPENPANEL_HOOK__': window.__OPENPANEL_HOOK__
    });

    // Try to send a test event
    if (op) {
      console.log('[Analytics Check] Sending test event...');
      op.track('analytics_check_page_view', {
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
      });
      setStatus(prev => ({ ...prev, testSent: true }));
    }
  }, [op]);

  const sendManualEvent = () => {
    if (op) {
      const eventName = `manual_test_${Date.now()}`;
      op.track(eventName, {
        source: 'button_click',
        timestamp: new Date().toISOString()
      });
      console.log(`[Analytics Check] Sent event: ${eventName}`);
      alert(`Event sent: ${eventName}\\nCheck your OpenPanel dashboard!`);
    } else {
      alert('OpenPanel not available!');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Analytics Check</h1>
        
        <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 space-y-4">
          <div>
            <strong>Client ID:</strong>{' '}
            <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {status.clientId}
            </code>
          </div>
          
          <div>
            <strong>Hook Available:</strong>{' '}
            <span className={status.hookAvailable ? 'text-green-600' : 'text-red-600'}>
              {status.hookAvailable ? '✓ Yes' : '✗ No'}
            </span>
          </div>
          
          <div>
            <strong>window.op Available:</strong>{' '}
            <span className={status.windowOp ? 'text-green-600' : 'text-red-600'}>
              {status.windowOp ? '✓ Yes' : '✗ No'}
            </span>
          </div>
          
          <div>
            <strong>Test Event Sent:</strong>{' '}
            <span className={status.testSent ? 'text-green-600' : 'text-gray-500'}>
              {status.testSent ? '✓ Yes' : 'No'}
            </span>
          </div>
          
          <button
            onClick={sendManualEvent}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send Test Event
          </button>
          
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            <p>Check the browser console for detailed logs.</p>
            <p>Events should appear in your OpenPanel dashboard within a few seconds.</p>
          </div>
        </div>
      </div>
    </div>
  );
}