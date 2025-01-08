'use client'

import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { ExpandableCard } from '../../components/ui/expandable-card'
import { Container } from '../../components/Container'
import portraitImage from '../../images/portrait.jpg'
import { LinkPreview } from '../../components/ui/link-preview'
import { SmartHomeAnimation } from '../../components/BentoGrid'
import {
  IconCamera,
  IconHome,
  IconCode,
} from '@tabler/icons-react'
import ckWebsite from '../../images/previews/ck-website.png'
import lakeImage from '../../images/photos/new-york-lake.jpg'
import sideProjectsImage from '../../images/photos/side-projects.jpg'
import { useOpenPanel } from '@openpanel/nextjs'

export default function About() {
  const { track } = useOpenPanel()

  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16">
        <div className="max-w-4xl">
          <div className="flex flex-col-reverse sm:flex-row items-center gap-8">
            <h1 className="flex-1 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl leading-relaxed">
              Hi! I'm Jason.<br />
              I'm a <span className="text-sky-500">product manager</span> and <span className="text-sky-500">technologist</span> living in DC.
            </h1>
            <div className="w-48 sm:max-w-[12rem] flex-shrink-0">
              <div className="pointer-events-none">
                <Image
                  src={portraitImage}
                  alt=""
                  sizes="(min-width: 1024px) 15rem, (min-width: 640px) 12rem, 12rem"
                  className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800 select-none"
                  draggable="false"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              I'm a technical generalist who's spent the last decade+ working at some of the most innovative companies in the world. I'm a husband, dad, product manager, amateur photographer, and endlessly curious technologist. I've been working hands-on with technology since I was a kid, enjoy nothing more than learning how things work.
            </p>
            <div>
              Today, I'm a Product Manager at <LinkPreview 
                href="https://cloudkitchens.com"
                title="CloudKitchens"
                description="CloudKitchens provides real estate, technology and services that enable food operators to open delivery restaurants."
                imageUrl={ckWebsite}
              >
                CloudKitchens
              </LinkPreview>, where I lead a team responsible for building the autonomous Ghost kitchen of the future.
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <h2 className="text-lg font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-3xl mb-8">
          Learn more
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ExpandableCard
            title="Photography"
            description="The best camera is the one you have with you"
            header={
              <Image
                src={lakeImage}
                alt="Photography"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
            }
          >
            <div className="space-y-6">
              <p>
                I've been taking pictures of things since I was young, starting with basic cameras and eventually trying out different types of photography equipment over the years. It's always been a way for me to remember moments and places that matter to me.
                <br /><br />
                These days, I just use my phone for all my photos. My daughter was born in 2020, and I've captured every moment on my phone. It makes sense - I always have it with me, and it takes good enough pictures for what I need. Not having to carry around a separate camera means I end up taking more photos, which is what really matters.
              </p>
              <div>
                <h3 className="text-lg font-semibold mb-4">My stack</h3>
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="py-3 font-medium">Camera</td>
                      <td className="py-3">
                        <a href="https://www.apple.com/iphone-16-pro/" target="_blank" rel="noopener noreferrer" className="text-sky-500">iPhone 16 Pro</a>
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="py-3 font-medium">Software</td>
                      <td className="py-3">
                        <a href="https://apps.apple.com/us/app/photomator-photo-editor/id1444636541" target="_blank" rel="noopener noreferrer" className="text-sky-500">Photomator</a>
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="py-3 font-medium">Editing hardware</td>
                      <td className="py-3">
                        <a href="https://www.apple.com/ipad-pro/" target="_blank" rel="noopener noreferrer" className="text-sky-500">iPad Pro (M4)</a> + <a href="https://www.apple.com/apple-pencil/" target="_blank" rel="noopener noreferrer" className="text-sky-500">Apple Pencil</a>
                      </td>
                    </tr>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="py-3 font-medium">Video</td>
                      <td className="py-3">
                        <a href="https://apps.apple.com/us/app/lumafusion/id1062022008" target="_blank" rel="noopener noreferrer" className="text-sky-500">LumaFusion</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </ExpandableCard>
          <ExpandableCard
            title="Smart Home"
            description="Thoughts on designing a smart home"
            header={
              <SmartHomeAnimation className="w-full h-full" />
            }
          >
            <p>
              I've transformed my home into a smart living space, integrating various technologies to create a seamless and efficient environment.
            </p>
          </ExpandableCard>
          <ExpandableCard
            title="Side Projects"
            description="Random stuff I've built"
            header={
              <Image
                src={sideProjectsImage}
                alt="Side Projects"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
            }
          >
            <p>
              From web applications to automation tools, I'm constantly working on side projects that let me explore new technologies and solve interesting problems.
            </p>
          </ExpandableCard>
        </div>
      </div>
    </Container>
  )
}
