import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import { Toaster } from "@/components/ui/toaster"
import Script from 'next/script'

import '@/app/globals.css'

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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src="https://openpanel.dev/op1.js"
              strategy="afterInteractive"
            />
            <Script
              id="openpanel-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.op = window.op||function(...args){(window.op.q=window.op.q||[]).push(args);};
                  window.op('init', {
                    clientId: 'e217e794-f391-4e78-b617-0e093b03ec9d',
                    trackScreenViews: true,
                    trackOutgoingLinks: true,
                    trackAttributes: true,
                  });
                  console.log('OpenPanel initialized with ID:', 'e217e794-f391-4e78-b617-0e093b03ec9d');
                `
              }}
            />
          </>
        )}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="95aab95b-6de3-45b8-b4d2-2cc704bbd533"
          strategy="beforeInteractive"
          defer
        />
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  )
} 