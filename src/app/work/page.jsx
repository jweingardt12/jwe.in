'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { SimpleLayout } from '../../components/SimpleLayout'
import { Timeline } from '../../components/ui/timeline'

const logoAnimaginary = '/images/logos/animaginary.svg'
const logoCosmos = '/images/logos/cosmos.svg'
const logoHelioStream = '/images/logos/helio-stream.svg'
const logoOpenShuttle = '/images/logos/open-shuttle.svg'
const logoPlanetaria = '/images/logos/planetaria.svg'

const timelineData = [
  {
    title: '2021 - Present',
    content: (
      <div>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-normal mb-8">
          Creating technology to empower civilians to explore space on their own terms.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src={logoPlanetaria}
            alt="CloudKitchens"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
          <Image
            src={logoPlanetaria}
            alt="CloudKitchens"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
          <Image
            src={logoPlanetaria}
            alt="CloudKitchens"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
          <Image
            src={logoPlanetaria}
            alt="CloudKitchens"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
        </div>
      </div>
    )
  },
  {
    title: '2020 - 2021',
    content: (
      <div>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-normal mb-8">
          High performance web animation library, hand-written in optimized WASM.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src={logoAnimaginary}
            alt="Animaginary"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
          <Image
            src={logoAnimaginary}
            alt="Animaginary"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
          <Image
            src={logoAnimaginary}
            alt="Animaginary"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
          <Image
            src={logoAnimaginary}
            alt="Animaginary"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
        </div>
      </div>
    )
  },
  {
    title: '2019 - 2020',
    content: (
      <div>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-normal mb-8">
          Real-time video streaming library, optimized for interstellar transmission.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src={logoHelioStream}
            alt="HelioStream"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
          <Image
            src={logoHelioStream}
            alt="HelioStream"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
          <Image
            src={logoHelioStream}
            alt="HelioStream"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
          <Image
            src={logoHelioStream}
            alt="HelioStream"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
        </div>
      </div>
    )
  },
  {
    title: '2018 - 2019',
    content: (
      <div>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-normal mb-8">
          The operating system that powers our Planetaria space shuttles.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src={logoCosmos}
            alt="cosmOS"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
          <Image
            src={logoCosmos}
            alt="cosmOS"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
          <Image
            src={logoCosmos}
            alt="cosmOS"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
          <Image
            src={logoCosmos}
            alt="cosmOS"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
        </div>
      </div>
    )
  },
  {
    title: '2017 - 2018',
    content: (
      <div>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-normal mb-8">
          The schematics for the first rocket I designed that successfully made it to orbit.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src={logoOpenShuttle}
            alt="OpenShuttle"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
          <Image
            src={logoOpenShuttle}
            alt="OpenShuttle"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
          <Image
            src={logoOpenShuttle}
            alt="OpenShuttle"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
          <Image
            src={logoOpenShuttle}
            alt="OpenShuttle"
            width={500}
            height={500}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full bg-zinc-100 dark:bg-zinc-800"
          />
        </div>
      </div>
    )
  }
]

export default function Work() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <SimpleLayout
      title="My Work"
      intro="I've had the privilege of working with some amazing teams on products that millions of people use every day. Here are a few that I'm particularly proud of."
    >
      <div className="space-y-8" suppressHydrationWarning>
        <Timeline data={timelineData} />
      </div>
    </SimpleLayout>
  )
}
