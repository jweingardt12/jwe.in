"use client";

import { Footer } from './Footer'
import { Header } from './Header'
import { ContactDrawer } from './ContactDrawer'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export function Layout({ children }) {
  const pathname = usePathname()

  return (
    <>
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>
      <div className="relative flex w-full flex-col min-h-screen" data-vaul-drawer-wrapper>
        <Header />
        <main className="flex-auto flex justify-center">
          <motion.div
            className="w-full"
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
        <Footer />
      </div>
      {/* Single ContactDrawer instance for the entire app */}
      <ContactDrawer>
        <div className="hidden" />
      </ContactDrawer>
    </>
  )
}
