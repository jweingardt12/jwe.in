'use client'

import Link from 'next/link'
import clsx from 'clsx'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  ThreadsIcon,
} from './SocialIcons'
import { InnerContainer, OuterContainer } from './Container'

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
    <OuterContainer>
      <div className="border-t border-zinc-100 pb-16 pt-12 px-4 sm:px-6 lg:px-8 dark:border-zinc-700/40">
        <InnerContainer>
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              <NavLink href="/about">About</NavLink>
              <NavLink href="/work">Work</NavLink>
              <NavLink href="/notes">Notes</NavLink>
              <NavLink href="/reading">Reading</NavLink>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <ul role="list" className="flex gap-x-3 mb-4 sm:mb-0 sm:border-r sm:border-zinc-100 sm:pr-4 dark:sm:border-zinc-700/40">
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
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                &copy; {new Date().getFullYear()} Jason Weingardt
              </p>
            </div>
          </div>
        </InnerContainer>
      </div>
    </OuterContainer>
  )
}
