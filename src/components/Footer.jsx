'use client'

import Link from 'next/link'
import { ContainerInner, ContainerOuter } from './Container'
import { BugAntIcon } from '@heroicons/react/24/outline'

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
                <NavLink href="/work">Work</NavLink>
                <NavLink href="/notes">Notes</NavLink>
                <NavLink href="/reading">Reading</NavLink>
                <NavLink href="/changelog">Changelog</NavLink>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  &copy; {new Date().getFullYear()} Jason Weingardt
                </p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('toggle-feedback'))}
                  className="group flex items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1.5 text-sm text-zinc-600 shadow-sm transition-all duration-200 ease-spring hover:scale-105 hover:bg-white hover:shadow-md dark:bg-zinc-800/90 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  aria-label="Report a bug"
                >
                  <BugAntIcon className="h-4 w-4" />
                  <span>Report</span>
                </button>
              </div>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}
