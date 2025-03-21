'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import clsx from 'clsx'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  ThreadsIcon,
} from './SocialIcons'
import { Container } from './Container'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
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
      <button type="button" className="group flex items-center justify-center h-8 w-8">
        <span className="flex items-center justify-center">
          <SunIcon className="h-5 w-5 stroke-current text-zinc-500 transition" />
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="group flex items-center justify-center h-8 w-8"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <span className="flex items-center justify-center">
        <SunIcon className="h-5 w-5 stroke-current text-zinc-500 transition group-hover:text-sky-500 dark:hidden" />
        <MoonIcon className="hidden h-5 w-5 stroke-current text-zinc-500 transition group-hover:text-sky-500 dark:block dark:text-zinc-400 dark:group-hover:text-sky-400" />
      </span>
    </button>
  )
}

function SocialLink({ href, icon: Icon }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group"
      >
        <Icon className="h-5 w-5 fill-zinc-500 transition group-hover:fill-sky-500" />
      </a>
    </li>
  )
}

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
    <Container>
      <div className="border-t border-zinc-100 pb-16 pt-12 dark:border-zinc-700/40">
        <div className="flex flex-col items-center justify-between gap-6" data-component-name="Footer">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            <NavLink href="/about">About</NavLink>
            <NavLink href="/work">Work</NavLink>
            <NavLink href="/notes">Notes</NavLink>
            <NavLink href="/reading">Reading</NavLink>
          </div>
          
          <div className="flex flex-row items-center justify-center">
            <ul role="list" className="flex flex-wrap justify-center gap-x-4">
              <SocialLink 
                href="https://www.threads.net/@jweingardt" 
                icon={ThreadsIcon}
              />
              <SocialLink 
                href="https://instagram.com/jweingardt" 
                icon={InstagramIcon}
              />
              <SocialLink 
                href="https://github.com/jweingardt12" 
                icon={GitHubIcon}
              />
              <SocialLink 
                href="https://linkedin.com/in/jasonweingardt" 
                icon={LinkedInIcon}
              />
              <SocialLink
                href="mailto:hi@jwe.in"
                icon={MailIcon}
              />
            </ul>
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>
          
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} Jason Weingardt
          </p>
        </div>
      </div>
    </Container>
  )
}
