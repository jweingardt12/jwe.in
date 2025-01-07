import { ThemeProvider } from 'next-themes'
import { Layout } from '../components/Layout'
import { DotBackgroundDemo } from '../components/ui/dot-background'
import { Toaster } from '../components/ui/toaster'
import CommandPalette from '../components/CommandPalette'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react'
import { OpenPanelComponent } from '@openpanel/nextjs'

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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex h-full bg-zinc-50 dark:bg-black" suppressHydrationWarning>
        <ThemeProvider attribute="class" disableTransitionOnChange enableSystem defaultTheme="system">
          <OpenPanelComponent
            clientId="ea026472-f238-401a-81d3-cdedf7385f2b"
            trackScreenViews={true}
            trackOutgoingLinks={true}
            debug={process.env.NODE_ENV === 'development'}
          />
          <div className="relative flex w-full">
            <div className="fixed inset-0">
              <DotBackgroundDemo />
            </div>
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
  )
}
