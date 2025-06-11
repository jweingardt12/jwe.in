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
import { ContactDrawer } from './ContactDrawer'
const avatarImage = '/images/photos/avatar.jpg'
import { Button } from '@/components/ui/button'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { LiquidGlass } from '@/components/ui/liquid-glass'
import { ChevronDownIcon, CloseIcon, SunIcon, MoonIcon, HamburgerIcon, ComputerIcon } from '@/components/Icons'
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
          : "text-zinc-200 hover:bg-zinc-800/60 hover:translate-x-1 dark:text-zinc-200 dark:hover:bg-zinc-800/60"
      )}>
        <div className="flex items-center relative">
          {icon}
          <span className="relative inline-block">
            {children}
            {badge && (
              <span 
                className="absolute -top-3 -right-3 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[1.25rem] min-h-[1.25rem]"
                style={{ transform: 'scale(0)', animation: 'notificationBadge 0.3s forwards ease-out' }}
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
              style={{ transform: 'scale(0)', animation: 'notificationBadge 0.3s forwards ease-out' }}
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
        isHomePage && (fadeIn ? "opacity-100" : "opacity-0 -translate-y-4")
      )}
    >
      <LiquidGlass
        displacementScale={40}
        blurAmount={0.35}
        saturation={200}
        aberrationIntensity={2}
        elasticity={0.25}
        cornerRadius={12}
        className="shadow-lg shadow-zinc-800/10"
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
            <ContactDrawer>
              <Button 
                className="bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm px-3 py-1 h-auto dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 relative overflow-hidden group"
                onMouseEnter={() => {}}
                onMouseMove={() => {}}
              >
                <GlowingEffect
                  spread={80}
                  glow={true}
                  disabled={false}
                  proximity={120}
                  inactiveZone={0.01}
                />
                <span className="relative z-10">Contact</span>
              </Button>
            </ContactDrawer>
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

function ThemeToggleItem({ icon: Icon, theme, label, currentTheme, onClick }) {
  const isActive = currentTheme === theme
  
  return (
    <button
      onClick={() => onClick(theme)}
      className={clsx(
        "flex items-center w-full px-2.5 py-1.5 text-xs rounded-md transition-all duration-200",
        isActive 
          ? "bg-sky-100/80 text-sky-900 dark:bg-sky-800/20 dark:text-sky-400" 
          : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
      )}
    >
      <Icon className="h-3.5 w-3.5 mr-1.5" />
      <span>{label}</span>
    </button>
  )
}

function ThemeToggleDropdown() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
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

  const { track } = usePlausible()

  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  return (
    <div className="mt-2 w-40 rounded-lg bg-white/90 p-1.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md dark:bg-zinc-800/90 dark:ring-white/10 origin-top-right">
      <Link 
        href="/"
        className={clsx(
          "flex items-center w-full px-2.5 py-1.5 text-xs rounded-md transition-all duration-200",
          isHomePage 
            ? "bg-sky-100/80 text-sky-900 dark:bg-sky-800/20 dark:text-sky-400" 
            : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
        )}
      >
        <HomeIcon className="h-3.5 w-3.5 mr-1.5" />
        <span>Home</span>
      </Link>
      
      <div className="h-px bg-zinc-200 dark:bg-zinc-700/40 my-1"></div>
      
      <div className="pt-0.5">
        <p className="px-2.5 py-0.5 text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Theme</p>
        <ThemeToggleItem 
          icon={SunIcon} 
          theme="light" 
          label="Light" 
          currentTheme={theme} 
          onClick={setTheme} 
        />
        <ThemeToggleItem 
          icon={MoonIcon} 
          theme="dark" 
          label="Dark" 
          currentTheme={theme} 
          onClick={setTheme} 
        />
        <ThemeToggleItem 
          icon={ComputerIcon} 
          theme="system" 
          label="System" 
          currentTheme={theme} 
          onClick={setTheme} 
        />
      </div>
    </div>
  )
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
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef(null)
  const hoverTimeoutRef = useRef(null)
  const dropdownRef = useRef(null)
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

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Set a delay of 0.5 seconds before showing the popover
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true)
      setIsOpen(true)
    }, 500)
  }

  const handleMouseLeave = () => {
    // Clear the hover timeout if the user moves away before the delay completes
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false)
      setTimeout(() => {
        setIsOpen(false)
      }, 150) // Match the leave transition duration
    }, 100)
  }

  // Handle click for the avatar image - always navigate home
  const handleAvatarClick = (e) => {
    e.preventDefault()
    router.push('/')
  }

  // Handle click for the container - for mobile devices
  const handleContainerClick = (e) => {
    // Only handle dropdown toggle if the click wasn't on the avatar image itself
    if (!e.target.closest('a[aria-label="Home"]')) {
      if (!isOpen) {
        e.preventDefault()
        
        // Clear any existing hover timeout
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
        
        // Show immediately on click
        setIsHovered(true)
        setIsOpen(true)
      }
    }
  }

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsHovered(false)
        setTimeout(() => {
          setIsOpen(false)
        }, 150)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div 
      ref={dropdownRef}
      className={clsx(
        className, 
        'pointer-events-auto relative',
        isHomePage && "transition-all duration-1000 ease-in-out",
        isHomePage && (fadeIn ? "opacity-100" : "opacity-0")
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleContainerClick}
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
            isLoaded ? 'opacity-100' : 'opacity-0',
            isHovered && 'ring-2 ring-sky-500/50 dark:ring-sky-400/50 scale-110'
          )}
          priority
          onLoad={() => setIsLoaded(true)}
        />
      </Link>
      
      {isOpen && (
        <div
          className={clsx(
            "absolute right-0 top-full z-50",
            isHovered ? "opacity-100 animate-bounce-in" : "opacity-0 scale-95",
            "transition-opacity duration-200 origin-top-right"
          )}
        >
          <ThemeToggleDropdown />
        </div>
      )}
    </div>
  )
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { recentCount, isLoading, error } = useRecentArticles()
  const router = useRouter()
  const pathname = usePathname()
  const plausible = usePlausible()

  let isHomePage = usePathname() === '/'
  let headerRef = useRef(null)
  let isInitial = useRef(true)
  let lastScrollY = useRef(0)
  let scrollAnimationFrame = useRef(null)
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

  useEffect(() => {
    let downDelay = 64
    let upDelay = 64

    function setProperty(property, value) {
      document.documentElement.style.setProperty(property, value)
    }

    function removeProperty(property) {
      document.documentElement.style.removeProperty(property)
    }

    function updateHeaderStyles() {
      if (!isHomePage || !headerRef.current) {
        return
      }

      let { top } = headerRef.current.getBoundingClientRect()
      let scrollY = clamp(
        window.scrollY,
        0,
        Math.max(0, document.body.scrollHeight - window.innerHeight)
      )

      // Only update if scroll position changed significantly
      if (Math.abs(scrollY - lastScrollY.current) < 2) {
        return;
      }
      
      lastScrollY.current = scrollY;

      if (scrollY <= 0) {
        setProperty('--header-height', `${Math.max(downDelay, 64)}px`)
        setProperty('--header-mb', `${-Math.max(downDelay, 64) + 64}px`)
      } else if (scrollY < downDelay) {
        let factor = 1 - scrollY / downDelay
        setProperty('--header-height', `${Math.max(0, Math.round(downDelay * factor + 64))}px`)
        setProperty('--header-mb', `${Math.max(0, Math.round(-downDelay * factor - 64) + 64)}px`)
      } else {
        setProperty('--header-height', '64px')
        setProperty('--header-mb', '0px')
      }

      if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
        setProperty('--header-inner-position', 'fixed')
        removeProperty('--header-top')
      } else {
        removeProperty('--header-inner-position')
        setProperty('--header-top', '0px')
      }
    }

    function updateStyles() {
      if (scrollAnimationFrame.current) {
        cancelAnimationFrame(scrollAnimationFrame.current);
      }
      
      scrollAnimationFrame.current = requestAnimationFrame(() => {
        updateHeaderStyles();
        isInitial.current = false;
      });
    }

    updateStyles()
    window.addEventListener('scroll', updateStyles, { passive: true })
    window.addEventListener('resize', updateStyles)

    return () => {
      if (scrollAnimationFrame.current) {
        cancelAnimationFrame(scrollAnimationFrame.current);
      }
      window.removeEventListener('scroll', updateStyles)
      window.removeEventListener('resize', updateStyles)
    }
  }, [isHomePage])

  return (
    <>
      <header
        className={clsx(
          "pointer-events-none relative z-50 flex flex-none flex-col",
          isHomePage && "transition-opacity duration-1000 ease-in-out",
          isHomePage && (fadeIn ? "opacity-100" : "opacity-0 -translate-y-4")
        )}
        style={{
          height: 'var(--header-height)',
          marginBottom: 'var(--header-mb)',
          transition: isHomePage 
            ? 'height 0.3s ease, margin-bottom 0.3s ease, opacity 1s ease-in-out, transform 1s ease-in-out' 
            : 'height 0.3s ease, margin-bottom 0.3s ease',
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
            position: 'var(--header-position)',
            transition: 'transform 0.3s ease',
          }}
        >
          <Container
            className="top-[var(--header-top,theme(spacing.6))] w-full"
            style={{ 
              position: 'var(--header-inner-position)',
              transition: 'transform 0.3s ease, position 0.3s ease',
            }}
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
                      displacementScale={30}
                      blurAmount={0.25}
                      saturation={180}
                      aberrationIntensity={1.5}
                      elasticity={0.2}
                      cornerRadius={12}
                      className="shadow-lg shadow-zinc-800/10"
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
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="duration-150 ease-in"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
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
                                  <ContactDrawer>
                                    <Button
                                      className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 rounded-lg px-4 py-2 font-medium shadow-sm border border-zinc-200 dark:border-zinc-700"
                                      onMouseEnter={() => {}}
                                      onMouseMove={() => {}}
                                    >
                                      Contact
                                    </Button>
                                  </ContactDrawer>
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
      {isHomePage && (
        <div className="flex-none" style={{ height: 'var(--content-offset)' }} />
      )}
      
      {/* Mobile Top Sticky Bar */}
      <div className="md:hidden fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[95vw] max-w-lg">
        <LiquidGlass
          displacementScale={40}
          blurAmount={0.35}
          saturation={200}
          aberrationIntensity={2}
          elasticity={0.25}
          cornerRadius={16}
          className="shadow-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2 flex items-center justify-between"
        >
          <Avatar large={true} />
          <ContactDrawer>
            <Button
              className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 rounded-lg px-4 py-2 font-medium shadow-sm border border-zinc-200 dark:border-zinc-700"
            >
              Contact
            </Button>
          </ContactDrawer>
        </LiquidGlass>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-auto">
        <LiquidGlass
          displacementScale={40}
          blurAmount={0.4}
          saturation={220}
          aberrationIntensity={2}
          elasticity={0.2}
          cornerRadius={0}
          className="shadow-lg shadow-zinc-800/20"
        >
          <div className="px-4 py-3 bg-gradient-to-t from-white/5 to-transparent">
            <nav className="flex items-center justify-around">
              <Link
                href="/"
                className={clsx(
                  'flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-all duration-200',
                  pathname === '/'
                    ? 'text-sky-500 dark:text-sky-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-sky-500 dark:hover:text-sky-400'
                )}
              >
                <HomeIcon className="h-5 w-5" />
                <span className="text-xs font-medium">Home</span>
              </Link>
              
              <Link
                href="/about"
                className={clsx(
                  'flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-all duration-200',
                  pathname === '/about'
                    ? 'text-sky-500 dark:text-sky-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-sky-500 dark:hover:text-sky-400'
                )}
              >
                <UserIcon className="h-5 w-5" />
                <span className="text-xs font-medium">About</span>
              </Link>
              
              <Link
                href="/work"
                className={clsx(
                  'flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-all duration-200',
                  pathname.startsWith('/work')
                    ? 'text-sky-500 dark:text-sky-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-sky-500 dark:hover:text-sky-400'
                )}
              >
                <BriefcaseIcon className="h-5 w-5" />
                <span className="text-xs font-medium">Work</span>
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
                <DocumentTextIcon className="h-5 w-5" />
                <span className="text-xs font-medium">Notes</span>
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
                <BookOpenIcon className="h-5 w-5" />
                <span className="text-xs font-medium">Reading</span>
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
      <div className="md:hidden h-20" />
    </>
  )
}
