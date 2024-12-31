"use client";

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { usePathname } from 'next/navigation'

export function Layout({ children }) {
  const pathname = usePathname()

  return (
    <>
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>
      <div className="relative flex w-full flex-col min-h-screen">
        <Header />
        <main className="flex-auto">
          <div key={pathname} className="animate-fadeUp">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
