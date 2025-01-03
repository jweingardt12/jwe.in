import { Providers } from './providers'
import { Layout } from '../components/Layout'
import { Toaster } from "../components/ui/toaster"
import { OpenPanelScript } from '../components/OpenPanelScript.client'
import { SpeedInsights } from "@vercel/speed-insights/next"

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
      <body className="flex h-full bg-zinc-50 dark:bg-black" suppressHydrationWarning>
        <Providers>
          <OpenPanelScript />
          <div className="flex w-full">
            <Layout>{children}</Layout>
            <Toaster />
          </div>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  )
}
