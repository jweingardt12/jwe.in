import { ThemeProvider } from 'next-themes'
import { Layout } from '../components/Layout'
import { Toaster } from '../components/ui/toaster'
import dynamic from 'next/dynamic'
import { HighlightInit } from '@highlight-run/next/client'
import { Toaster as SonnerToaster } from 'sonner'
import { MDXWrapper } from '../components/MDXWrapper'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import '@radix-ui/themes/styles.css'
import mixpanel from '@/lib/mixpanel'

const DotBackgroundDemo = dynamic(() => import('../components/ui/dot-background'), { ssr: false })
const MixpanelTracker = dynamic(() => import('../components/MixpanelTracker'), { ssr: false })
const OpenPanelWrapper = dynamic(() => import('../components/OpenPanelWrapper'), { ssr: false })

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
      <HighlightInit
        projectId={'3ej74nve'}
        serviceName="my-nextjs-frontend"
        tracingOrigins
        networkRecording={{
          enabled: true,
          recordHeadersAndBody: true,
          urlBlocklist: [],
          excludedHostnames: ['localhost', '192.168.86.*'],
        }}
      />
      <html lang="en" className="h-full antialiased" suppressHydrationWarning>
        <head>
          {/* No Plausible script here */}
        </head>
        <body className="flex h-full bg-zinc-50 dark:bg-black" suppressHydrationWarning>
          <ThemeProvider attribute="class" disableTransitionOnChange enableSystem defaultTheme="system">
            <MDXWrapper>
              <div className="relative flex w-full">
                <div className="fixed inset-0">
                  <DotBackgroundDemo />
                </div>
                <div className="relative flex w-full flex-col">
                  <Layout>{children}</Layout>
                </div>
              </div>
              <Toaster />
              <SonnerToaster position="bottom-right" theme="system" />
              <Analytics />
              <SpeedInsights />
              <MixpanelTracker />
              <OpenPanelWrapper />
            </MDXWrapper>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
