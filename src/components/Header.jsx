'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { Popover, Transition } from '@headlessui/react'
import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import { MagnifyingGlassIcon, SunIcon, MoonIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useOpenPanel } from '@openpanel/nextjs'

import { Container } from './Container'
import { ContactDrawer } from './ContactDrawer'
import CommandPalette from './CommandPalette'
import avatarImage from '../images/avatar.jpg'
import { Button } from '@/components/ui/button'

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MobileNavItem({ href, children }) {
  return (
    <li>
      <Popover.Button as={Link} href={href} className="block w-full py-3 text-lg font-semibold text-zinc-800 hover:text-sky-500 dark:text-zinc-200 dark:hover:text-sky-400">
        {children}
      </Popover.Button>
    </li>
  )
}

function NavItem({ href, children }) {
  let pathname = usePathname()
  let isActive = href === '/work' 
    ? pathname.startsWith('/work')
    : pathname === href

  return (
    <li>
      <Link
        href={href}
        className={clsx(
          'relative block px-3 py-2 transition',
          isActive
            ? 'text-sky-500 dark:text-sky-400'
            : 'hover:text-sky-500 dark:hover:text-sky-400'
        )}
      >
        {children}
        {isActive && (
          <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-sky-500/0 via-sky-500/40 to-sky-500/0 dark:from-sky-400/0 dark:via-sky-400/40 dark:to-sky-400/0" />
        )}
      </Link>
    </li>
  )
}

function DesktopNavigation(props) {
  return (
    <nav {...props}>
      <ul className="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
        <NavItem href="/about">About</NavItem>
        <NavItem href="/work">Work</NavItem>
        <NavItem href="/notes">Notes</NavItem>
        <NavItem href="/reading">Reading</NavItem>
      </ul>
    </nav>
  )
}

function clamp(number, a, b) {
  let min = Math.min(a, b)
  let max = Math.max(a, b)
  return Math.min(Math.max(number, min), max)
}

function AvatarContainer({ className, ...props }) {
  return (
    <div
      className={clsx(
        className,
        'h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:ring-white/10 transition duration-300 hover:scale-110 active:scale-95 active:shadow-md active:ring-2 active:ring-sky-500/50 dark:active:ring-sky-400/50'
      )}
      {...props}
    />
  )
}

function Avatar({ large = false, className, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <Link
      href="/"
      aria-label="Home"
      className={clsx(className, 'pointer-events-auto')}
      {...props}
    >
      <Image
        src={avatarImage}
        alt=""
        sizes={large ? '4rem' : '2.25rem'}
        className={clsx(
          'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800 shadow-lg transition-opacity duration-500',
          large ? 'h-16 w-16' : 'h-9 w-9',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        priority
        onLoad={() => setIsLoaded(true)}
      />
    </Link>
  )
}

function SearchButton({ setIsOpen, setSource }) {
  return (
    <button
      type="button"
      aria-label="Search"
      className="group flex items-center justify-center md:px-1 md:h-auto md:w-auto h-12 w-12"
      onClick={() => {
        setSource('search_icon')
        setIsOpen(true)
      }}
    >
      <MagnifyingGlassIcon className="h-5 w-5 md:h-4 md:w-4 stroke-current text-zinc-500 transition group-hover:text-sky-500 dark:text-zinc-400 dark:group-hover:text-sky-400" />
    </button>
  )
}

function ThemeToggle() {
  let { resolvedTheme, setTheme } = useTheme()
  let [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button type="button" className="group flex items-center justify-center md:px-1 md:h-auto md:w-auto h-12 w-12">
        <span className="flex items-center justify-center">
          <SunIcon className="h-5 w-5 md:h-4 md:w-4 stroke-current text-zinc-500 transition" />
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="group flex items-center justify-center md:px-2 md:h-auto md:w-auto h-12 w-12"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <span className="flex items-center justify-center">
        <SunIcon className="h-5 w-5 md:h-4 md:w-4 stroke-current text-zinc-500 transition group-hover:text-sky-500 dark:hidden" />
        <MoonIcon className="hidden h-5 w-5 md:h-4 md:w-4 stroke-current text-zinc-500 transition group-hover:text-sky-500 dark:block dark:text-zinc-400 dark:group-hover:text-sky-400" />
      </span>
    </button>
  )
}

export function Header() {
  let isHomePage = usePathname() === '/'
  let headerRef = useRef(null)
  let avatarRef = useRef(null)
  let isInitial = useRef(true)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [commandPaletteSource, setCommandPaletteSource] = useState(null)

  useEffect(() => {
    let downDelay = avatarRef.current?.offsetTop ?? 0
    let upDelay = 64

    function setProperty(property, value) {
      document.documentElement.style.setProperty(property, value)
    }

    function removeProperty(property) {
      document.documentElement.style.removeProperty(property)
    }

    function updateHeaderStyles() {
      let { top, height } = headerRef.current.getBoundingClientRect()
      let scrollY = clamp(
        window.scrollY,
        0,
        document.body.scrollHeight - window.innerHeight
      )

      if (isInitial.current) {
        setProperty('--header-position', 'sticky')
      }

      setProperty('--content-offset', `${downDelay}px`)

      if (isInitial.current || scrollY < downDelay) {
        setProperty('--header-height', `${downDelay + height}px`)
        setProperty('--header-mb', `${-downDelay}px`)
      } else if (top + height < -upDelay) {
        let offset = Math.max(height, scrollY - upDelay)
        setProperty('--header-height', `${offset}px`)
        setProperty('--header-mb', `${height - offset}px`)
      } else if (top === 0) {
        setProperty('--header-height', `${scrollY + height}px`)
        setProperty('--header-mb', `${-scrollY}px`)
      }

      if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
        setProperty('--header-inner-position', 'fixed')
        removeProperty('--header-top')
        removeProperty('--avatar-top')
      } else {
        removeProperty('--header-inner-position')
        setProperty('--header-top', '0px')
        setProperty('--avatar-top', '0px')
      }
    }

    function updateAvatarStyles() {
      if (!isHomePage) {
        return
      }

      let fromScale = 1
      let toScale = 36 / 64
      let fromX = 0
      let toX = 2 / 16

      let scrollY = downDelay - window.scrollY

      let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale
      scale = clamp(scale, fromScale, toScale)

      let x = (scrollY * (fromX - toX)) / downDelay + toX
      x = clamp(x, fromX, toX)

      setProperty(
        '--avatar-image-transform',
        `translate3d(${x}rem, 0, 0) scale(${scale})`
      )

      let borderScale = 1 / (toScale / scale)
      let borderX = (-toX + x) * borderScale
      let borderTransform = `translate3d(${borderX}rem, 0, 0) scale(${borderScale})`

      setProperty('--avatar-border-transform', borderTransform)
      setProperty('--avatar-border-opacity', scale === toScale ? '1' : '0')
    }

    function updateStyles() {
      updateHeaderStyles()
      updateAvatarStyles()
      isInitial.current = false
    }

    updateStyles()
    window.addEventListener('scroll', updateStyles, { passive: true })
    window.addEventListener('resize', updateStyles)

    return () => {
      window.removeEventListener('scroll', updateStyles)
      window.removeEventListener('resize', updateStyles)
    }
  }, [isHomePage])

  return (
    <>
      <header
        className="pointer-events-none relative z-50 flex flex-none flex-col"
        style={{
          height: 'var(--header-height)',
          marginBottom: 'var(--header-mb)',
        }}
      >
        {isHomePage && (
          <>
            <div
              ref={avatarRef}
              className="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]"
            />
            <Container
              className="top-0 order-last -mb-3 pt-3"
              style={{ position: 'var(--header-position)' }}
            >
              <div
                className="top-[var(--avatar-top,theme(spacing.3))] w-full"
                style={{ position: 'var(--header-inner-position)' }}
              >
                <div className="relative">
                  <AvatarContainer
                    className="absolute left-0 top-3 origin-left transition-opacity"
                    style={{
                      opacity: 'var(--avatar-border-opacity, 0)',
                      transform: 'var(--avatar-border-transform)',
                    }}
                  />
                  <Avatar
                    large
                    className="block h-16 w-16 origin-left"
                    style={{ transform: 'var(--avatar-image-transform)' }}
                  />
                </div>
              </div>
            </Container>
          </>
        )}
        <div
          ref={headerRef}
          className="top-0 z-10 h-16 pt-6"
          style={{ position: 'var(--header-position)' }}
        >
          <Container
            className="top-[var(--header-top,theme(spacing.6))] w-full"
            style={{ position: 'var(--header-inner-position)' }}
          >
            <div className="relative flex gap-4">
              <div className="flex flex-1">
                {!isHomePage && (
                  <AvatarContainer>
                    <Avatar />
                  </AvatarContainer>
                )}
              </div>
              <div className="flex flex-1 justify-end md:justify-center">
                <div className="pointer-events-auto md:hidden">
                  <Popover>
                    <div className="flex rounded-full bg-white/90 px-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
                      <div className="flex items-center border-r border-zinc-900/5 pr-2 dark:border-white/10">
                        <SearchButton 
                          setIsOpen={setIsCommandPaletteOpen} 
                          setSource={setCommandPaletteSource}
                        />
                        <div className="border-l border-zinc-900/5 dark:border-white/10">
                          <ThemeToggle />
                        </div>
                      </div>
                      <Popover.Button className="group px-4 py-3 min-w-[4rem]">
                        Menu
                      </Popover.Button>
                    </div>
                    <Transition.Root>
                      <Transition.Child
                        as={Fragment}
                        enter="duration-150 ease-out"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="duration-150 ease-in"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Popover.Overlay className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-sm dark:bg-black/80" />
                      </Transition.Child>
                      <Transition.Child
                        as={Fragment}
                        enter="duration-150 ease-out"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="duration-150 ease-in"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Popover.Panel
                          focus
                          className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800"
                        >
                          <div className="flex flex-row-reverse items-center justify-between">
                            <Popover.Button aria-label="Close menu" className="-m-1 p-1">
                              <CloseIcon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                            </Popover.Button>
                          </div>
                          <nav className="mt-6">
                            <ul className="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
                              <MobileNavItem href="/">Home</MobileNavItem>
                              <MobileNavItem href="/about">About</MobileNavItem>
                              <MobileNavItem href="/work">Work</MobileNavItem>
                              <MobileNavItem href="/notes">Notes</MobileNavItem>
                              <MobileNavItem href="/reading">Reading</MobileNavItem>
                              <li className="pt-2">
                                <ContactDrawer>
                                  <Button className="w-full">
                                    Contact
                                  </Button>
                                </ContactDrawer>
                              </li>
                            </ul>
                          </nav>
                        </Popover.Panel>
                      </Transition.Child>
                    </Transition.Root>
                  </Popover>
                </div>
                <DesktopNavigation className="pointer-events-auto hidden md:block" />
              </div>
              <div className="hidden md:flex md:justify-end md:flex-1">
                <div className="pointer-events-auto flex h-9 rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
                  <div className="flex items-center border-r border-zinc-900/5 pr-3 dark:border-white/10">
                    <SearchButton 
                      setIsOpen={setIsCommandPaletteOpen}
                      setSource={setCommandPaletteSource}
                    />
                    <div className="ml-2 border-l border-zinc-900/5 pl-2 dark:border-white/10">
                      <ThemeToggle />
                    </div>
                  </div>
                  <div className="flex items-center pl-3">
                    <ContactDrawer>
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-sky-500 dark:hover:text-sky-400 transition px-3 py-2">Contact</span>
                    </ContactDrawer>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </header>
      {isHomePage && (
        <div className="flex-none" style={{ height: 'var(--content-offset)' }} />
      )}
      <CommandPalette 
        open={isCommandPaletteOpen} 
        onOpenChange={(open) => {
          setIsCommandPaletteOpen(open)
          if (!open) {
            setCommandPaletteSource(null)
          }
        }}
        source={commandPaletteSource}
      />
    </>
  )
}
