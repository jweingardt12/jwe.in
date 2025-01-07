'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { SimpleLayout } from '../../components/SimpleLayout'
import { Timeline } from '../../components/ui/timeline'
import { ExpandableCard } from '../../components/ui/expandable-card'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { createContext } from 'react'

export const ExpandedContext = createContext({
  isExpanded: false,
  setIsExpanded: () => {},
});

const logoCloudKitchens = '/images/logos/cloudkitchens.svg'
const logoRitual = '/images/logos/ritual.svg'
const logoCountable = '/images/logos/countable.svg'
const logoUber = '/images/logos/uber.svg'

const RoboticsSkeleton = () => {
  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="relative w-full h-[140px] overflow-hidden"
    >
      <Image
        src="/images/photos/robots.jpg"
        alt="Robotics facility with delivery robots"
        fill
        className="object-cover"
        priority
      />
    </motion.div>
  )
}

const MetricsSkeleton = () => {
  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="relative w-full h-[140px] overflow-hidden flex flex-col justify-center items-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">30%</div>
      <div className="text-base text-neutral-500 text-center mt-2">Labor Cost Savings</div>
    </motion.div>
  )
}

const TeamSkeleton = () => {
  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="relative w-full h-[140px] overflow-hidden flex flex-col justify-center items-center bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900/20 dark:to-neutral-800/20">
      <div className="flex space-x-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600" />
        ))}
      </div>
    </motion.div>
  )
}

const cloudKitchensItems = [
  {
    title: "Robotics Systems",
    description: "Led GTM and product vision for autonomous robotics systems",
    header: <RoboticsSkeleton />,
    content: (
      <div className="text-zinc-600 dark:text-zinc-400 text-sm space-y-3">
        <ul className="list-disc pl-4 space-y-2">
          <li>Led product vision and strategy for autonomous robotics systems</li>
          <li>Developed and executed GTM strategy for facility automation</li>
          <li>Achieved significant operational efficiency improvements</li>
          <li>Collaborated with engineering teams on technical implementation</li>
        </ul>
      </div>
    ),
    className: "md:col-span-2",
  },
  {
    title: "Labor Savings",
    description: "Achieved 30% labor savings for facility staff",
    header: <MetricsSkeleton />,
    content: (
      <div className="text-zinc-600 dark:text-zinc-400 text-sm space-y-3">
        <ul className="list-disc pl-4 space-y-2">
          <li>Implemented automation solutions reducing manual labor needs</li>
          <li>Optimized staff scheduling and resource allocation</li>
          <li>Tracked and analyzed labor efficiency metrics</li>
          <li>Maintained high quality standards while reducing costs</li>
        </ul>
      </div>
    ),
    className: "md:col-span-1",
  }
]

const timelineData = [
  {
    title: <span className="text-lg">2021 - Present</span>,
    logo: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-48 space-y-2 py-4"
      >
        <Image
          src={logoCloudKitchens}
          alt="CloudKitchens"
          width={128}
          height={40}
          className="dark:invert object-contain"
        />
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Ghost kitchen technology and operations platform</p>
      </motion.div>
    ),
    content: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pt-4 pb-8"
      >
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Product Manager</h2>
        <div className="text-zinc-600 dark:text-zinc-400 text-sm font-normal leading-relaxed mb-8">
          <ul className="list-disc pl-4 space-y-2">
            <li>Led GTM and product vision for autonomous robotics systems at CloudKitchens-owned facilities, resulting in 30% labor savings for facility staff</li>
            <li>Direct a remote team of 10 engineers and designers to ship robotics and food delivery mobile (iOS/Android) and web products to global facility and brick-and-mortar customers</li>
            <li>Led the creation of self-serve robotics management tooling, saving 200 hours of manual engineering and CS time per month</li>
            <li>Developed delivery supply-class optimization improvements in the LATAM market, resulting in 30% cost savings and reduced operations team oversight</li>
            <li>Developed SQL queries and dashboards, Python, and Zapier/AI tools to help other teams do more with less</li>
            <li>Promoted twice, previously serving as the first Product Operations Manager in the Facility Tech business unit</li>
          </ul>
        </div>
        <div className="h-px bg-zinc-200 dark:bg-zinc-800 mb-8" />
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-8">Projects</h3>
        <div className="space-y-4 max-w-3xl">
          {cloudKitchensItems.map((item, i) => (
            <ExpandableCard
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className="w-full"
            >
              {item.content}
            </ExpandableCard>
          ))}
        </div>
      </motion.div>
    )
  },
  {
    title: <span className="text-lg">2017 - 2020</span>,
    logo: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-48 space-y-2 py-4"
      >
        <Image
          src={logoRitual}
          alt="Ritual"
          width={128}
          height={20}
          className="dark:invert object-contain"
        />
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Order-ahead food pickup platform</p>
      </motion.div>
    ),
    content: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pt-4 pb-8"
      >
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Regional General Manager</h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-normal space-y-3 leading-relaxed">
          • Spearheaded operations and growth for 15+ markets including Washington D.C., Boston, and Philadelphia<br/>
          • Acted as liaison between remote product and engineering teams, representing voice of customer<br/>
          • Managed geographically dispersed team of 4 direct reports throughout North America<br/>
          • Orchestrated multi-city promotional campaigns with Apple through cross-functional collaboration
        </p>
      </motion.div>
    )
  },
  {
    title: <span className="text-lg">2016 - 2017</span>,
    logo: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-48 space-y-2 py-4"
      >
        <Image
          src={logoCountable}
          alt="Countable"
          width={128}
          height={20}
          className="dark:invert object-contain"
        />
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Civic engagement and legislative tracking app</p>
      </motion.div>
    ),
    content: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pt-4 pb-8"
      >
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Growth Operations Manager @ Countable</h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-normal space-y-3 leading-relaxed">
          • Led marketing and growth strategy for leading iOS/Android civic engagement application<br/>
          • Developed and implemented editorial, support, and marketing initiatives<br/>
          • Streamlined operations using low-code tools<br/>
          • Secured featured placement on App Store multiple times following 2016 election<br/>
          • Orchestrated cross-functional collaborations and established strategic partnerships
        </p>
      </motion.div>
    )
  },
  {
    title: <span className="text-lg">2014 - 2016</span>,
    logo: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-48 space-y-2 py-4"
      >
        <Image
          src={logoUber}
          alt="Uber"
          width={128}
          height={20}
          className="dark:invert object-contain"
        />
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Global rideshare and delivery platform</p>
      </motion.div>
    ),
    content: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pt-4 pb-8"
      >
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Launcher @ Uber</h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-normal space-y-3 leading-relaxed">
          • Successfully launched Raleigh-Durham and Charlotte markets, scaling supply and demand<br/>
          • Acted as liaison between local regulators and corporate legal team<br/>
          • Developed partnerships with local businesses and universities (Duke, UNC, NC State)<br/>
          • Led marketing initiatives and demand generation in North Carolina<br/>
          • Executed creative campaigns including Uber Ice Cream and Uber Kittens
        </p>
      </motion.div>
    )
  }
]

export default function Work() {
  const [mounted, setMounted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ExpandedContext.Provider value={{ isExpanded, setIsExpanded }}>
      <SimpleLayout>
        <div className="relative">
          {/* Header section */}
          <div className="relative mb-16">
            <div className="max-w-2xl">
              {/* Header content */}
              <div className="relative">
                <div className="overflow-hidden">
                  <motion.h1 
                    className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                  >
                    What I've done.
                  </motion.h1>
                </div>
                <div className="overflow-hidden">
                  <motion.h1 
                    className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, delay: 1, ease: [0.33, 1, 0.68, 1] }}
                  >
                    Where I've done it.
                  </motion.h1>
                </div>
                <div className="overflow-hidden">
                  <motion.h1 
                    className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, delay: 2, ease: [0.33, 1, 0.68, 1] }}
                  >
                    Why it mattered.
                  </motion.h1>
                </div>
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
    </ExpandedContext.Provider>
  )
}
