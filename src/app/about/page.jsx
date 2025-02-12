'use client'

import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { Container } from '../../components/Container'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Globe, PlusIcon } from 'lucide-react'
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
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogDescription,
  MorphingDialogImage,
} from '@/components/ui/morphing-dialog'

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
              I'm a <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger className="underline decoration-dotted cursor-help">technical generalist</TooltipTrigger>
                  <TooltipContent className="dark py-3">
                    <div className="flex gap-3">
                      <Globe
                        className="mt-0.5 shrink-0 opacity-60"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <div className="space-y-1">
                        <p className="text-[13px] font-medium">What's a technical generalist?</p>
                        <p className="text-xs text-muted-foreground">
                          Someone who understands technology deeply but prefers breadth over specialization. I can write code, design systems, and understand complex technical concepts, but I'm most valuable when connecting different technical domains to solve problems.
                        </p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> who's spent the last decade+ working at some of the most innovative companies in the world. I'm a husband, dad, product manager, amateur photographer, and endlessly curious technologist. I've been working hands-on with technology since I was a kid, enjoy nothing more than learning how things work.
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
          <MorphingDialog>
            <MorphingDialogTrigger
              style={{
                borderRadius: "12px",
              }}
              className="flex max-w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900"
            >
              <MorphingDialogImage
                src={lakeImage}
                alt="Photography"
                className="h-48 w-full object-cover"
              />
              <div className="flex flex-grow flex-row items-end justify-between p-2">
                <div>
                  <MorphingDialogTitle className="text-zinc-950 dark:text-zinc-50">
                    Photography
                  </MorphingDialogTitle>
                  <MorphingDialogSubtitle className="text-zinc-700 dark:text-zinc-400">
                    The best camera is the one you have with you
                  </MorphingDialogSubtitle>
                </div>
                <button
                  type="button"
                  className="relative ml-1 flex h-6 w-6 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-500"
                  aria-label="Open dialog"
                >
                  <PlusIcon size={12} />
                </button>
              </div>
            </MorphingDialogTrigger>
            <MorphingDialogContainer>
              <MorphingDialogContent
                style={{
                  borderRadius: "24px",
                }}
                className="pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900"
              >
                <MorphingDialogImage
                  src={lakeImage}
                  alt="Photography"
                  className="h-full w-full"
                />
                <div className="p-6">
                  <MorphingDialogTitle className="text-2xl text-zinc-950 dark:text-zinc-50">
                    Photography
                  </MorphingDialogTitle>
                  <MorphingDialogSubtitle className="text-zinc-700 dark:text-zinc-400">
                    The best camera is the one you have with you
                  </MorphingDialogSubtitle>
                  <MorphingDialogDescription
                    disableLayoutAnimation
                    variants={{
                      initial: { opacity: 0, scale: 0.8, y: 100 },
                      animate: { opacity: 1, scale: 1, y: 0 },
                      exit: { opacity: 0, scale: 0.8, y: 100 },
                    }}
                  >
                    <div className="space-y-6">
                      <p className="mt-2 text-zinc-500">
                        I've been taking pictures of things since I was young, starting with basic cameras and eventually trying out different types of photography equipment over the years. It's always been a way for me to remember moments and places that matter to me.
                      </p>
                      <p className="text-zinc-500">
                        These days, I just use my phone for all my photos. My daughter was born in 2020, and I've captured every moment on my phone. It makes sense - I always have it with me, and it takes good enough pictures for what I need. Not having to carry around a separate camera means I end up taking more photos, which is what really matters.
                      </p>
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-zinc-950 dark:text-zinc-50">My stack</h3>
                        <table className="w-full text-left">
                          <tbody>
                            <tr className="border-b border-zinc-100 dark:border-zinc-800">
                              <td className="py-3 font-medium text-zinc-950 dark:text-zinc-50">Camera</td>
                              <td className="py-3">
                                <a href="https://www.apple.com/iphone-16-pro/" target="_blank" rel="noopener noreferrer" className="text-sky-500">iPhone 16 Pro</a>
                              </td>
                            </tr>
                            <tr className="border-b border-zinc-100 dark:border-zinc-800">
                              <td className="py-3 font-medium text-zinc-950 dark:text-zinc-50">Software</td>
                              <td className="py-3">
                                <a href="https://apps.apple.com/us/app/photomator-photo-editor/id1444636541" target="_blank" rel="noopener noreferrer" className="text-sky-500">Photomator</a>
                              </td>
                            </tr>
                            <tr className="border-b border-zinc-100 dark:border-zinc-800">
                              <td className="py-3 font-medium text-zinc-950 dark:text-zinc-50">Editing hardware</td>
                              <td className="py-3">
                                <a href="https://www.apple.com/ipad-pro/" target="_blank" rel="noopener noreferrer" className="text-sky-500">iPad Pro (M4)</a> + <a href="https://www.apple.com/apple-pencil/" target="_blank" rel="noopener noreferrer" className="text-sky-500">Apple Pencil</a>
                              </td>
                            </tr>
                            <tr className="border-b border-zinc-100 dark:border-zinc-800">
                              <td className="py-3 font-medium text-zinc-950 dark:text-zinc-50">Video</td>
                              <td className="py-3">
                                <a href="https://apps.apple.com/us/app/lumafusion/id1062022008" target="_blank" rel="noopener noreferrer" className="text-sky-500">LumaFusion</a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </MorphingDialogDescription>
                </div>
                <MorphingDialogClose className="text-zinc-50" />
              </MorphingDialogContent>
            </MorphingDialogContainer>
          </MorphingDialog>

          <MorphingDialog>
            <MorphingDialogTrigger
              style={{
                borderRadius: "12px",
              }}
              className="flex max-w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900"
            >
              <div className="h-48 w-full">
                <SmartHomeAnimation className="w-full h-full" />
              </div>
              <div className="flex flex-grow flex-row items-end justify-between p-2">
                <div>
                  <MorphingDialogTitle className="text-zinc-950 dark:text-zinc-50">
                    Smart Home
                  </MorphingDialogTitle>
                  <MorphingDialogSubtitle className="text-zinc-700 dark:text-zinc-400">
                    Thoughts on designing a smart home
                  </MorphingDialogSubtitle>
                </div>
                <button
                  type="button"
                  className="relative ml-1 flex h-6 w-6 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-500"
                  aria-label="Open dialog"
                >
                  <PlusIcon size={12} />
                </button>
              </div>
            </MorphingDialogTrigger>
            <MorphingDialogContainer>
              <MorphingDialogContent
                style={{
                  borderRadius: "24px",
                }}
                className="pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900"
              >
                <div className="h-64 w-full">
                  <SmartHomeAnimation className="w-full h-full" />
                </div>
                <div className="p-6">
                  <MorphingDialogTitle className="text-2xl text-zinc-950 dark:text-zinc-50">
                    Smart Home
                  </MorphingDialogTitle>
                  <MorphingDialogSubtitle className="text-zinc-700 dark:text-zinc-400">
                    Thoughts on designing a smart home
                  </MorphingDialogSubtitle>
                  <MorphingDialogDescription
                    disableLayoutAnimation
                    variants={{
                      initial: { opacity: 0, scale: 0.8, y: 100 },
                      animate: { opacity: 1, scale: 1, y: 0 },
                      exit: { opacity: 0, scale: 0.8, y: 100 },
                    }}
                  >
                    <p className="mt-2 text-zinc-500">
                      I've transformed my home into a smart living space, integrating various technologies to create a seamless and efficient environment.
                    </p>
                  </MorphingDialogDescription>
                </div>
                <MorphingDialogClose className="text-zinc-50" />
              </MorphingDialogContent>
            </MorphingDialogContainer>
          </MorphingDialog>

          <MorphingDialog>
            <MorphingDialogTrigger
              style={{
                borderRadius: "12px",
              }}
              className="flex max-w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900"
            >
              <MorphingDialogImage
                src={sideProjectsImage}
                alt="Side Projects"
                className="h-48 w-full object-cover"
              />
              <div className="flex flex-grow flex-row items-end justify-between p-2">
                <div>
                  <MorphingDialogTitle className="text-zinc-950 dark:text-zinc-50">
                    Side Projects
                  </MorphingDialogTitle>
                  <MorphingDialogSubtitle className="text-zinc-700 dark:text-zinc-400">
                    Random stuff I've built
                  </MorphingDialogSubtitle>
                </div>
                <button
                  type="button"
                  className="relative ml-1 flex h-6 w-6 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-500"
                  aria-label="Open dialog"
                >
                  <PlusIcon size={12} />
                </button>
              </div>
            </MorphingDialogTrigger>
            <MorphingDialogContainer>
              <MorphingDialogContent
                style={{
                  borderRadius: "24px",
                }}
                className="pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900"
              >
                <MorphingDialogImage
                  src={sideProjectsImage}
                  alt="Side Projects"
                  className="h-full w-full"
                />
                <div className="p-6">
                  <MorphingDialogTitle className="text-2xl text-zinc-950 dark:text-zinc-50">
                    Side Projects
                  </MorphingDialogTitle>
                  <MorphingDialogSubtitle className="text-zinc-700 dark:text-zinc-400">
                    Random stuff I've built
                  </MorphingDialogSubtitle>
                  <MorphingDialogDescription
                    disableLayoutAnimation
                    variants={{
                      initial: { opacity: 0, scale: 0.8, y: 100 },
                      animate: { opacity: 1, scale: 1, y: 0 },
                      exit: { opacity: 0, scale: 0.8, y: 100 },
                    }}
                  >
                    <p className="mt-2 text-zinc-500">
                      From web applications to automation tools, I'm constantly working on side projects that let me explore new technologies and solve interesting problems.
                    </p>
                  </MorphingDialogDescription>
                </div>
                <MorphingDialogClose className="text-zinc-50" />
              </MorphingDialogContent>
            </MorphingDialogContainer>
          </MorphingDialog>
        </div>
      </div>
    </Container>
  )
}
