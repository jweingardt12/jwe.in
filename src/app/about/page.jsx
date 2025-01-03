'use client'

import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '../../components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  ThreadsIcon,
} from '../../components/SocialIcons'
import portraitImage from '../../images/portrait.jpg'

function SocialLink({ className, href, children, icon: Icon }) {
  return (
    <li className={clsx(className, 'flex')}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-sky-500 dark:text-zinc-200 dark:hover:text-sky-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-sky-500" />
        <span className="ml-4">{children}</span>
      </a>
    </li>
  )
}

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

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-[12rem] sm:max-w-xs px-2.5 lg:max-w-[15rem]">
            <div className="pointer-events-none">
              <Image
                src={portraitImage}
                alt=""
                sizes="(min-width: 1024px) 15rem, (min-width: 640px) 12rem, 12rem"
                className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800 select-none"
                draggable="false"
              />
            </div>
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            Hi! I'm Jason. 
            <br />
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              I'm a technical generalist who's spent the last decade+ working at some of the most innovative companies in the world. I'm a husband, dad, product manager, amateur photographer, and endlessly curious technologist. I've been working hands-on with technology since I was a kid, enjoy nothing more than learning how things work.
            </p>
            <p>
              Today, I'm a Product Manager at <a 
                href="https://cloudkitchens.com" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => window.umami?.track('external_link_click', {
                  domain: 'cloudkitchens.com',
                  type: 'company'
                })}
              >CloudKitchens</a>, where I lead a team responsible for building the autonomous Ghost kitchen of the future.
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink 
              href="https://www.threads.net/@jweingardt" 
              icon={ThreadsIcon} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Follow on Threads
            </SocialLink>
            <SocialLink 
              href="https://instagram.com/jweingardt" 
              icon={InstagramIcon} 
              className="mt-4" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Follow on Instagram
            </SocialLink>
            <SocialLink 
              href="https://github.com/jweingardt12" 
              icon={GitHubIcon} 
              className="mt-4" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Follow on GitHub
            </SocialLink>
            <SocialLink 
              href="https://linkedin.com/in/jasonweingardt" 
              icon={LinkedInIcon} 
              className="mt-4" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Follow on LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:hi@jwe.in"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
              target="_blank" 
              rel="noopener noreferrer"
            >
              hi@jwe.in
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
