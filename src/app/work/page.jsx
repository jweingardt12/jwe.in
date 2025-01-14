'use client'

import React, { useState, useEffect } from 'react'
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
  if (!jobData && !isLoading) return null;

  // Loading state with sparkles
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
                ✨ Analyzing your fit...
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

  // Handle error state
  if (jobData.error) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 p-6 border-2 border-rose-300/30 dark:border-rose-500/30">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-rose-100/20 dark:from-rose-900/20 dark:to-rose-800/10 opacity-50" />
        <div className="relative">
          <div className="relative flex flex-col mb-4">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 pr-8">
                ✨ TL;DR - Why I'm a Great Fit for this role
              </h3>
              <div className="group relative">
                <div className="text-sm text-zinc-400 dark:text-zinc-300 cursor-help">?</div>
                <div className="absolute right-0 w-48 px-2 py-1 bg-white dark:bg-zinc-800 rounded shadow-lg text-xs text-zinc-600 dark:text-zinc-300 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-10">
                  This content is generated by AI based on your job posting
                </div>
              </div>
            </div>
            <p className="text-sm text-rose-600 dark:text-rose-400">
              Error: {jobData.error}
            </p>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Unable to generate bullet points due to a lack of specific job posting details.
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              N/A
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Regular success state
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
        {jobData.bulletPoints?.length > 0 ? (
          <>
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">
              {jobData.introText || "Based on my experience scaling products and driving growth, I'm particularly well-suited for this role because:"}
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
          </>
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No matching points found.
          </p>
        )}
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
};

export default function Work() {
  const [mounted, setMounted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [jobData, setJobData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const initializePage = async () => {
      setMounted(true)
      const jobUrl = searchParams.get('job')
      
      if (jobUrl) {
        setIsLoading(true)
        try {
          const response = await fetch('/api/analyze-job', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jobUrl }),
          })
          
          if (!response.ok) throw new Error('Failed to analyze job')
          
          const data = await response.json()
          setJobData(data)
        } catch (error) {
          console.error('Error analyzing job:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    initializePage()
  }, [searchParams])

  if (!mounted) return null

  if (searchParams.get('job') && isLoading) {
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
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Ghost kitchen technology and operations platform</p>
          <CompanyDetails>
            <CompanyInfo 
              industry="Food Tech, Real Estate"
              size="3,000+"
              location="Los Angeles, CA"
              website="https://www.cloudkitchens.com"
              tools={[
                "SQL",
                "Mixpanel",
                "Jira",
                "Slack",
                "Zapier",
                "Looker",
                "Figma",
                "Python",
                "G-Suite"
              ]}
              headlines={[
                {
                  title: "Uber Founder Envisions 'Internet Food Court' Future",
                  url: "https://foodondemand.com/05082024/uber-co-founder-travis-kalanick-envisions-internet-food-court-future/",
                  publication: "Food On Demand"
                },
                {
                  title: "CloudKitchens Raises $850M at $15B Valuation",
                  url: "https://www.wsj.com/articles/uber-co-founder-travis-kalanicks-cloudkitchens-valued-at-15-billion-in-new-funding-11636137601",
                  publication: "Wall Street Journal"
                },
                {
                  title: "The Rise of Ghost Kitchens",
                  url: "https://www.nytimes.com/2019/08/14/technology/uber-ghost-kitchen.html",
                  publication: "New York Times"
                }
              ]}
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
              {jobData?.companyMatches?.CloudKitchens?.impact?.map((point, index) => (
                <li key={index} className="text-emerald-700 dark:text-emerald-400">{point}</li>
              )) || (
                <>
                  <li>Took Otter Lockers product 0 → 1, growing ARR 150% in 6 months.</li>
                  <li>Scaled autonomous robotics systems to 100+ facilities in 18 months while keeping NPS scores above 90.</li>
                  <li>Reduced facility technology support escalations by 80% through self-serve ops tooling. </li>
                  <li>Contributed 250+ custom Slack emojis, each designed for maximum hilarity.</li>
                </>
              )}
            </ul>
            <div className="h-px bg-zinc-200 dark:bg-zinc-700/40 my-3" />
            <div className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Responsibilities:</div>
            <ul className="list-disc pl-4 space-y-3 leading-snug">
              {jobData?.companyMatches?.CloudKitchens?.responsibilities?.map((point, index) => (
                <li key={index} className="text-emerald-700 dark:text-emerald-400">{point}</li>
              )) || (
                <>
                  <li>Led GTM and product vision, and program management for five distinct product lines.</li>
                  <li>Direct a remote team of 10 engineers, designers, and data scientists to ship robotics and food delivery mobile (iOS/Android) and web products</li>
                  <li>Connect with all customer and stakeholder segments to understand their needs and drive product development and planning.</li>
                  <li>Pull Developed SQL queries and dashboards, Python, and Zapier/AI tools to help other teams do more with less</li>
                  <li>Promoted twice, previously serving as the first Product Operations Manager in the Facility Tech business unit</li>
                </>
              )}
            </ul>
          </div>
        </motion.div>
      )
    },
    {
      title: "2017 - 2020",
      role: "Regional Manager",
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
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Order-ahead food pickup platform for iOS/Android</p>
          <CompanyDetails>
            <CompanyInfo 
              industry="Food Tech, Consumer"
              size="250+"
              location="Toronto, ON"
              website="https://www.ritual.co"
              tools={[
                "SQL",
                "Salesforce",
                "Looker",
                "Zendesk",
                "Jira",
                "Asana",
                "Slack",
                "Zapier"
              ]}
              headlines={[
                {
                  title: "Ritual Raises $70M Series C to Scale Platform",
                  url: "https://techcrunch.com/2018/06/12/ritual-raises-70m-to-add-social-element-to-take-out-ordering/",
                  publication: "TechCrunch"
                },
                {
                  title: "Ritual Teams Up with Apple to Expand Mobile Ordering",
                  url: "https://betakit.com/ritual-teams-up-with-apple-to-expand-mobile-ordering-platform/",
                  publication: "BetaKit"
                }
              ]}
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
            <div className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Impact:</div>
            <ul className="list-disc pl-4 space-y-3 leading-snug">
              {jobData?.companyMatches?.Ritual?.impact?.map((point, index) => (
                <li key={index} className="text-emerald-700 dark:text-emerald-400">{point}</li>
              )) || (
                <>
                  <li>Grew monthly active users by 300% across 15+ markets in first year</li>
                  <li>Increased restaurant partner retention by 40% through improved operational practices and support</li>
                  <li>Launched and scaled operations in 3 major US markets with $1M+ monthly GMV each</li>
                  <li>Built and managed a team of 4 City Managers across North America</li>
                </>
              )}
            </ul>
            <div className="h-px bg-zinc-200 dark:bg-zinc-700/40 my-3" />
            <div className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Responsibilities:</div>
            <ul className="list-disc pl-4 space-y-3 leading-snug">
              {jobData?.companyMatches?.Ritual?.responsibilities?.map((point, index) => (
                <li key={index} className="text-emerald-700 dark:text-emerald-400">{point}</li>
              )) || (
                <>
                  <li>Led operations and growth strategy for 15+ markets including Washington D.C., Boston, and Philadelphia</li>
                  <li>Served as voice of customer to product and engineering teams, influencing roadmap priorities</li>
                  <li>Managed geographically dispersed team of city managers throughout North America</li>
                  <li>Orchestrated multi-city promotional campaigns with Apple, driving significant user acquisition</li>
                  <li>Developed and executed local marketing strategies to drive both supply and demand growth</li>
                </>
              )}
            </ul>
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
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Civic engagement and legislative tracking app</p>
          <CompanyDetails>
            <CompanyInfo 
              industry="Civic Tech, Consumer"
              size="50+"
              location="San Francisco, CA"
              website="https://www.countable.us"
              tools={[
                "React Native",
                "Mixpanel",
                "Intercom",
                "Amplitude",
                "Segment",
                "Jira"
              ]}
              headlines={[
                {
                  title: "Countable Helps Citizens Track Congress",
                  url: "https://techcrunch.com/2017/03/15/countable-brings-its-political-activism-tools-to-a-new-app/",
                  publication: "TechCrunch"
                },
                {
                  title: "Pocket Democracy: Countable",
                  url: "https://www.theverge.com/2017/2/14/14603226/political-apps-congress-votespotter-we-the-people-voter-countable",
                  publication: "The Verge"
                }
              ]}
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
              {jobData?.companyMatches?.Countable?.impact?.map((point, index) => (
                <li key={index} className="text-emerald-700 dark:text-emerald-400">{point}</li>
              )) || (
                <>
                  <li>Secured featured placement on App Store multiple times following 2016 election</li>
                  <li>Led D.C. business development efforts, pitching and closing partnerships with nonprofits and NGOs representing 150%+ growth</li>
                  <li>Created editorital practices and content to drive user acquisition and engagement</li>
                </>
              )}
            </ul>
            <div className="h-px bg-zinc-200 dark:bg-zinc-700/40 my-3" />
            <div className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Responsibilities:</div>
            <ul className="list-disc pl-4 space-y-3 leading-snug">
              {jobData?.companyMatches?.Countable?.responsibilities?.map((point, index) => (
                <li key={index} className="text-emerald-700 dark:text-emerald-400">{point}</li>
              )) || (
                <>
                  <li>Led marketing and growth strategy for leading iOS/Android civic engagement application</li>
                  <li>Developed and implemented editorial, support, and marketing initiatives</li>
                  <li>Streamlined operations using low-code tools</li>
                  <li>Orchestrated cross-functional collaborations and established strategic partnerships</li>
                </>
              )}
            </ul>
          </div>
        </motion.div>
      )
    },
    {
      title: "2014 - 2016",
      role: "Launcher/Marketing/Operations Manager",
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
              width={200}
              height={70}
              className="dark:invert object-contain w-auto h-full"
            />
          </a>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Global rideshare and delivery platform</p>
          <CompanyDetails>
            <CompanyInfo 
              industry="Marketplace, Consumer"
              size="10,000+"
              location="San Francisco, CA"
              website="https://www.uber.com"
              tools={[
                "SQL",
                "Python",
                "Salesforce",
                "Zendesk",
                "Google Analytics",
                "Jira"
              ]}
              headlines={[
                {
                  title: "Uber Expands to North Carolina",
                  url: "https://www.bizjournals.com/triangle/news/2014/04/24/uber-launches-in-raleigh-durham-chapel-hill.html",
                  publication: "Triangle Business Journal"
                },
                {
                  title: "Duke Extends Program for Free Uber Rides",
                  url: "https://today.duke.edu/2016/08/duke-extends-program-free-uber-rides",
                  publication: "Duke Today"
                },
                {
                  title: "Need a treat? Uber Ice Cream is coming to Raleigh",
                  url: "https://www.bizjournals.com/triangle/morning_call/2015/07/uber-ice-cream-raleigh-durham-nc-lumpys.html",
                  publication: "Triangle Business Journal"
                }
              ]}
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
              {jobData?.companyMatches?.Uber?.impact?.map((point, index) => (
                <li key={index} className="text-emerald-700 dark:text-emerald-400">{point}</li>
              )) || (
                <>
                  <li>Successfully launched and scaled two major markets in North Carolina</li>
                  <li>Established key partnerships with major universities and businesses</li>
                </>
              )}
            </ul>
            <div className="h-px bg-zinc-200 dark:bg-zinc-700/40 my-3" />
            <div className="text-base font-semibold text-zinc-800 dark:text-zinc-200">Responsibilities:</div>
            <ul className="list-disc pl-4 space-y-3 leading-snug">
              {jobData?.companyMatches?.Uber?.responsibilities?.map((point, index) => (
                <li key={index} className="text-emerald-700 dark:text-emerald-400">{point}</li>
              )) || (
                <>
                  <li>Led market launches in Raleigh-Durham and Charlotte</li>
                  <li>Acted as liaison between local regulators and corporate legal team</li>
                  <li>Developed partnerships with local businesses and universities (Duke, UNC, NC State)</li>
                  <li>Led marketing initiatives and demand generation in North Carolina</li>
                  <li>Executed creative campaigns including Uber Ice Cream and Uber Kittens</li>
                </>
              )}
            </ul>
          </div>
        </motion.div>
      )
    }
  ]

  if (!mounted) return null

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
        <div className="space-y-20 sm:space-y-32">
          <TldrCard jobData={jobData} isLoading={isLoading} />

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
