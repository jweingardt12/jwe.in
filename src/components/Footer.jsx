'use client'
import { Fragment, useState } from 'react'
import Link from 'next/link'
import { Popover, Transition } from '@headlessui/react'
import { ContainerInner, ContainerOuter } from '@/components/Container'
import { ContactDialog } from './ContactDialog'

function NavLink({ href, children }) {
  if (href === '/work') {
    return (
      <Popover className="relative inline-block">
        {({ open }) => (
          <>
            <Popover.Button className="transition cursor-not-allowed text-zinc-800 dark:text-zinc-200 hover:text-sky-500 dark:hover:text-sky-400">
              {children}
            </Popover.Button>
            <Transition
              show={open}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute bottom-full left-1/2 z-10 mb-3 w-screen max-w-max -translate-x-1/2 transform px-4">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="bg-white dark:bg-zinc-800 p-4">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      🚧 Under construction 🚧
                    </p>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    )
  }

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
                <button 
                  onClick={() => setIsContactOpen(true)}
                  className="transition hover:text-sky-500 dark:hover:text-sky-400"
                >
                  Contact
                </button>
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