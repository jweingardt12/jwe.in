import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import { Toaster } from "@/components/ui/toaster"
import Script from 'next/script'

import '@/styles/tailwind.css'

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
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="9c975017-43cd-4414-86d6-2bc26e55ecbd"
          strategy="afterInteractive"
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