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
import { BlurFade } from '../components/ui/blur-fade'

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
        <div className="flex flex-col items-center justify-center mx-auto">
          <div className="max-w-2xl text-center mx-auto">
            <BlurFade delay={0.25} inView>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                Jason Weingardt
              </h1>
            </BlurFade>
            <BlurFade delay={0.5} inView>
              <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                I&apos;m Jason, a product manager based in Washington, D.C. 
                I&apos;m an amateur photographer, baseball fanatic, 
                dad to a four-year-old, and constant tinkerer. 
                On this site you'll find what I've worked on, 
                what I'm interested in, and thoughts on things I come across.
              </p>
            </BlurFade>
            <BlurFade delay={0.75} inView>
              <div className="mt-6 flex justify-center gap-6">
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
            </BlurFade>
          </div>
        </div>
      </Container>
      
      <div className="mt-6 w-full">
        <Photos />
      </div>
    </>
  )
}
