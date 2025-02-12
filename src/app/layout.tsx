import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Metadata } from 'next';
import { useEffect } from 'react';
import mixpanel, { identify } from '@/lib/mixpanel';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jason Wei',
  description: 'Jason Wei\'s personal website',
}

// Create a client-side only component for Mixpanel
function MixpanelTracker() {
  useEffect(() => {
    console.log('Initializing Mixpanel tracking...'); // Debug log
    console.log('Token:', process.env.NEXT_PUBLIC_MIXPANEL_TOKEN); // Debug log
    
    try {
      // Track page view
      mixpanel.track('Page View', {
        'page': window.location.pathname,
        'url': window.location.href
      });
      console.log('Successfully tracked page view'); // Debug log
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }, []);

  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
        <SpeedInsights />
        <MixpanelTracker />
      </body>
    </html>
  )
} 