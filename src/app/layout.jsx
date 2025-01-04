import { ThemeProvider } from 'next-themes'
import { Layout } from '../components/Layout'
import { Toaster } from '../components/ui/toaster'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react'
import PlausibleProvider from 'next-plausible'

import './globals.css'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata = {
  title: {
    template: '%s - Jason Weingardt',
    default: 'Jason Weingardt - Product Manager, technologist, nerd.',
  },
  description: "I'm Jason Weingardt, a product manager and technologist based in New York City.",
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script defer data-domain="jwe.in" src="https://plausible.io/js/script.outbound-links.pageview-props.tagged-events.js"></script>
      </head>
      <body className="flex h-full bg-zinc-50 dark:bg-black" suppressHydrationWarning>
        <PlausibleProvider domain="jwe.in">
          <ThemeProvider attribute="class" disableTransitionOnChange>
            <div className="flex w-full">
              <Layout>{children}</Layout>
              <Toaster />
            </div>
          </ThemeProvider>
          <SpeedInsights />
          <Analytics />
        </PlausibleProvider>
      </body>
    </html>
  )
}
