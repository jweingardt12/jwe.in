import { ThemeProvider } from 'next-themes'
import { Layout } from '../components/Layout'
import { DotBackgroundDemo } from '../components/ui/dot-background'
import { Toaster } from '../components/ui/toaster'
import CommandPalette from '../components/CommandPalette'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react'
import { OpenPanelComponent } from '@openpanel/nextjs'
import { HighlightInit } from '@highlight-run/next/client'

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
  description: "I'm Jason Weingardt, a product manager and technologist based in Washington, DC.",
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
        <body className="flex h-full bg-zinc-50 dark:bg-black" suppressHydrationWarning>
          <ThemeProvider attribute="class" disableTransitionOnChange enableSystem defaultTheme="system">
            <div className="relative flex w-full">
              <div className="fixed inset-0">
                <DotBackgroundDemo />
              </div>
              <OpenPanelComponent
                clientId="92f043db-86e1-444e-9a0a-899cfc61b387"
                trackScreenViews={true}
                trackAttributes={true}
                trackOutgoingLinks={true}
                trackSessions={true}
                enable={true}
              />
              <div className="relative z-10 flex w-full">
                <Layout>{children}</Layout>
                <Toaster />
              </div>
              <CommandPalette />
            </div>
          </ThemeProvider>
          <SpeedInsights />
          <Analytics />
        </body>
      </html>
    </>
  )
}
