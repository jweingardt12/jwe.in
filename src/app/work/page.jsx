'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { SimpleLayout } from '../../components/SimpleLayout'
import { Timeline } from '../../components/ui/timeline'
import { BentoGrid, BentoGridItem } from '../../components/ui/bento-grid'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
const logoCloudKitchens = '/images/logos/cloudkitchens.svg'
const logoRitual = '/images/logos/ritual.svg'
const logoCountable = '/images/logos/countable.svg'
const logoUber = '/images/logos/uber.svg'

const RoboticsSkeleton = () => {
  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2">
      <div className="flex flex-col space-y-2">
        <div className="w-full bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 h-24 rounded-lg animate-pulse" />
        <div className="flex space-x-2">
          <div className="w-1/3 bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 h-12 rounded-lg animate-pulse" />
          <div className="w-1/3 bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 h-12 rounded-lg animate-pulse" />
          <div className="w-1/3 bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 h-12 rounded-lg animate-pulse" />
        </div>
      </div>
    </motion.div>
  )
}

const MetricsSkeleton = () => {
  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col justify-center items-center">
      <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">30%</div>
      <div className="text-sm text-neutral-500 text-center mt-2">Labor Cost Savings</div>
    </motion.div>
  )
}

const TeamSkeleton = () => {
  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row justify-around items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
      ))}
    </motion.div>
  )
}

const cloudKitchensItems = [
  {
    title: "Robotics Systems",
    description: "Led GTM and product vision for autonomous robotics systems",
    header: <RoboticsSkeleton />,
    className: "md:col-span-2",
  },
  {
    title: "Labor Savings",
    description: "Achieved 30% labor savings for facility staff",
    header: <MetricsSkeleton />,
    className: "md:col-span-1",
  },
  {
    title: "Engineering Team",
    description: "Direct a remote team of 10 engineers and designers",
    header: <TeamSkeleton />,
    className: "md:col-span-1",
  }
]

const timelineData = [
  {
    title: '2021 - Present',
    logo: (
      <div className="w-48 space-y-2 py-4">
        <Image
          src={logoCloudKitchens}
          alt="CloudKitchens"
          width={128}
          height={20}
          className="dark:invert object-contain"
        />
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Ghost kitchen technology and operations platform</p>
      </div>
    ),
    content: (
      <div className="pt-4 pb-8">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Product Manager</h2>
        <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem] mb-8">
          {cloudKitchensItems.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={cn(
                "row-span-1 rounded-2xl bg-white p-6 dark:bg-black dark:border-white/[0.1] border border-neutral-200 group/bento hover:shadow-xl hover:shadow-neutral-100/50 dark:hover:shadow-neutral-900/50 transition duration-200",
                "[&>p:text-lg]",
                item.className
              )}
            />
          ))}
        </BentoGrid>
      </div>
    )
  },
  {
    title: '2017 - 2020',
    logo: (
      <div className="w-48 space-y-2 py-4">
        <Image
          src={logoRitual}
          alt="Ritual"
          width={128}
          height={20}
          className="dark:invert object-contain"
        />
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Order-ahead food pickup platform</p>
      </div>
    ),
    content: (
      <div className="pt-4 pb-8">
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Regional General Manager</h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-normal space-y-3 leading-relaxed">
          • Spearheaded operations and growth for 15+ markets including Washington D.C., Boston, and Philadelphia<br/>
          • Acted as liaison between remote product and engineering teams, representing voice of customer<br/>
          • Managed geographically dispersed team of 4 direct reports throughout North America<br/>
          • Orchestrated multi-city promotional campaigns with Apple through cross-functional collaboration
        </p>
      </div>
    )
  },
  {
    title: '2016 - 2017',
    logo: (
      <div className="w-48 space-y-2 py-4">
        <Image
          src={logoCountable}
          alt="Countable"
          width={128}
          height={20}
          className="dark:invert object-contain"
        />
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Civic engagement and legislative tracking app</p>
      </div>
    ),
    content: (
      <div className="pt-4 pb-8">
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Growth Operations Manager @ Countable</h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-normal space-y-3 leading-relaxed">
          • Led marketing and growth strategy for leading iOS/Android civic engagement application<br/>
          • Developed and implemented editorial, support, and marketing initiatives<br/>
          • Streamlined operations using low-code tools<br/>
          • Secured featured placement on App Store multiple times following 2016 election<br/>
          • Orchestrated cross-functional collaborations and established strategic partnerships
        </p>
      </div>
    )
  },
  {
    title: '2014 - 2016',
    logo: (
      <div className="w-48 space-y-2 py-4">
        <Image
          src={logoUber}
          alt="Uber"
          width={128}
          height={20}
          className="dark:invert object-contain"
        />
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Global rideshare and delivery platform</p>
      </div>
    ),
    content: (
      <div className="pt-4 pb-8">
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Launcher @ Uber</h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-normal space-y-3 leading-relaxed">
          • Successfully launched Raleigh-Durham and Charlotte markets, scaling supply and demand<br/>
          • Acted as liaison between local regulators and corporate legal team<br/>
          • Developed partnerships with local businesses and universities (Duke, UNC, NC State)<br/>
          • Led marketing initiatives and demand generation in North Carolina<br/>
          • Executed creative campaigns including Uber Ice Cream and Uber Kittens
        </p>
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
    <SimpleLayout>
      <div className="relative">
        {/* Header section */}
        <div className="relative mb-16">
          <div className="max-w-2xl mx-auto">
            {/* Header content */}
            <div className="relative">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                My Work Experience
              </h1>
              <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                I've built and scaled products at high-growth technology companies, focusing on product management, operations, and growth.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-8" suppressHydrationWarning>
          <Timeline data={timelineData} />
        </div>
      </div>
    </SimpleLayout>
  )
}
