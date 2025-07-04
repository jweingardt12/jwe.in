'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Popover, Transition } from '@headlessui/react'
import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import { useTheme } from 'next-themes'
import { usePlausible } from '@/lib/analytics'

import { Container } from './Container'
const avatarImage = '/images/photos/avatar.jpg'
import { Button } from '@/components/ui/button'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { LiquidGlass } from '@/components/ui/liquid-glass'
import { CloseIcon, HamburgerIcon } from '@/components/Icons'
import { HomeIcon, UserIcon, BriefcaseIcon, DocumentTextIcon, BookOpenIcon } from '@/components/Icons'
import { useRecentArticles } from '@/hooks/useRecentArticles'

function MobileNavItem({ href, children, badge = null }) {
  let pathname = usePathname()
  let isActive = href === '/work' 
    ? pathname.startsWith('/work')
    : pathname === href
    
  let icon
  switch (href) {
    case '/':
      icon = <HomeIcon className="h-5 w-5 mr-2" />
      break
    case '/about':
      icon = <UserIcon className="h-5 w-5 mr-2" />
      break
    case '/work':
      icon = <BriefcaseIcon className="h-5 w-5 mr-2" />
      break
    case '/notes':
      icon = <DocumentTextIcon className="h-5 w-5 mr-2" />
      break
    case '/reading':
      icon = <BookOpenIcon className="h-5 w-5 mr-2" />
      break
    default:
      icon = null
  }

  return (
    <li className="py-1">
      <Popover.Button as={Link} href={href} className={clsx(
        "block w-full px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium",
        isActive
          ? "bg-sky-500/20 text-sky-400 dark:bg-sky-400/20 dark:text-sky-300"
          : "text-zinc-200 hover:bg-zinc-800/60 dark:text-zinc-200 dark:hover:bg-zinc-800/60"
      )}>
        <div className="flex items-center relative">
          {icon}
          <span className="relative inline-block">
            {children}
            {badge && (
              <span 
                className="absolute -top-3 -right-3 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[1.25rem] min-h-[1.25rem]"
                style={{ opacity: '0', animation: 'fadeIn 0.3s forwards ease-out' }}
              >
                {badge}
              </span>
            )}
          </span>
        </div>
      </Popover.Button>
    </li>
  )
}

function NavItem({ href, children, badge = null }) {
  let pathname = usePathname()
  let isActive = href === '/work' 
    ? pathname.startsWith('/work')
    : pathname === href

  return (
    <li>
      <Link
        href={href}
        className={clsx(
          'relative block px-6 py-2 transition-colors font-medium',
          isActive
            ? 'text-sky-600 dark:text-sky-400'
            : 'text-zinc-900 dark:text-zinc-100 hover:text-sky-600 dark:hover:text-sky-400'
        )}
      >
        <span className="relative inline-block">
          {children}
          {badge && (
            <span 
              className="absolute -top-3 -right-3 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[1.25rem] min-h-[1.25rem]"
              style={{ opacity: '0', animation: 'fadeIn 0.3s forwards ease-out' }}
            >
              {badge}
            </span>
          )}
        </span>
      </Link>
    </li>
  )
}

function FloatingNavigation(props) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const [fadeIn, setFadeIn] = useState(false)
  const { recentCount, isLoading, error } = useRecentArticles()
  
  useEffect(() => {
    // Add fade-in animation with 2s delay when on home page
    if (isHomePage) {
      const timer = setTimeout(() => {
        setFadeIn(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    } else {
      setFadeIn(true) // No delay on other pages
    }
  }, [isHomePage])
  
  return (
    <nav 
      {...props} 
      className={clsx(
        "fixed top-4 left-0 right-0 mx-auto z-50 w-fit pointer-events-auto hidden md:block",
        isHomePage && "transition-all duration-1000 ease-in-out",
        isHomePage && (fadeIn ? "opacity-100" : "opacity-0")
      )}
    >
      <LiquidGlass
        displacementScale={0}
        blurAmount={0.35}
        saturation={200}
        aberrationIntensity={2}
        elasticity={0}
        cornerRadius={12}
        className="shadow-lg shadow-zinc-800/10"
        disableScrollEffect={true}
      >
        <ul className="flex items-center px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
          <li className="flex items-center pr-3 border-r border-zinc-200 dark:border-zinc-700 mr-2">
            <Avatar />
          </li>
          <NavItem href="/about">About</NavItem>
          <NavItem href="/work">Work</NavItem>
          <NavItem href="/notes">Notes</NavItem>
          <NavItem href="/reading" badge={recentCount > 0 ? recentCount : null}>Reading</NavItem>
          <li className="flex items-center pl-3">
            <Button 
              className="bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm px-3 py-1 h-auto dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 relative overflow-hidden group"
              onMouseEnter={() => {}}
              onMouseMove={() => {}}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const event = new Event('toggle-contact-drawer');
                window.dispatchEvent(event);
              }}
            >
              <GlowingEffect
                spread={0}
                glow={false}
                disabled={true}
                proximity={0}
                inactiveZone={1}
              />
              <span className="relative z-10">Contact</span>
            </Button>
          </li>
        </ul>
      </LiquidGlass>
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
        'h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:ring-white/10 transition duration-300 active:shadow-md active:ring-2 active:ring-sky-500/50 dark:active:ring-sky-400/50'
      )}
      {...props}
    />
  )
}

function Avatar({ large = false, className, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const [fadeIn, setFadeIn] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    // Add fade-in animation with 2s delay when on home page
    if (isHomePage) {
      const timer = setTimeout(() => {
        setFadeIn(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    } else {
      setFadeIn(true) // No delay on other pages
    }
  }, [isHomePage])

  // Handle click for the avatar image - always navigate home
  const handleAvatarClick = (e) => {
    e.preventDefault()
    router.push('/')
  }

  return (
    <div 
      className={clsx(
        className, 
        'pointer-events-auto relative',
        isHomePage && "transition-all duration-1000 ease-in-out",
        isHomePage && (fadeIn ? "opacity-100" : "opacity-0")
      )}
      {...props}
    >
      <Link
        href="/"
        aria-label="Home"
        className="block"
        onClick={handleAvatarClick}
      >
        <Image
          src={avatarImage}
          alt=""
          width={large ? 64 : 36}
          height={large ? 64 : 36}
          sizes={large ? '4rem' : '2.25rem'}
          className={clsx(
            'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800 shadow-md transition-all duration-300',
            large ? 'h-16 w-16' : 'h-8 w-8 md:h-9 md:w-9',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          priority
          onLoad={() => setIsLoaded(true)}
        />
      </Link>
    </div>
  )
}

export function Header() {
  const { recentCount } = useRecentArticles()
  const pathname = usePathname()

  let isHomePage = usePathname() === '/'
  let headerRef = useRef(null)
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    // Add fade-in animation with 2s delay when on home page
    if (isHomePage) {
      const timer = setTimeout(() => {
        setFadeIn(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    } else {
      setFadeIn(true) // No delay on other pages
    }
  }, [isHomePage])


  return (
    <>
      <header
        className={clsx(
          "pointer-events-none relative z-50 flex flex-none flex-col",
          isHomePage && "transition-opacity duration-1000 ease-in-out",
          isHomePage && (fadeIn ? "opacity-100" : "opacity-0")
        )}
        style={{
          height: '64px',
          marginBottom: '0px',
          transition: isHomePage ? 'opacity 1s ease-in-out' : undefined,
        }}
      >
        {isHomePage && (
          <>
            {/* We can remove this entire section since we no longer need it */}
          </>
        )}
        <div
          ref={headerRef}
          className="top-0 z-10 h-16 pt-6"
          style={{ 
            position: 'relative',
          }}
        >
          <Container
            className="w-full"
          >
            <div className="relative flex gap-4">
              <div className="flex flex-1">
                {/* Avatar is now in the floating navigation */}
              </div>
              <div className="flex flex-1 justify-end md:justify-center">
                <div className={clsx(
                  "pointer-events-auto hidden", // Hide the old mobile nav
                  isHomePage && "transition-all duration-1000 ease-in-out",
                  isHomePage && (fadeIn ? "opacity-100" : "opacity-0")
                )}>
                  <Popover>
                    <LiquidGlass
                      displacementScale={0}
                      blurAmount={0.25}
                      saturation={180}
                      aberrationIntensity={1.5}
                      elasticity={0}
                      cornerRadius={12}
                      className="shadow-lg shadow-zinc-800/10"
                      disableScrollEffect={true}
                    >
                      <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        <Avatar className="mr-1.5" />
                        <Popover.Button className="group flex items-center p-0.5 transition-all duration-200 hover:text-sky-500 dark:hover:text-sky-400">
                          <HamburgerIcon className="h-5 w-5" />
                        </Popover.Button>
                      </div>
                    </LiquidGlass>
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
                        <Popover.Overlay className="fixed inset-0 z-50 bg-zinc-900/80 backdrop-blur-sm dark:bg-black/90" />
                      </Transition.Child>
                      <Transition.Child
                        as={Fragment}
                        enter="duration-150 ease-out"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="duration-150 ease-in"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Popover.Panel
                          focus
                          className="fixed inset-x-4 top-0 z-50 origin-top min-h-screen"
                        >
                          <div className="min-h-screen bg-zinc-950/95 dark:bg-black/95 backdrop-blur-md relative">
                            {/* Sticky header with profile and contact */}
                            <div className="sticky top-0 z-10 bg-zinc-950/98 dark:bg-black/98 backdrop-blur-lg border-b border-zinc-800/50 dark:border-zinc-700/50">
                              <div className="flex items-center justify-between p-4">
                                <Avatar className="flex-shrink-0" />
                                <div className="flex items-center space-x-3">
                                  <Popover.Button aria-label="Close menu" className="rounded-full p-2 hover:bg-zinc-800/50 dark:hover:bg-zinc-800/50">
                                    <CloseIcon className="h-5 w-5 text-zinc-400 dark:text-zinc-400" />
                                  </Popover.Button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Menu content */}
                            <nav className="p-6">
                              <ul className="space-y-2">
                                <MobileNavItem href="/">Home</MobileNavItem>
                                <MobileNavItem href="/about">About</MobileNavItem>
                                <MobileNavItem href="/work">Work</MobileNavItem>
                                <MobileNavItem href="/notes">Notes</MobileNavItem>
                                <MobileNavItem href="/reading" badge={recentCount > 0 ? recentCount : null}>Reading</MobileNavItem>
                              </ul>
                            </nav>
                          </div>
                        </Popover.Panel>
                      </Transition.Child>
                    </Transition.Root>
                  </Popover>
                </div>
                <FloatingNavigation />
              </div>
              <div className="flex justify-end md:flex-1">
                {/* Empty div to maintain layout */}
              </div>
            </div>
          </Container>
        </div>
      </header>
      
      {/* Mobile Top Bar */}
      <div className={clsx(
        "md:hidden relative mx-auto mt-1 w-[95vw] max-w-lg",
        isHomePage && "transition-all duration-1000 ease-in-out",
        isHomePage && (fadeIn ? "opacity-100" : "opacity-0")
      )}>
        <LiquidGlass
          displacementScale={0}
          blurAmount={0.35}
          saturation={200}
          aberrationIntensity={2}
          elasticity={0}
          cornerRadius={16}
          className="shadow-lg border border-zinc-200 dark:border-zinc-700"
          disableScrollEffect={true}
        >
          <div className="px-3 h-10 flex items-center justify-between gap-x-3 bg-zinc-50/90 dark:bg-zinc-900/90">
            <Avatar large={false} className="flex-shrink-0 scale-90" />
            <Button
              className="bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm px-2.5 py-1 h-auto dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 relative overflow-hidden group rounded-md font-medium text-xs"
              onMouseEnter={() => {}}
              onMouseMove={() => {}}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const event = new Event('toggle-contact-drawer');
                window.dispatchEvent(event);
              }}
            >
              <GlowingEffect
                spread={0}
                glow={false}
                disabled={true}
                proximity={0}
                inactiveZone={1}
              />
              <span className="relative z-10">Contact</span>
            </Button>
          </div>
        </LiquidGlass>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className={clsx(
        "md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-auto",
        isHomePage && "transition-all duration-1000 ease-in-out",
        isHomePage && (fadeIn ? "opacity-100" : "opacity-0")
      )}>
        <LiquidGlass
          displacementScale={0}
          blurAmount={0.15}
          saturation={150}
          aberrationIntensity={1}
          elasticity={0}
          cornerRadius={0}
          className="shadow-lg shadow-zinc-800/20"
          disableScrollEffect={true}
        >
          <div className="px-3 py-2 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-md">
            <nav className="flex items-center justify-around">
              <Link
                href="/"
                className={clsx(
                  'flex flex-col items-center space-y-0.5 px-2 py-1 rounded-lg transition-all duration-200',
                  pathname === '/'
                    ? 'text-sky-500 dark:text-sky-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-sky-500 dark:hover:text-sky-400'
                )}
              >
                <HomeIcon className="h-4 w-4" />
                <span className="text-[10px] font-medium">Home</span>
              </Link>
              
              <Link
                href="/about"
                className={clsx(
                  'flex flex-col items-center space-y-0.5 px-2 py-1 rounded-lg transition-all duration-200',
                  pathname === '/about'
                    ? 'text-sky-500 dark:text-sky-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-sky-500 dark:hover:text-sky-400'
                )}
              >
                <UserIcon className="h-4 w-4" />
                <span className="text-[10px] font-medium">About</span>
              </Link>
              
              <Link
                href="/work"
                className={clsx(
                  'flex flex-col items-center space-y-0.5 px-2 py-1 rounded-lg transition-all duration-200',
                  pathname.startsWith('/work')
                    ? 'text-sky-500 dark:text-sky-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-sky-500 dark:hover:text-sky-400'
                )}
              >
                <BriefcaseIcon className="h-4 w-4" />
                <span className="text-[10px] font-medium">Work</span>
              </Link>
              
              <Link
                href="/notes"
                className={clsx(
                  'flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-all duration-200 relative',
                  pathname === '/notes'
                    ? 'text-sky-500 dark:text-sky-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-sky-500 dark:hover:text-sky-400'
                )}
              >
                <DocumentTextIcon className="h-4 w-4" />
                <span className="text-[10px] font-medium">Notes</span>
              </Link>
              
              <Link
                href="/reading"
                className={clsx(
                  'flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-all duration-200 relative',
                  pathname === '/reading'
                    ? 'text-sky-500 dark:text-sky-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-sky-500 dark:hover:text-sky-400'
                )}
              >
                <BookOpenIcon className="h-4 w-4" />
                <span className="text-[10px] font-medium">Reading</span>
                {recentCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[1.25rem] min-h-[1.25rem]">
                    {recentCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </LiquidGlass>
      </div>
      
      {/* Mobile bottom padding to prevent content being hidden behind nav */}
      <div className="md:hidden h-16" />
    </>
  )
}
