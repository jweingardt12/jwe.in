'use client'

import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { Container } from '../../components/Container'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Globe, PlusIcon } from 'lucide-react'
import { LinkPreview } from '@/components/ui/link-preview'
import { SmartHomeAnimation } from '@/components/BentoGrid'
// import portraitImage from '../../images/portrait.jpg'
const portraitImage = '/images/portrait.jpg';
// import ckWebsite from '../../images/previews/ck-website.png'
const ckWebsite = '/images/previews/ck-website.png';
// import lakeImage from '../../images/photos/new-york-lake.jpg'
const lakeImage = '/images/photos/new-york-lake.jpg';
// import sideProjectsImage from '../../images/photos/side-projects.jpg'
const sideProjectsImage = '/images/photos/side-projects.jpg';
// import smartHomeImage from '../../images/photos/dashboard.jpg'
const smartHomeImage = '/images/photos/dashboard.jpg';
import { useRef, useState, useId, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOutsideClick } from '@/hooks/use-outside-click'
import { usePlausible } from '@/lib/analytics'

// CloseIcon component for the expandable cards
const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

export default function About() {
  const { track } = usePlausible()
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  // Define cards for the expandable card component
  const cards = [
    {
      description: "The best camera is the one you have with you",
      title: "Photography",
      src: lakeImage,
      ctaText: "Learn More",
      ctaLink: "#",
      content: () => {
        return (
          <div className="space-y-6">
            <p>
              I've been taking pictures of things since I was young, starting with basic cameras and eventually trying out different types of photography equipment over the years. It's always been a way for me to remember moments and places that matter to me.
            </p>
            <p>
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
        );
      },
    },
    {
      description: "Thoughts on designing a smart home",
      title: "Smart Home",
      src: smartHomeImage,
      ctaText: "Learn More",
      ctaLink: "#",
      content: () => {
        return (
          <div className="space-y-6">
            <p>
              I've transformed my home into a smart living space, integrating various technologies to create a seamless and efficient environment. My approach focuses on practical automation that enhances daily life without adding unnecessary complexity.
            </p>
            <div className="mt-4 mb-6">
              <SmartHomeAnimation className="w-full h-48" />
            </div>
            <p>
              My smart home is powered by Home Assistant, an open-source platform that allows me to integrate and control all my devices from a single dashboard (shown above). I prefer this approach because it gives me complete control over my data and doesn't rely on cloud services that might be discontinued.
            </p>
            <p>
              My smart home philosophy is simple: automation should solve real problems and be reliable enough that you forget it's there. I've built my system around privacy-focused, local-first solutions whenever possible.
            </p>
            <div>
              <h3 className="text-lg font-semibold mb-4">My smart home stack</h3>
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 font-medium">Hub</td>
                    <td className="py-3">
                      <a href="https://www.home-assistant.io/" target="_blank" rel="noopener noreferrer" className="text-sky-500">Home Assistant</a> on <a href="https://www.raspberrypi.com/" target="_blank" rel="noopener noreferrer" className="text-sky-500">Raspberry Pi 4</a>
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 font-medium">Lighting</td>
                    <td className="py-3">
                      <a href="https://www.philips-hue.com/" target="_blank" rel="noopener noreferrer" className="text-sky-500">Philips Hue</a> + <a href="https://www.lutron.com/en-US/Products/Pages/SingleRoomControls/Caseta/Overview.aspx" target="_blank" rel="noopener noreferrer" className="text-sky-500">Lutron Caseta</a>
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 font-medium">Climate</td>
                    <td className="py-3">
                      <a href="https://www.ecobee.com/" target="_blank" rel="noopener noreferrer" className="text-sky-500">Ecobee Smart Thermostat</a>
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 font-medium">Security</td>
                    <td className="py-3">
                      <a href="https://simplisafe.com/" target="_blank" rel="noopener noreferrer" className="text-sky-500">SimpliSafe</a> + <a href="https://www.aqara.com/" target="_blank" rel="noopener noreferrer" className="text-sky-500">Aqara Sensors</a>
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3 font-medium">Voice Control</td>
                    <td className="py-3">
                      <a href="https://www.apple.com/homepod-mini/" target="_blank" rel="noopener noreferrer" className="text-sky-500">HomePod Mini</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      },
    },
    {
      description: "Random stuff I've built",
      title: "Side Projects",
      src: sideProjectsImage,
      ctaText: "Learn More",
      ctaLink: "#",
      content: () => {
        return (
          <div className="space-y-6">
            <p>
              I'm constantly working on side projects that let me explore new technologies and solve interesting problems. These projects range from web applications to automation tools and hardware experiments.
            </p>
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent projects</h3>
              <ul className="space-y-4">
                <li className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <h4 className="font-medium">Personal Website</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    This website! Built with Next.js, Tailwind CSS, and various modern web technologies. It serves as my digital garden and playground for web experiments.
                  </p>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 rounded-full">Next.js</span>
                    <span className="px-2 py-1 bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 rounded-full">Tailwind CSS</span>
                    <span className="px-2 py-1 bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 rounded-full">Framer Motion</span>
                  </div>
                </li>
                <li className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <h4 className="font-medium">Home Automation Dashboard</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    A custom dashboard for my smart home that provides a unified interface for controlling all devices and viewing sensor data.
                  </p>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 rounded-full">Home Assistant</span>
                    <span className="px-2 py-1 bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 rounded-full">Node-RED</span>
                    <span className="px-2 py-1 bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 rounded-full">MQTT</span>
                  </div>
                </li>
                <li className="pb-2">
                  <h4 className="font-medium">AI-Powered News Aggregator</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    An experimental news aggregator that uses AI to summarize articles and identify key topics from various sources.
                  </p>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 rounded-full">Python</span>
                    <span className="px-2 py-1 bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 rounded-full">OpenAI API</span>
                    <span className="px-2 py-1 bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 rounded-full">FastAPI</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        );
      },
    },
  ];

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
                  width={192}
                  height={192}
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
        
        {/* Expandable Cards Component */}
        <div>
          <AnimatePresence>
            {active && typeof active === "object" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm h-full w-full z-[999]" />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {active && typeof active === "object" ? (
              <div className="fixed inset-0 grid place-items-center z-[1000]">
                <motion.button
                  key={`button-${active.title}-${id}`}
                  layout
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: 0.05,
                    },
                  }}
                  className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                  onClick={() => setActive(null)}>
                  <CloseIcon />
                </motion.button>
                <motion.div
                  layoutId={`card-${active.title}-${id}`}
                  ref={ref}
                  className="w-full max-w-[800px] h-auto max-h-[90vh] flex flex-col bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-xl">
                  <motion.div layoutId={`image-${active.title}-${id}`}>
                    <Image
                      priority
                      width={500}
                      height={300}
                      src={active.src}
                      alt={active.title}
                      className="w-full h-80 lg:h-80 rounded-t-3xl object-cover object-top" />
                  </motion.div>

                  <div className="overflow-y-auto">
                    <div className="flex justify-between items-start p-4">
                      <div className="w-full">
                        <motion.h3
                          layoutId={`title-${active.title}-${id}`}
                          className="font-bold text-neutral-700 dark:text-neutral-200">
                          {active.title}
                        </motion.h3>
                        <motion.p
                          layoutId={`description-${active.description}-${id}`}
                          className="text-neutral-600 dark:text-neutral-400">
                          {active.description}
                        </motion.p>
                      </div>
                    </div>
                    <div className="pt-4 relative px-4 pb-6">
                      <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-neutral-600 text-xs md:text-sm lg:text-base flex flex-col items-start gap-4 dark:text-neutral-400">
                        {typeof active.content === "function"
                          ? active.content()
                          : active.content}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : null}
          </AnimatePresence>
          <ul className="max-w-full w-full gap-6 grid grid-cols-1 md:grid-cols-3">
            {cards.map((card, index) => (
              <motion.div
                layoutId={`card-${card.title}-${id}`}
                key={`card-${card.title}-${id}`}
                onClick={() => setActive(card)}
                className="p-4 flex flex-col justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer border border-zinc-950/10 dark:border-zinc-50/10 bg-white dark:bg-zinc-900 h-full">
                <div className="flex gap-4 flex-col w-full">
                  <motion.div layoutId={`image-${card.title}-${id}`}>
                    <Image
                      width={400}
                      height={200}
                      src={card.src}
                      alt={card.title}
                      className="h-40 w-full rounded-lg object-cover object-top" />
                  </motion.div>
                  <div className="">
                    <motion.h3
                      layoutId={`title-${card.title}-${id}`}
                      className="font-medium text-neutral-800 dark:text-neutral-200 text-left">
                      {card.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${card.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-left">
                      {card.description}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  )
}
