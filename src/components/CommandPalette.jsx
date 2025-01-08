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
import { FolderIcon, UserCircleIcon, BuildingOffice2Icon, ChatBubbleBottomCenterIcon, RssIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { useState, useEffect, useRef } from 'react'
import { useOpenPanel } from '@openpanel/nextjs'

export default function CommandPalette({ open = false, onOpenChange, source = null }) {
  const buttonRef = useRef(null)
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const { track } = useOpenPanel()
  const lastOpenState = useRef(open)

  // Track when the palette is opened
  useEffect(() => {
    if (open && !lastOpenState.current) {
      // Only track keyboard shortcut if no source is provided
      if (!source) {
        track('command_palette_open', {
          source: 'keyboard_shortcut'
        })
      } else {
        track('command_palette_open', {
          source
        })
      }
    }
    lastOpenState.current = open
  }, [open, source, track])

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      // Try focusing multiple times to ensure it works on iOS
      const focusAttempts = [10, 50, 100, 200]
      focusAttempts.forEach(delay => {
        setTimeout(() => {
          const input = inputRef.current
          if (input) {
            input.focus({ preventScroll: true })
            try {
              input.select()
            } catch (e) {
              // Ignore any selection errors
            }
          }
        }, delay)
      })
    }
  }, [open])

  // Reset state when dialog is closed
  useEffect(() => {
    if (!open) {
      setQuery('')
      setIsNavigating(false)
    }
  }, [open])

  useEffect(() => {
    if (typeof onOpenChange !== 'function') return

    const handleKeyDown = (event) => {
      // Only handle '/' key if no input elements are focused
      if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        event.preventDefault()
        event.stopPropagation()
        onOpenChange(true)
      }
    }

    // Use capture phase to ensure we get the event first
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [onOpenChange])

  const navigationItems = [
    { 
      id: 1, 
      name: 'About', 
      url: '/about', 
      icon: UserCircleIcon,
      description: 'Who I am, what I\'m interested in, and what I do.' 
    },
    { 
      id: 2, 
      name: 'Work (Under Construction)', 
      icon: BuildingOffice2Icon,
      description: 'What I\'ve done. Where I\'ve done it. Why it mattered.',
      disabled: true
    },
    { 
      id: 3, 
      name: 'Notes', 
      url: '/notes', 
      icon: ChatBubbleBottomCenterIcon,
      description: 'Quick thoughts on what I\'m learning, reading, and working on.' 
    },
    { 
      id: 4, 
      name: 'Reading', 
      url: '/reading', 
      icon: RssIcon,
      description: 'Follow along with a live-updating feed of what I\'m reading.' 
    },
    {
      id: 5,
      name: 'Contact',
      icon: UserCircleIcon,
      description: 'Have an idea? Let\'s chat.',
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
    }
  ]

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setSearchResults(data.results)
      } catch (error) {
        console.error('Error fetching search results:', error)
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimeout = setTimeout(fetchSearchResults, 200)
    return () => clearTimeout(debounceTimeout)
  }, [query])

  const allItems = query === ''
    ? navigationItems
    : [
        ...navigationItems.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase())
        ),
        ...searchResults
          .filter(result => {
            // Don't include search results that match navigation items
            const resultPath = result.url?.toLowerCase() || ''
            const resultTitle = (result.title || '').toLowerCase()
            const queryLower = query.toLowerCase()
            
            // If searching for "work", filter out any result with "work" in the title
            if (queryLower === 'work' && resultTitle.includes('work')) {
              return false
            }
            
            return !navigationItems.some(navItem => {
              const navPath = navItem.url?.toLowerCase() || ''
              const navName = navItem.name.toLowerCase()
              const navTitle = navItem.title?.toLowerCase() || navName
              
              // Check if paths match (excluding trailing slashes)
              const pathMatch = navPath && resultPath && 
                navPath.replace(/\/$/, '') === resultPath.replace(/\/$/, '')
              
              // Check if titles or names match
              const titleMatch = navName === resultTitle || navTitle === resultTitle
              
              return pathMatch || titleMatch
            })
          })
          .map(result => {
            const contentLines = result.content?.split('\n') || []
            const firstContentLine = contentLines.find(line => 
              line.trim() && 
              !line.includes('---')
            )?.trim().replace(/^#+\s*/, '') || ''

            // Map the icon string to the actual icon component
            const iconMap = {
              CalendarIcon,
              ChatBubbleBottomCenterIcon
            }

            return {
              ...result,
              firstLine: firstContentLine,
              icon: result.icon ? iconMap[result.icon] : ChatBubbleBottomCenterIcon,
            }
          })
      ]

  const handleSelect = (item) => {
    if (item && !item.disabled) {
      setIsNavigating(true)
      if (item.action) {
        item.action(onOpenChange)
      } else {
        setTimeout(() => {
          window.location = item.url
        }, 150)
      }
    }
  }

  return (
    <Dialog
      className="relative z-[300]"
      open={open}
      onClose={() => {
        if (!isNavigating) {
          onOpenChange(false)
          setQuery('')
        }
      }}
      initialFocus={inputRef}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/25 dark:bg-black/50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen flex items-start justify-center p-4 sm:p-6 md:p-20 sm:items-center">
        <DialogPanel
          transition
          className={`w-[640px] transform divide-y divide-gray-500/10 dark:divide-zinc-800 overflow-hidden rounded-xl bg-white/80 dark:bg-zinc-900/80 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 backdrop-blur backdrop-filter transition-all mt-16 sm:mt-0 ${
            isNavigating 
              ? 'opacity-0 scale-95 duration-150 ease-in'
              : 'data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in'
          }`}
        >
          <Combobox onChange={handleSelect}>
            <div className="grid grid-cols-1">
              <ComboboxInput
                ref={inputRef}
                className="col-start-1 row-start-1 h-12 w-full bg-transparent pl-11 pr-4 text-base text-gray-900 dark:text-zinc-100 outline-none placeholder:text-gray-500 dark:placeholder:text-zinc-400 antialiased font-medium"
                placeholder="Search..."
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                autoCapitalize="off"
                onFocus={(e) => e.target.select()}
              />
              <MagnifyingGlassIcon
                className="pointer-events-none col-start-1 row-start-1 ml-4 size-5 self-center text-gray-900/40 dark:text-zinc-500"
                aria-hidden="true"
              />
            </div>

            <ComboboxOptions
              static
              as="ul"
              className="max-h-80 scroll-py-2 divide-y divide-gray-500/10 dark:divide-zinc-800 overflow-y-auto antialiased"
            >
              <li className="p-2">
                <ul className="text-sm text-gray-700 dark:text-zinc-200">
                  {isLoading ? (
                    <li className="px-3 py-2 text-gray-500 dark:text-zinc-400">
                      Searching...
                    </li>
                  ) : (
                    allItems.map((item, index) => (
                      <ComboboxOption
                        as="li"
                        key={item.id || `search-${index}`}
                        value={item}
                        className={`group flex select-none items-center rounded-md px-3 py-2 ${
                          item.disabled 
                            ? 'cursor-not-allowed opacity-50' 
                            : 'cursor-default data-[focus]:bg-gray-900/5 dark:data-[focus]:bg-zinc-800 data-[focus]:text-gray-900 dark:data-[focus]:text-zinc-100'
                        } data-[focus]:outline-none`}
                      >
                        <item.icon
                          className="size-6 flex-none text-gray-900/40 dark:text-zinc-500 group-data-[focus]:text-gray-900 dark:group-data-[focus]:text-zinc-100"
                          aria-hidden="true"
                        />
                        <div className="ml-3 flex flex-col flex-grow min-w-0">
                          <div className="flex items-center gap-1.5">
                            {item.parent && (
                              <>
                                <span className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                                  {item.parent.name}
                                </span>
                                <span className="text-xs text-gray-400 dark:text-zinc-500">/</span>
                              </>
                            )}
                            <span className="truncate font-medium">{item.title || item.name}</span>
                          </div>
                          {item.type === 'note' ? (
                            <>
                              {item.firstLine && (
                                <span className="text-xs text-gray-600 dark:text-zinc-300 truncate mt-0.5">
                                  {item.firstLine}
                                </span>
                              )}
                              <span className="text-xs text-gray-500 dark:text-zinc-400 truncate mt-0.5">
                                {item.description}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </ComboboxOption>
                    ))
                  )}
                </ul>
              </li>
            </ComboboxOptions>

            {query !== '' && !isLoading && allItems.length === 0 && (
              <div className="px-6 py-14 text-center sm:px-14">
                <FolderIcon className="mx-auto size-6 text-gray-900/40 dark:text-zinc-500" aria-hidden="true" />
                <p className="mt-4 text-sm text-gray-900 dark:text-zinc-100 font-medium">
                  No results found.
                </p>
              </div>
            )}
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
