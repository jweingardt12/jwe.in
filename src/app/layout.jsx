import { ThemeProvider } from 'next-themes'
import { Layout } from '../components/Layout'
import { Toaster } from '../components/ui/toaster'
import dynamic from 'next/dynamic'
import { HighlightInit } from '@highlight-run/next/client'
import './globals.css'
import '@radix-ui/themes/styles.css'

const DotBackgroundDemo = dynamic(() => import('../components/ui/dot-background').then(mod => mod.DotBackgroundDemo), { ssr: false })
const OpenPanelWrapper = dynamic(() => import('../components/OpenPanelWrapper'), { ssr: false })
const CommandPalette = dynamic(() => import('../components/CommandPalette'), { ssr: false })
const Analytics = dynamic(() => import('@vercel/analytics/react').then(mod => mod.Analytics), { ssr: false })
const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then(mod => mod.SpeedInsights), { ssr: false })

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
      <html lang="en" className="h-full antialiased" suppressHydrationWarning>
        <body className="flex h-full bg-zinc-50 dark:bg-black" suppressHydrationWarning>
          <ThemeProvider attribute="class" disableTransitionOnChange enableSystem defaultTheme="system">
            <div className="relative flex w-full">
              <div className="fixed inset-0">
                <DotBackgroundDemo />
              </div>
              <div className="relative flex w-full flex-col">
                <Layout>{children}</Layout>
              </div>
            </div>
            <CommandPalette />
            <Toaster />
            <Analytics />
            <SpeedInsights />
            <OpenPanelWrapper />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
