import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'
import dynamic from 'next/dynamic'
import { HighlightInit } from '@highlight-run/next/client'
import { Toaster as SonnerToaster } from 'sonner'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import '@radix-ui/themes/styles.css'
import mixpanel from '@/lib/mixpanel'
import { GeistSans } from 'geist/font'
import { GeistMono } from 'geist/font'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { TooltipProvider } from '@/components/ui/tooltip'

const MixpanelTracker = dynamic(() => import('@/components/MixpanelTracker'), { ssr: false })
const OpenPanelWrapper = dynamic(() => import('@/components/OpenPanelWrapper'), { ssr: false })

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
      <html
        lang="en"
        className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="flex h-full bg-zinc-50 dark:bg-black" suppressHydrationWarning>
          <div className="flex w-full">
            <div className="fixed inset-0 flex justify-center sm:px-8">
              <div className="flex w-full max-w-7xl lg:px-8">
                <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
              </div>
            </div>
            <div className="relative flex w-full flex-col">
              <ThemeProvider attribute="class" disableTransitionOnChange>
                <TooltipProvider>
                  <Header />
                  <main className="flex-auto">{children}</main>
                  <Footer />
                </TooltipProvider>
              </ThemeProvider>
              <Analytics />
              <SpeedInsights />
            </div>
          </div>
          <Toaster />
          <SonnerToaster position="bottom-right" theme="system" />
          <MixpanelTracker />
          <OpenPanelWrapper />
        </body>
      </html>
    </>
  )
}
