'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatBubbleOvalLeftEllipsisIcon, DocumentArrowDownIcon, LightBulbIcon } from '@heroicons/react/24/outline'

import { SimpleLayout } from '@/components/SimpleLayout'
import { Timeline } from '@/components/ui/timeline'
import { ExpandableCard } from '@/components/ui/expandable-card'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'
import { CompanyInfo } from '@/components/ui/company-info'
import { Separator } from '@/components/ui/separator'
import { CardStack } from '@/components/ui/card-stack'
import { SparklesCore } from '@/components/ui/sparkles'

import { ExpandedContext } from '@/contexts/expanded'

import logoCloudKitchens from '@/images/logos/cloudkitchens.svg'
import logoRitual from '@/images/logos/ritual.svg'
import logoCountable from '@/images/logos/countable.svg'
import logoUber from '@/images/logos/uber.svg'

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

const CompanyDetails = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden text-xs text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
      >
        {isExpanded ? '−' : '+'} info
      </button>
      <Separator className="my-4 hidden md:block" />
      <div className="hidden md:block">
        {children}
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
            className="md:hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      <Separator className="my-4 md:hidden" />
    </div>
  )
}

const cardItems = [
  {
    id: 1,
    visibility: true,
    content: "Jason is terrific. He brings an incredible amount of energy and creativity to his work. He is also incredibly talented, <highlight>a human Swiss army knife</highlight>, bringing an impressive and diverse variety of skills to his work, including: dev. skills, product marketing, GTM, and overall technical prowess.",
    name: "<a href='https://www.linkedin.com/in/bartmyers/' target='_blank' rel='noopener noreferrer'>Bart Myers</a>",
    designation: "CEO, Countable",
    profileImage: "https://media.licdn.com/dms/image/v2/D5603AQFXNth9ysgJnA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1715712288122?e=1742428800&v=beta&t=Da0IlNz1KO77SCyPRUENGzPBKKM3oYHIebbIMdWujw4"
  },
  {
    id: 2,
    visibility: false,
    content: "Jason is a great annoyance, and I cannot wait to no longer work with him.",
    name: "<a href='https://www.linkedin.com/in/felixfritsch/' target='_blank' rel='noopener noreferrer'>Felix Fritsch</a>",
    designation: "Program Manager, CloudKitchens",
    profileImage: "https://media.licdn.com/dms/image/v2/C4E03AQGRJALh_xx5rQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1592484566200?e=1742428800&v=beta&t=_BpmPDKxI1h3AsLeWMOiC-xE31nvhFOtZfWGkZ4RDPc"
  },
  {
    id: 3,
    visibility: true,
    content: "Most PMs excel at strategy, but lack the execution muscle to make it all happen. <highlight>Jason is the exception</highlight>: he rolls up his sleeves and dives in regularly, and is constantly looking for ways to make our customers' lives better. His curiousity and positivity is infectious, and it makes working with him genuinely fun.",
    name: "<a href='https://www.linkedin.com/in/julia-gasbarro-26a2b312b/' target='_blank' rel='noopener noreferrer'>Julia Gasboro</a>",
    designation: "Product Manager, CloudKitchens",
    profileImage: "https://media.licdn.com/dms/image/v2/D5603AQGQTEVtnX59zg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1680572075488?e=1742428800&v=beta&t=DW1g8wjHU4d43CC3dby_8ELRnyEVMUbhqy7eQWOYxbA"
  },
  {
    id: 4,
    visibility: true,
    content: "Jason is one of the most unique Product Managers I've worked with. He always brought a unique opinion to problem-solving, and never let our engineering team lose sight of their impact to the business. Working with Jason felt like being part of something big every single day, and <highlight>any product team would be insanely lucky to have him</highlight>.",
    name: "<a href='https://www.linkedin.com/in/greg-humphreys-0000000000/' target='_blank' rel='noopener noreferrer'>Greg Humphreys</a>",
    designation: "Principal Developer Technology Engineer, NVIDIA",
    profileImage: "https://media.licdn.com/dms/image/v2/C4E03AQGMifQFwL0M3g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1517740280815?e=1742428800&v=beta&t=Rwejvp8rbGa-z1qfDJmxC1F8x0-Rm8WU81azEgUwhj8"
  },
  {
    id: 5,
    visibility: false,
    content: "Jason is a great annoyance, and I cannot wait to no longer work with him.",
    name: "<a href='https://www.linkedin.com/in/aprats/' target='_blank' rel='noopener noreferrer'>Anthony Prats</a>",
    designation: "Co-Founder and CPO, Verve Market",
    profileImage: "https://media.licdn.com/dms/image/v2/D5603AQF7Aq2MWzTC_w/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1725076362743?e=1742428800&v=beta&t=lFIiqsUNQj51GVJ8kbXzXknCgedWDKP6sOnmV18ibio"
  },
  {
    id: 6,
    visibility: false,
    content: "Jason is a great annoyance, and I'm praying someone hires him so he stops texting me.",
    name: "<a href='https://www.linkedin.com/in/davidbogorad/' target='_blank' rel='noopener noreferrer'>David Bogorad</a>",
    designation: "General Manager, Slice",
    profileImage: "https://media.licdn.com/dms/image/v2/C4E03AQG_Vst6_Wy5nA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1517687233989?e=1742428800&v=beta&t=M-oCMvgAT8-M7A3U8ifHgfR2mVpYxV-jx3w_NitcuIw"
  }
]

const timelineData = [
  {
    title: "2021 - Present",
    role: "Product Manager, Facility Technology",
    logo: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-64 space-y-4 py-4"
      >
        <a href="https://www.cloudkitchens.com" target="_blank" rel="noopener noreferrer" className="block h-4 md:h-5">
          <Image
            src={logoCloudKitchens}
            alt="CloudKitchens"
            width={258}
            height={20}
            className="dark:invert object-contain w-auto h-full"
          />
        </a>
        <p className="text-xs text-zinc-500 dark:text-zinc-600 leading-relaxed">Ghost kitchen technology and operations platform</p>
        <CompanyDetails>
          <CompanyInfo 
            industry="Food Tech, Real Estate"
            size="3,000+"
            location="Los Angeles, CA"
            website="https://www.cloudkitchens.com"
          />
        </CompanyDetails>
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
        <div className="text-zinc-600 dark:text-zinc-400 text-sm font-normal leading-relaxed space-y-3">
          <div className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Impact:</div>
          <ul className="list-disc pl-4 space-y-3 leading-snug">
            <li>Took Otter Lockers product offering 0 → 1, growing ARR 150% in 6 months.</li>
            <li>Scaled autonomous robotics systems to 100+ facilities in 18 months while keeping NPS scores above 90.</li>
            <li>Reduced facility technology support escalations by 80% through self-serve ops tooling. </li>
            <li>Contributed 250+ custom Slack emojis, each designed for maximum hilarity.</li>
          </ul>
          <div className="h-px bg-zinc-200 dark:bg-zinc-700/40 my-3" />
          <div className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Responsibilities:</div>
          <ul className="list-disc pl-4 space-y-3 leading-snug">
            <li>Led GTM and product vision, and program management for five distinct product lines.</li>
            <li>Direct a remote team of 10 engineers and designers to ship robotics and food delivery mobile (iOS/Android) and web products</li>
            <li>Led cross-functional </li>
            <li>Pull Developed SQL queries and dashboards, Python, and Zapier/AI tools to help other teams do more with less</li>
            <li>Promoted twice, previously serving as the first Product Operations Manager in the Facility Tech business unit</li>
          </ul>
        </div>
      </motion.div>
    )
  },
  {
    title: "2017 - 2020",
    role: "Regional General Manager",
    logo: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-64 space-y-4 py-4"
      >
        <a href="https://www.ritual.co" target="_blank" rel="noopener noreferrer" className="block h-4 md:h-5">
          <Image
            src={logoRitual}
            alt="Ritual"
            width={172}
            height={20}
            className="dark:invert object-contain w-auto h-full"
          />
        </a>
        <p className="text-xs text-zinc-500 dark:text-zinc-600 leading-relaxed">Order-ahead food pickup platform</p>
        <CompanyDetails>
          <CompanyInfo 
            industry="Food Tech, Consumer"
            size="250+"
            location="Toronto, ON"
            website="https://www.ritual.co"
          />
        </CompanyDetails>
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
        <div className="text-zinc-600 dark:text-zinc-400 text-sm font-normal space-y-3 leading-relaxed">
          • Spearheaded operations and growth for 15+ markets including Washington D.C., Boston, and Philadelphia<br/>
          • Acted as liaison between remote product and engineering teams, representing voice of customer<br/>
          • Managed geographically dispersed team of 4 direct reports throughout North America<br/>
          • Orchestrated multi-city promotional campaigns with Apple through cross-functional collaboration
        </div>
      </motion.div>
    )
  },
  {
    title: "2016 - 2017",
    role: "Growth Operations Manager",
    logo: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-64 space-y-4 py-4"
      >
        <a href="https://www.countable.us" target="_blank" rel="noopener noreferrer" className="block h-4 md:h-5">
          <Image
            src={logoCountable}
            alt="Countable"
            width={300}
            height={40}
            className="dark:invert object-contain w-auto h-full"
          />
        </a>
        <p className="text-xs text-zinc-500 dark:text-zinc-600 leading-relaxed">Civic engagement and legislative tracking app</p>
        <CompanyDetails>
          <CompanyInfo 
            industry="Civic Tech, Consumer"
            size="50+"
            location="San Francisco, CA"
            website="https://www.countable.us"
          />
        </CompanyDetails>
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
        <div className="text-zinc-600 dark:text-zinc-400 text-sm font-normal leading-relaxed space-y-3">
          <div className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Impact:</div>
          <ul className="list-disc pl-4 space-y-3 leading-snug">
            <li>Secured featured placement on App Store multiple times following 2016 election</li>
            <li>Streamlined operations resulting in 40% reduction in support tickets</li>
          </ul>
          <div className="h-px bg-zinc-200 dark:bg-zinc-700/40 my-3" />
          <div className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Responsibilities:</div>
          <ul className="list-disc pl-4 space-y-3 leading-snug">
            <li>Led marketing and growth strategy for leading iOS/Android civic engagement application</li>
            <li>Developed and implemented editorial, support, and marketing initiatives</li>
            <li>Streamlined operations using low-code tools</li>
            <li>Orchestrated cross-functional collaborations and established strategic partnerships</li>
          </ul>
        </div>
      </motion.div>
    )
  },
  {
    title: "2014 - 2016",
    role: "Launcher @ Uber",
    logo: (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-64 space-y-4 py-4"
      >
        <a href="https://www.uber.com" target="_blank" rel="noopener noreferrer" className="block h-4 md:h-5">
          <Image
            src={logoUber}
            alt="Uber"
            width={120}
            height={30}
            className="dark:invert object-contain w-auto h-full"
          />
        </a>
        <p className="text-xs text-zinc-500 dark:text-zinc-600 leading-relaxed">Global rideshare and delivery platform</p>
        <CompanyDetails>
          <CompanyInfo 
            industry="Marketplace, Consumer"
            size="10,000+"
            location="San Francisco, CA"
            website="https://www.uber.com"
          />
        </CompanyDetails>
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
        <div className="text-zinc-600 dark:text-zinc-400 text-sm font-normal leading-relaxed space-y-3">
          <div className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Impact:</div>
          <ul className="list-disc pl-4 space-y-3 leading-snug">
            <li>Successfully launched and scaled two major markets in North Carolina</li>
            <li>Established key partnerships with major universities and businesses</li>
          </ul>
          <div className="h-px bg-zinc-200 dark:bg-zinc-700/40 my-3" />
          <div className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Responsibilities:</div>
          <ul className="list-disc pl-4 space-y-3 leading-snug">
            <li>Led market launches in Raleigh-Durham and Charlotte</li>
            <li>Acted as liaison between local regulators and corporate legal team</li>
            <li>Developed partnerships with local businesses and universities (Duke, UNC, NC State)</li>
            <li>Led marketing initiatives and demand generation in North Carolina</li>
            <li>Executed creative campaigns including Uber Ice Cream and Uber Kittens</li>
          </ul>
        </div>
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

  const handleFaqOpen = (value) => {
    if (value) {
      const questions = {
        'item-1': 'What type of roles are you interested in?',
        'item-2': 'What\'s your management style?',
        'item-3': 'How do you approach product development?',
        'item-4': 'What\'s your experience with remote teams?',
        'item-5': 'What industries have you worked in?'
      }
      const event = new CustomEvent('openpanel', { 
        detail: { question: questions[value] }
      })
      window.dispatchEvent(event)
    }
  }

  return (
    <ExpandedContext.Provider value={{ isExpanded, setIsExpanded }}>
      <SimpleLayout>
        <div className="relative">
          {/* Header section */}
          <div className="relative mb-32">
            <div className="flex flex-col md:grid md:grid-cols-[1fr_500px] gap-8 items-start md:items-center">
              <div className="w-full max-w-xl">
                <div className="relative">
                  <div className="overflow-hidden min-h-[3.5rem]">
                    <motion.h1 
                      className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                    >
                      What I've done.
                    </motion.h1>
                  </div>
                  <div className="overflow-hidden min-h-[3.5rem] -mt-2">
                    <motion.h1 
                      className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1, ease: [0.33, 1, 0.68, 1] }}
                    >
                      Where I've done it.
                    </motion.h1>
                  </div>
                  <div className="overflow-hidden min-h-[3.5rem] -mt-2">
                    <motion.h1 
                      className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 2.5, ease: [0.33, 1, 0.68, 1] }}
                    >
                      Why it mattered.
                    </motion.h1>
                  </div>
                  <motion.p 
                    className="mt-6 text-base text-zinc-600 dark:text-zinc-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 3.5 }}
                  >
                    I've built and scaled products at high-growth technology companies, focusing on product management, operations, and growth.
                  </motion.p>
                  <motion.div 
                    className="mt-6 flex gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 3.5 }}
                  >
                    <button
                      type="button"
                      className="inline-flex items-center gap-x-2 rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = '/files/Jason_Weingardt_CV.pdf';
                        link.download = 'Jason_Weingardt_CV.pdf';
                        link.click();
                      }}
                    >
                      Download CV
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const event = new Event('toggle-contact-drawer');
                        window.dispatchEvent(event);
                      }}
                      className="inline-flex items-center gap-x-2 rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                      Contact
                    </button>
                    <a
                      href="#faqs"
                      type="button"
                      className="inline-flex items-center gap-x-2 rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                      onClick={(e) => {
                        e.preventDefault();
                        const faqsSection = document.getElementById('faqs');
                        if (faqsSection) {
                          faqsSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      FAQ's
                    </a>
                  </motion.div>
                </div>
              </div>
              <motion.div 
                className="relative w-full md:w-[500px] pt-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 4 }}
              >
                <CardStack items={cardItems} offset={10} scaleFactor={0.06} />
              </motion.div>
            </div>
          </div>

          {/* Divider */}
          <motion.div 
            className="h-px bg-zinc-200 dark:bg-zinc-800 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 3.5 }}
          />

          {/* Timeline */}
          <motion.div 
            className="space-y-8" 
            suppressHydrationWarning
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 3.5 }}
          >
            <Timeline data={timelineData} />
          </motion.div>

          {/* FAQs Section */}
          <motion.div 
            id="faqs" 
            className="mt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 3.5 }}
          >
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 mb-8" />
            <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-3xl mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion 
              type="single" 
              collapsible 
              className="w-full"
              defaultValue="item-1"
              onValueChange={handleFaqOpen}
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>What type of roles are you interested in?</AccordionTrigger>
                <AccordionContent>
                  I'm primarily interested in product management roles focused on emerging technologies like robotics, AI/ML, and automation. I enjoy working on complex technical products that solve real operational challenges.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How do you work?</AccordionTrigger>
                <AccordionContent>
                  I believe in empowering teams through clear communication, setting measurable goals, and fostering an environment of continuous learning. I focus on removing blockers and ensuring team members have the resources they need to succeed.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>How do you approach product development?</AccordionTrigger>
                <AccordionContent>
                  My approach combines data-driven decision making with strong user empathy. I start by deeply understanding user needs and business objectives, then iterate quickly with continuous feedback loops. I believe in shipping early and often, while maintaining high quality standards.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>What's your experience with remote teams?</AccordionTrigger>
                <AccordionContent>
                  I have extensive experience managing remote and distributed teams across different time zones. I've developed effective strategies for asynchronous communication, documentation, and collaboration that maintain high productivity and team cohesion.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Your journey seems to be a bit of a rollercoaster. Where do you see yourself in 5 years?</AccordionTrigger>
                <AccordionContent>
                  If you're asking this question, you're probably better off hearing it from me directly. Want to get in touch? Let's find a time to <a href="/meet" className="text-zinc-800 dark:text-zinc-200 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">chat</a>.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 3.5 }}
          >
            <div className="relative overflow-hidden bg-black rounded-3xl">
              <SparklesCore
                className="absolute inset-0 h-full w-full"
                particleColor="rgba(255, 255, 255, 0.3)"
                particleDensity={50}
                speed={1.5}
                minSize={0.8}
                maxSize={1.9}
              />
              <div className="px-6 py-16 sm:px-6 sm:py-24 lg:px-8 relative">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    Let's build something awesome.
                  </h2>
                  <p className="mx-auto mt-6 max-w-xl text-pretty text-lg/8 text-zinc-300">
                    I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology and product development.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const event = new Event('toggle-contact-drawer');
                        window.dispatchEvent(event);
                      }}
                      className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Send a message
                    </button>
                    <a 
                      href="/meet" 
                      className="text-sm font-semibold text-zinc-300 hover:text-white"
                    >
                      Schedule a call <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </SimpleLayout>
    </ExpandedContext.Provider>
  )
}
