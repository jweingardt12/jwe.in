'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatBubbleOvalLeftEllipsisIcon, DocumentArrowDownIcon, LightBulbIcon } from '@heroicons/react/24/outline'
import { useSearchParams } from 'next/navigation'

import { SimpleLayout } from '@/components/SimpleLayout'
import { Timeline } from '@/components/ui/timeline'
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
    content: "Jason is one of the most unique Product Managers I've worked with. He never let our engineering team lose sight of their impact to the business, and cared deeply for the problems of our customers. <highlight>Any product team would be insanely lucky to have him</highlight>.",
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

const TldrCard = ({ jobData, isLoading }) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-white/5 dark:bg-white/10 shadow-lg border-2 border-purple-300/30 dark:border-purple-500/30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-transparent dark:from-purple-900/20 dark:via-transparent dark:to-transparent" />
        <SparklesCore
          className="absolute inset-0 h-full w-full"
          particleColor="rgba(168, 85, 247, 0.4)"
          particleDensity={100}
          speed={0.5}
          minSize={0.8}
          maxSize={1.4}
        />
        <div className="relative p-5">
          <div className="relative flex flex-col mb-4">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 pr-8">
                ✨ Jason's a fit for your role because...
              </h3>
              <div className="group relative">
                <div className="text-sm text-purple-400 dark:text-purple-300 cursor-help">?</div>
                <div className="absolute right-0 w-48 px-2 py-1 bg-white dark:bg-zinc-800 rounded shadow-lg text-xs text-zinc-600 dark:text-zinc-300 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-10">
                  This content is generated by AI based on your job posting
                </div>
              </div>
            </div>
          </div>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-purple-100/50 dark:bg-purple-900/30 rounded w-3/4" />
            <div className="space-y-2">
              <div className="h-3 bg-purple-100/50 dark:bg-purple-900/30 rounded w-5/6" />
              <div className="h-3 bg-purple-100/50 dark:bg-purple-900/30 rounded w-4/6" />
              <div className="h-3 bg-purple-100/50 dark:bg-purple-900/30 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - only show if we have valid data
  if (jobData && !jobData.error) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-white/5 dark:bg-white/10 shadow-lg border-2 border-purple-300/30 dark:border-purple-500/30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-transparent dark:from-purple-900/20 dark:via-transparent dark:to-transparent" />
        <div className="relative p-4">
          <div className="relative flex flex-col mb-2">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 pr-8">
                ✨ TL;DR - Why I'm a Great Fit for {jobData.companyName || 'this role'}
              </h3>
              <div className="group relative">
                <div className="text-sm text-purple-400 dark:text-purple-300 cursor-help">?</div>
                <div className="absolute right-0 w-48 px-2 py-1 bg-white dark:bg-zinc-800 rounded shadow-lg text-xs text-zinc-600 dark:text-zinc-300 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-10">
                  This content is generated by AI based on your job posting
                </div>
              </div>
            </div>
            {jobData.jobTitle && (
              <p className="text-sm text-purple-600/80 dark:text-purple-300/80 mt-0.5">
                {jobData.jobTitle}
              </p>
            )}
          </div>
          <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">
            {jobData.introText}
          </p>
          <ul className="space-y-1.5">
            {jobData.bulletPoints.map((point, index) => {
              const [headline, ...rest] = point.split('**').filter(Boolean);
              const content = rest.join('').replace(':', '');
              
              return (
                <li 
                  key={index}
                  className="flex items-start gap-1.5 text-sm"
                >
                  <span className="text-purple-500 dark:text-purple-400 mt-1 text-xs">■</span>
                  <div>
                    <span className="font-semibold text-purple-900 dark:text-purple-100">
                      {headline}
                    </span>
                    <span className="text-zinc-600 dark:text-zinc-300 ml-1">
                      {content}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          {jobData.relevantSkills?.length > 0 && (
            <div className="mt-2 pt-2 border-t border-purple-100/30 dark:border-purple-500/30">
              <div className="flex flex-wrap gap-1">
                {jobData.relevantSkills.map((skill, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-purple-50/50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200/50 dark:border-purple-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

const WorkContent = () => {
  const [mounted, setMounted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [jobData, setJobData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidJobId, setIsValidJobId] = useState(false)
  const searchParams = useSearchParams()
  const jobId = searchParams.get('job')

  useEffect(() => {
    const initializePage = async () => {
      setMounted(true)
      
      if (jobId?.trim()) {
        setIsLoading(true)
        setIsValidJobId(false)
        setJobData(null)
        console.log('Fetching job data for ID:', jobId)
        
        try {
          // Start loading timer
          const loadingStartTime = Date.now()
          
          const response = await fetch(`/api/analyze-job?id=${jobId}`)
          console.log('API Response status:', response.status)
          const data = await response.json()
          console.log('API Response data:', data)
          
          if (response.ok && !data.error) {
            // Ensure we have all required fields
            if (data.jobTitle && 
                data.companyName && 
                data.introText && 
                data.bulletPoints?.length >= 3 && 
                data.relevantSkills?.length) {
              
              // Calculate remaining time to meet minimum loading duration
              const loadingEndTime = Date.now()
              const loadingDuration = loadingEndTime - loadingStartTime
              const remainingTime = Math.max(0, 2500 - loadingDuration)
              
              // Wait for remaining time if needed
              await new Promise(resolve => setTimeout(resolve, remainingTime))
              
              setJobData(data)
              setIsValidJobId(true)
              setIsLoading(false)
              return
            }
          }
          
          // For error cases, also ensure minimum loading time
          const loadingEndTime = Date.now()
          const loadingDuration = loadingEndTime - loadingStartTime
          const remainingTime = Math.max(0, 2500 - loadingDuration)
          
          await new Promise(resolve => setTimeout(resolve, remainingTime))
          
          // If we don't have valid data, just set loading to false
          setIsLoading(false)
        } catch (error) {
          console.error('Error fetching job analysis:', error)
          // Ensure minimum loading time even for errors
          const loadingEndTime = Date.now()
          const loadingDuration = loadingEndTime - loadingStartTime
          const remainingTime = Math.max(0, 2500 - loadingDuration)
          
          await new Promise(resolve => setTimeout(resolve, remainingTime))
          
          setIsLoading(false)
        }
      }
    }

    initializePage()
  }, [jobId])

  if (!mounted) return null

  return (
    <ExpandedContext.Provider value={{ isExpanded, setIsExpanded }}>
      <SimpleLayout>
        <div className={`space-y-20 sm:space-y-32 ${(isValidJobId || (isLoading && !jobData?.error)) ? 'pt-4' : 'mt-16 sm:mt-32'}`}>
          {(isValidJobId || (isLoading && !jobData?.error)) && 
            <TldrCard jobData={jobData} isLoading={isLoading} />
          }

          <div>
            <div className="flex max-w-7xl flex-col md:flex-row md:items-start md:justify-between md:gap-x-8">
              <div className="flex-1 space-y-16">
                <div className="relative">
                  <div className="space-y-1">
                    <motion.h1 
                      className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl lg:text-5xl"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                    >
                      What I've done.
                    </motion.h1>
                    <motion.h1 
                      className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl lg:text-5xl"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1, ease: [0.33, 1, 0.68, 1] }}
                    >
                      Where I've done it.
                    </motion.h1>
                    <motion.h1 
                      className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl lg:text-5xl"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 2, ease: [0.33, 1, 0.68, 1] }}
                    >
                      Why it mattered.
                    </motion.h1>
                  </div>
                  <div className="overflow-hidden min-h-[3.5rem] mb-2">
                    <motion.p 
                      className="mt-6 text-base text-zinc-600 dark:text-zinc-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 3.5 }}
                    >
                      I've built and scaled products at high-growth technology companies, focusing on product management, operations, and custom Slack emoji output.
                    </motion.p>
                  </div>
                  <motion.div 
                    className="mt-6 flex items-center gap-x-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 3.5 }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const event = new Event('toggle-contact-drawer');
                        window.dispatchEvent(event);
                      }}
                      className="rounded-md bg-black px-6 py-3 text-base font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                      Send a message
                    </button>
                    <a
                      href="#faqs"
                      onClick={(e) => {
                        e.preventDefault();
                        const faqsSection = document.getElementById('faqs');
                        if (faqsSection) {
                          faqsSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="text-base font-medium text-zinc-600 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-white"
                    >
                      Read FAQ's <span aria-hidden="true">→</span>
                    </a>
                  </motion.div>
                </div>
              </div>
              <motion.div 
                className="relative w-full md:w-[500px] mt-8 md:mt-0"
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
                  I'm interested in Product Management/Product Operations roles in the software industry. I'm looking for an opportunity to work in an area I'm passionate about, and I'm open to working remotely or in a hybrid environment in the Washington, DC area.
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
                  It starts with a clear understanding of the problem and the user. I then iterate quickly with continuous feedback loops. I believe in shipping early and often, and keeping folks in the loop along the way. Anything critical always gets stakeholder buy-in to reduce surprises and risk.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>What's your experience with remote teams?</AccordionTrigger>
                <AccordionContent>
                  I've been a remote employee at CloudKitchens for the past 4+ years, and I've managed product teams remotely during that time. I've greatly enjoyed the flexibility and freedom that come with remote work, but I'm also a big fan of in-person collaboration. I've been able to have a bit of both during this time, and I'm open to keeping that balance going.
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

// Loading fallback component
const WorkLoading = () => {
  return (
    <SimpleLayout>
      <div className="animate-pulse space-y-8">
        <div className="h-[300px] bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
        <div className="space-y-6">
          <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-1/4" />
          <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-2/3" />
          <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2" />
        </div>
      </div>
    </SimpleLayout>
  )
}

export default function Work() {
  return (
    <Suspense fallback={<WorkLoading />}>
      <WorkContent />
    </Suspense>
  )
}
