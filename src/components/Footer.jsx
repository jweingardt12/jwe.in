'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ContainerInner, ContainerOuter } from '@/components/Container'
import { ContactDialog } from './ContactDialog'

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="transition hover:text-teal-500 dark:hover:text-teal-400"
    >
      {children}
    </Link>
  )
}

export function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <footer className="mt-32 flex-none">
      <ContainerOuter>
        <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
          <ContainerInner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                <NavLink href="/about">About</NavLink>
                <NavLink href="/work">Work</NavLink>
                <NavLink href="/notes">Notes</NavLink>
                <NavLink href="/reading">Reading</NavLink>
                <button onClick={() => setIsContactOpen(true)} className="bg-gradient-to-r from-white via-orange-400 via-purple-500 via-blue-500 to-teal-400 bg-[length:500%_100%] animate-gradient bg-clip-text text-transparent dark:from-zinc-100">Contact</button>
              </div>
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                &copy; {new Date().getFullYear()} Jason Weingardt
              </p>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
      <ContactDialog open={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </footer>
  )
}