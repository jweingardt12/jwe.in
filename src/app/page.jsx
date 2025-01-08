'use client'

import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { Photos } from '../components/Photos'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  ThreadsIcon,
} from '../components/SocialIcons'

function SocialLink({ icon: Icon, className, href, ...props }) {
  return (
    <a 
      className="group -m-1 p-1" 
      href={href} 
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      <Icon className={clsx(
        "h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300",
        className
      )} />
    </a>
  )
}

export default function HomePage() {
  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            Jason Weingardt
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            I'm Jason, a product manager based in Washington, D.C. <br />
            I'm an amateur photographer, fantasy baseball champion,<br />
            dad to an awesome four-year-old, and constant tinkerer.
          </p>
          <div className="mt-6 flex gap-6">
            <SocialLink href="https://www.threads.net/@jweingardt" aria-label="Follow on Threads" icon={ThreadsIcon} />
            <SocialLink
              href="https://www.instagram.com/jweingardt/"
              aria-label="Follow on Instagram"
              icon={InstagramIcon}
            />
            <SocialLink
              href="https://github.com/jweingardt12"
              aria-label="Follow on GitHub"
              icon={GitHubIcon}
            />
            <SocialLink
              href="https://www.linkedin.com/in/jasonweingardt"
              aria-label="Follow on LinkedIn"
              icon={LinkedInIcon}
            />
          </div>
        </div>
      </Container>
      <Photos />
    </>
  )
}
