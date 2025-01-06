'use client'

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogPanel,
  DialogBackdrop,
} from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { FolderIcon } from '@heroicons/react/24/outline'
import { UserCircleIcon, BriefcaseIcon, DocumentTextIcon, BookOpenIcon, BugAntIcon } from '@heroicons/react/24/outline'
import { useState, useEffect, useRef } from 'react'

export default function CommandPalette() {
  const buttonRef = useRef(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const navigationItems = [
    { 
      id: 1, 
      name: 'About', 
      url: '/about', 
      icon: UserCircleIcon,
      description: 'Learn more about me and my background' 
    },
    { 
      id: 2, 
      name: 'Work', 
      url: '/work', 
      icon: BriefcaseIcon,
      description: 'See my professional experience and projects' 
    },
    { 
      id: 3, 
      name: 'Notes', 
      url: '/notes', 
      icon: DocumentTextIcon,
      description: 'Read my thoughts and articles on various topics' 
    },
    { 
      id: 4, 
      name: 'Reading', 
      url: '/reading', 
      icon: BookOpenIcon,
      description: 'Discover what I\'m currently reading and recommendations' 
    },
    {
      id: 5,
      name: 'Contact',
      icon: UserCircleIcon,
      description: 'Get in touch with me directly',
      action: (setOpen) => {
        setOpen(false)
        setTimeout(() => {
          try {
          console.log('Dispatching toggle-contact-drawer event')
          const event = new CustomEvent('toggle-contact-drawer', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: { source: 'command-palette' }
          })
          window.dispatchEvent(event)
          console.log('Event dispatched successfully')
          } catch (error) {
            console.error('Error opening contact drawer:', error)
          }
        }, 100)
      }
    },
    {
      id: 6,
      name: 'Report Bug',
      icon: BugAntIcon,
      description: 'Found an issue? Let me know!',
      action: (setOpen) => {
        setOpen(false)
        setTimeout(() => {
          const event = new Event('toggle-feedback')
          window.dispatchEvent(event)
        }, 100)
      }
    }
  ]

  const filteredItems = navigationItems.filter((item) => {
    return item.name.toLowerCase().includes(query.toLowerCase())
  })

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === '/') {
        setOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <Dialog
        className="relative z-50"
        open={open}
        onClose={() => {
          setOpen(false)
          setQuery('')
        }}
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/25 dark:bg-black/50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
          <DialogPanel
            transition
            className="mx-auto max-w-2xl transform divide-y divide-gray-500/10 dark:divide-zinc-800 overflow-hidden rounded-xl bg-white/80 dark:bg-zinc-900/80 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 backdrop-blur backdrop-filter transition-all data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <Combobox
              onChange={(item) => {
                if (item) {
                  if (item.action) {
                    item.action(setOpen)
                  } else {
                    window.location = item.url
                  }
                }
              }}
            >
              <div className="grid grid-cols-1">
                <ComboboxInput
                  autoFocus
                  className="col-start-1 row-start-1 h-12 w-full bg-transparent pl-11 pr-4 text-base text-gray-900 dark:text-zinc-100 outline-none placeholder:text-gray-500 dark:placeholder:text-zinc-400 sm:text-sm"
                  placeholder="Search..."
                  onChange={(event) => setQuery(event.target.value)}
                  onBlur={() => setQuery('')}
                />
                <MagnifyingGlassIcon
                  className="pointer-events-none col-start-1 row-start-1 ml-4 size-5 self-center text-gray-900/40 dark:text-zinc-500"
                  aria-hidden="true"
                />
              </div>

              <ComboboxOptions
                static
                as="ul"
                className="max-h-80 scroll-py-2 divide-y divide-gray-500/10 dark:divide-zinc-800 overflow-y-auto"
              >
                <li className="p-2">
                  <ul className="text-sm text-gray-700 dark:text-zinc-200">
                    {filteredItems.map((item) => (
                      <ComboboxOption
                        as="li"
                        key={item.id}
                        value={item}
                        className="group flex cursor-default select-none items-center rounded-md px-3 py-2 data-[focus]:bg-gray-900/5 dark:data-[focus]:bg-zinc-800 data-[focus]:text-gray-900 dark:data-[focus]:text-zinc-100 data-[focus]:outline-none"
                      >
                        <item.icon
                          className="size-6 flex-none text-gray-900/40 dark:text-zinc-500 group-data-[focus]:text-gray-900 dark:group-data-[focus]:text-zinc-100"
                          aria-hidden="true"
                        />
                        <div className="ml-3 flex flex-col">
                          <span className="truncate">{item.name}</span>
                          <span className="text-xs text-gray-500 dark:text-zinc-400">{item.description}</span>
                        </div>
                        {item.url && (
                          <span className="ml-3 hidden flex-none text-gray-500 dark:text-zinc-400 group-data-[focus]:inline">
                            Jump to...
                          </span>
                        )}
                      </ComboboxOption>
                    ))}
                  </ul>
                </li>
              </ComboboxOptions>

              {query !== '' && filteredItems.length === 0 && (
                <div className="px-6 py-14 text-center sm:px-14">
                  <FolderIcon className="mx-auto size-6 text-gray-900/40 dark:text-zinc-500" aria-hidden="true" />
                  <p className="mt-4 text-sm text-gray-900 dark:text-zinc-100">
                    No results found.
                  </p>
                </div>
              )}
            </Combobox>
          </DialogPanel>
        </div>
      </Dialog>

    </>
  )
}
