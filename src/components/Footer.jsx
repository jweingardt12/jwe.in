'use client'

import Link from 'next/link'
import { ContainerInner, ContainerOuter } from './Container'

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="transition hover:text-sky-500 dark:hover:text-sky-400"
    >
      {children}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="mt-32 flex-none">
      <ContainerOuter>
        <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
          <ContainerInner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                <NavLink href="/about">About</NavLink>
                <span className="group relative cursor-not-allowed text-zinc-400 dark:text-zinc-500">
                  Work
                  <span className="absolute left-1/2 -translate-x-1/2 -top-4 text-[10px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Under Construction</span>
                </span>
                <NavLink href="/notes">Notes</NavLink>
                <NavLink href="/reading">Reading</NavLink>
              </div>
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                &copy; {new Date().getFullYear()} Jason Weingardt
              </p>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}
