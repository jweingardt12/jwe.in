import { ThemeProvider } from 'next-themes'
import { Layout } from '../components/Layout'
// import { Toaster } from '../components/ui/toaster' // Using Sonner instead
import { Toaster as SonnerToaster } from 'sonner'
import { MDXWrapper } from '../components/MDXWrapper'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { DotBackground, MixpanelTrackerComponent } from '../components/ClientComponents'
import OpenPanelWrapper from '../components/OpenPanelWrapper'
import './globals.css'
import '@radix-ui/themes/styles.css'
import mixpanel from '@/lib/mixpanel'

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
  description: "Jason Weingardt is a product manager and technologist based in Washington, DC.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jwe.in'),
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en" className="h-full antialiased" suppressHydrationWarning>
        <head>
          {/* No Plausible script here */}
        </head>
        <body className="flex h-full bg-zinc-50 dark:bg-black" suppressHydrationWarning>
          <ThemeProvider attribute="class" disableTransitionOnChange enableSystem defaultTheme="system">
            <MDXWrapper>
              <div className="relative flex w-full">
                <div className="fixed inset-0">
                  <DotBackground />
                </div>
                <div className="relative flex w-full flex-col">
                  <Layout>{children}</Layout>
                </div>
              </div>
              <SonnerToaster position="bottom-right" theme="system" />
              <Analytics />
              <SpeedInsights />
              <MixpanelTrackerComponent />
              <OpenPanelWrapper />
            </MDXWrapper>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
