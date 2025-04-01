'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { DocumentArrowDownIcon, LightBulbIcon } from '@heroicons/react/24/outline'
import { useSearchParams } from 'next/navigation'
import portraitImage from '@/images/portrait.jpg'
import { useSwipeable } from 'react-swipeable'
import { usePlausible } from '@/lib/analytics'

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
import { SparklesCore } from '@/components/ui/sparkles'
import { BackgroundGradient } from '@/components/ui/background-gradient'
import { TldrCard } from '@/components/ui/tldr-card'
import { TldrLoadingSkeleton } from '@/components/ui/tldr-loading-skeleton'
import { LoadingSkeleton } from '@/components/ArticleSkeleton'
import { Button } from "@/components/ui/button"

import { ExpandedContext } from '@/contexts/expanded'

import logoCloudKitchens from '@/images/logos/cloudkitchens.svg'
import logoRitual from '@/images/logos/ritual.svg'
import logoCountable from '@/images/logos/countable.svg'
import logoUber from '@/images/logos/uber.svg'
import { LinkedInIcon } from '@/components/SocialIcons'

// Utility function for combining class names
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
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
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden flex items-center text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
      >
        <span>{isExpanded ? 'Hide details' : 'Show details'}</span>
      </button>
      
      <div className="hidden md:block mt-4">
        {children}
      </div>
      
      {isExpanded && (
        <div className="md:hidden mt-3">
          {children}
        </div>
      )}
    </div>
  );
};

// Featured testimonial
const featuredTestimonial = {
  body: 'Jason is terrific. He brings an incredible amount of energy and creativity to his work. He is also incredibly talented, a human Swiss army knife, bringing an impressive and diverse variety of skills to his work, including: dev. skills, product marketing, GTM, and overall technical prowess.',
  author: {
    name: 'Bart Myers',
    handle: 'CEO, Countable',
    imageUrl: 'https://media.licdn.com/dms/image/v2/D5603AQFXNth9ysgJnA/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1715712288122?e=1746662400&v=beta&t=yEi5DxoLOtOgNToHr2LD_aGsLTB0Gt5knMBjKIrYar4',
    linkedIn: 'https://www.linkedin.com/in/bartmyers/',
  },
}

// Testimonial grid data
const testimonials = [
  [
    [
      {
        body: 'Most PMs excel at strategy, but lack the execution muscle to make it all happen. Jason is the exception: he rolls up his sleeves and dives in regularly, and is constantly looking for ways to make our customers\' lives better. His curiousity and positivity is infectious, and it makes working with him genuinely fun.',
        author: {
          name: 'Julia Gasboro',
          handle: 'Product Manager, CloudKitchens',
          imageUrl: 'https://media.licdn.com/dms/image/v2/D5603AQGQTEVtnX59zg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1680572075488?e=1742428800&v=beta&t=DW1g8wjHU4d43CC3dby_8ELRnyEVMUbhqy7eQWOYxbA',
          linkedIn: 'https://www.linkedin.com/in/julia-gasbarro-26a2b312b/',
        },
      },
    ],
    [
      {
        body: 'Jason is one of the most unique Product Managers I\'ve worked with. He never let our engineering team lose sight of their impact to the business, and cared deeply for the problems of our customers. Any product team would be insanely lucky to have him.',
        author: {
          name: 'Greg Humphreys',
          handle: 'Developer Engineer, NVIDIA',
          imageUrl: 'https://media.licdn.com/dms/image/v2/C4E03AQGMifQFwL0M3g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1517740280815?e=1742428800&v=beta&t=Rwejvp8rbGa-z1qfDJmxC1F8x0-Rm8WU81azEgUwhj8',
          linkedIn: 'https://www.linkedin.com/in/greghumphreys/',
        },
      },
    ],
    [
      {
        body: "Jason genuinely cares about making teams feel valued and connected, creating an environment where everyone does their best work. He's skilled at guiding product development clearly and practically, consistently delivering results that matter.",
        author: {
          name: 'Anthony Prats',
          handle: 'Former Product Manager, Google',
          imageUrl: 'https://media.licdn.com/dms/image/v2/D5603AQF7Aq2MWzTC_w/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1725076362743?e=1746662400&v=beta&t=rpK58aUefRmqA2nTCJGExlmQYUNYYHWlSUI5Gi0Jlcw',
          linkedIn: 'https://www.linkedin.com/in/greg-humphreys-0000000000/',
        },
      },
    ],
  ]
]

const TldrCardWrapper = ({ jobData, isLoading }) => {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (!isLoading && jobData && !jobData.error) {
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isLoading, jobData])

  // Loading state
  if (isLoading || !showContent) {
    return <TldrLoadingSkeleton />
  }

  // Success state - only show if we have valid data
  if (jobData && !jobData.error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <TldrCard data={jobData} />
      </motion.div>
    )
  }

  // Error state
  return null
}

const WorkContent = () => {
  const [mounted, setMounted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [jobData, setJobData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidJobId, setIsValidJobId] = useState(false)
  const searchParams = useSearchParams()
  const jobId = searchParams.get('job')
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0)
  const totalTestimonials = 4 // Featured + 3 from nested array
  const [autoRotatePaused, setAutoRotatePaused] = useState(false)
  const [slideDirection, setSlideDirection] = useState('right')
  const plausible = usePlausible()
  
  // Add useEffect for auto-rotation
  useEffect(() => {
    // Only run the auto-rotation on mobile devices
    if (typeof window !== 'undefined' && window.innerWidth < 768 && !autoRotatePaused) {
      const rotationTimer = setInterval(() => {
        setSlideDirection('right')
        setActiveTestimonialIndex((prevIndex) => 
          prevIndex === totalTestimonials - 1 ? 0 : prevIndex + 1
        )
      }, 5000) // 5 seconds interval
      
      // Clear the interval when component unmounts
      return () => clearInterval(rotationTimer)
    }
  }, [totalTestimonials, autoRotatePaused])

  // Resume auto-rotation after a delay when user interaction ends
  useEffect(() => {
    if (autoRotatePaused) {
      const resumeTimer = setTimeout(() => {
        setAutoRotatePaused(false)
      }, 10000) // Resume after 10 seconds of inactivity
      
      return () => clearTimeout(resumeTimer)
    }
  }, [autoRotatePaused])

  const handlePrevTestimonial = () => {
    setAutoRotatePaused(true)
    setSlideDirection('left')
    setActiveTestimonialIndex((prev) => 
      prev === 0 ? totalTestimonials - 1 : prev - 1
    )
  }
  
  const handleNextTestimonial = () => {
    setAutoRotatePaused(true)
    setSlideDirection('right')
    setActiveTestimonialIndex((prev) => 
      prev === totalTestimonials - 1 ? 0 : prev + 1
    )
  }
  
  const handleDotClick = (index) => {
    setAutoRotatePaused(true)
    setSlideDirection(index > activeTestimonialIndex ? 'right' : 'left')
    setActiveTestimonialIndex(index)
  }
  
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextTestimonial,
    onSwipedRight: handlePrevTestimonial,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  })

  // Load job data
  useEffect(() => {
    const loadJobData = async () => {
      if (!jobId) {
        setIsValidJobId(false)
        return
      }

      setIsLoading(true)
      try {
        // First try to load from the API
        const apiResponse = await fetch(`/api/analyze-job?id=${jobId}`)
        console.log('API Response status:', apiResponse.status)
        const data = await apiResponse.json()
        console.log('API Response data:', data)
        
        if (apiResponse.ok && !data.error) {
          // Ensure we have all required fields
          if (data.jobTitle && 
              data.companyName && 
              data.introText && 
              data.bulletPoints?.length >= 3 && 
              data.relevantSkills?.length) {
            
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

    const loadingStartTime = Date.now()
    loadJobData()
  }, [jobId])

  const handleFaqOpen = (value) => {
    if (value) {
      const questions = {
        'item-1': 'What is your management style?',
        'item-2': 'How do you handle conflict?',
        'item-3': 'What are your thoughts on AI?',
        'item-4': 'What\'s your experience with remote teams?',
        'item-5': 'Your journey seems to be a bit of a rollercoaster. Where do you see yourself in 5 years?'
      }
      plausible('faq_open', { props: { question: questions[value] } })
    }
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
                  title: "Microsoft invests in Travis Kalanick's CloudKitchens start-up",
                  url: "https://www.ft.com/content/5a768a67-1d0c-4c8a-9f14-de5ba06432ee",
                  publication: "Financial Times"
                },
                {
                  title: "CloudKitchens has tripled its valuation to $15 billion",
                  url: "https://archive.is/9pZ5f",
                  publication: "Business Insider"
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
                  <li>Developed SQL queries and dashboards, as well as leveraged Python and Zapier/AI tools to help my teams do more with less</li>
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
              width={258}
              height={20}
              className="dark:invert object-contain w-auto h-full"
            />
          </a>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Food ordering and pickup platform</p>
          <CompanyDetails>
            <CompanyInfo 
              industry="Food Tech"
              size="300+"
              location="Toronto, ON"
              website="https://www.ritual.co"
              tools={[
                "SQL",
                "Jira",
                "Slack",
                "Looker",
                "G-Suite"
              ]}
              headlines={[
                {
                  title: "Ritual Raises $70M Series C",
                  url: "https://techcrunch.com/2018/06/06/order-ahead-app-ritual-picks-up-70m-to-rethink-the-social-office-lunch-break/",
                  publication: "TechCrunch"
                },
                {
                  title: "Ritual Expands to Europe",
                  url: "https://techcrunch.com/2019/04/23/ritual-launches-its-first-international-market/",
                  publication: "TechCrunch"
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
              {jobData?.companyMatches?.Ritual?.impact?.map((point, index) => (
                <li key={index} className="text-emerald-700 dark:text-emerald-400">{point}</li>
              )) || (
                <>
                  <li>Grew monthly active users by 300% across 15+ markets in first year.</li>
                  <li>Increased restaurant partner retention by 40% through improved operational practices and support.</li>
                  <li>Launched and scaled operations in 3 major US markets with $1M+ monthly GMV each.</li>
                  <li>Built and managed a team of 4 City Managers across North America.</li>
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
                  <li>Led operations and growth strategy for 15+ markets including Washington D.C., Boston, and Philadelphia.</li>
                  <li>Served as voice of customer to product and engineering teams, influencing roadmap priorities.</li>
                  <li>Managed geographically dispersed team of city managers throughout North America.</li>
                  <li>Orchestrated multi-city promotional campaigns with Apple, driving significant user acquisition.</li>
                  <li>Developed and executed local marketing strategies to drive both supply and demand growth.</li>
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
              width={258}
              height={20}
              className="dark:invert object-contain w-auto h-full"
            />
          </a>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Civic engagement platform</p>
          <CompanyDetails>
            <CompanyInfo 
              industry="Civic Tech"
              size="50+"
              location="San Francisco, CA"
              website="https://www.countable.us"
              tools={[
                "SQL",
                "Mixpanel",
                "Trello",
                "Slack",
                "G-Suite"
              ]}
              headlines={[
                {
                  title: "Countable Makes Civic Engagement Easy",
                  url: "https://techcrunch.com/2016/10/11/countable-makes-learning-about-politics-easier/",
                  publication: "TechCrunch"
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
                  <li>Secured featured placement on App Store multiple times following 2016 election.</li>
                  <li>Led D.C. business development efforts, pitching and closing partnerships with nonprofits and NGOs representing 150%+ growth.</li>
                  <li>Created editorial practices and content to drive user acquisition and engagement.</li>
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
                  <li>Led marketing and growth strategy for leading iOS/Android civic engagement application.</li>
                  <li>Developed and implemented editorial, support, and marketing initiatives.</li>
                  <li>Streamlined operations using low-code tools.</li>
                  <li>Orchestrated cross-functional collaborations and established strategic partnerships.</li>
                </>
              )}
            </ul>
          </div>
        </motion.div>
      )
    },
    {
      title: "2014 - 2016",
      role: "Launch/Marketing/Operations Manager",
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
              width={258}
              height={20}
              className="dark:invert object-contain w-auto h-full"
            />
          </a>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Transportation and delivery platform</p>
          <CompanyDetails>
            <CompanyInfo 
              industry="Transportation"
              size="10,000+"
              location="Raleigh-Durham, NC"
              website="https://www.uber.com"
              tools={[
                "SQL",
                "Excel",
                "Salesforce",
                "Slack",
                "G-Suite"
              ]}
              headlines={[
                {
                  title: "Uber Launches in North Carolina",
                  url: "https://www.wral.com/uber-launches-ride-sharing-service-in-durham-chapel-hill/13677970/",
                  publication: "WRAL"
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
                  <li>Successfully launched and scaled two major markets in North Carolina.</li>
                  <li>Established key partnerships with major universities and businesses.</li>
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
                  <li>Led market launches in Raleigh-Durham and Charlotte.</li>
                  <li>Acted as liaison between local regulators and corporate legal team.</li>
                  <li>Developed partnerships with local businesses and universities (Duke, UNC, NC State).</li>
                  <li>Led marketing initiatives and demand generation in North Carolina.</li>
                  <li>Executed creative campaigns including Uber Ice Cream and Uber Kittens.</li>
                </>
              )}
            </ul>
          </div>
        </motion.div>
      )
    }
  ]

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
        <div className={`space-y-6 sm:space-y-12 ${(isValidJobId || (isLoading && !jobData?.error)) ? '' : 'mt-4 sm:mt-8'}`}>
          {(isValidJobId || (isLoading && !jobData?.error)) && (
            <div className="relative isolate">
              <TldrCardWrapper jobData={jobData} isLoading={isLoading} />
            </div>
          )}

          <div className="mt-0">
            <div className="flex flex-col items-center justify-center mx-auto">
              <div className="max-w-2xl text-center mx-auto">
                <div className="relative">
                  <div className="space-y-1">
                    <motion.h1 
                      className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl lg:text-5xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      What I've done.
                    </motion.h1>
                    <motion.h1 
                      className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl lg:text-5xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      Where I've done it.
                    </motion.h1>
                    <motion.h1 
                      className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl lg:text-5xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      Why it mattered.
                    </motion.h1>
                  </div>
                  <div className="overflow-hidden min-h-[3.5rem] mb-2">
                    <motion.p 
                      className="mt-6 text-base text-zinc-600 dark:text-zinc-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      I've built and scaled products at high-growth technology companies, focusing on product management, operations, and custom Slack emoji output.
                    </motion.p>
                  </div>
                  <motion.div 
                    className="mt-6 flex items-center gap-x-6 justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
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
            </div>
          </div>

          {/* Divider */}
          <motion.div 
            className="h-px bg-zinc-200 dark:bg-zinc-800 mb-8 mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Testimonials Section */}
          <motion.div 
            className="mt-32 sm:mt-48"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative isolate">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
              >
                <div
                  style={{
                    clipPath:
                      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                  }}
                  className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]"
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-32 opacity-25 blur-3xl sm:pt-40 xl:justify-end"
              >
                <div
                  style={{
                    clipPath:
                      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                  }}
                  className="ml-[-22rem] aspect-[1313/771] w-[82.0625rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] xl:ml-0 xl:mr-[calc(50%-12rem)]"
                />
              </div>
              <div className="mx-auto text-center mb-8">
                <h2 className="text-base/7 font-semibold text-indigo-600 dark:text-indigo-400">Testimonials</h2>
                <p className="mt-2 text-balance text-2xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                  What they're saying
                </p>
              </div>
              
              {/* Desktop layout - two rows with 60/40 split */}
              <div className="hidden md:block">
                {/* First row: Bart (60%) and Julia (40%) */}
                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-5 mb-6 sm:mb-8">
                  {/* Bart Myers - Featured testimonial (60% width) */}
                  <figure className="col-span-1 md:col-span-3 rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 dark:bg-zinc-900 dark:ring-white/10 flex flex-col transition duration-300 hover:scale-[1.02] hover:shadow-xl">
                    <blockquote className="p-6 text-sm text-gray-900 dark:text-white flex-grow">
                      <p>{`"`}<span className="font-bold">Jason is terrific</span>{` He brings an incredible amount of energy and creativity to his work. He is also incredibly talented, a human Swiss army knife, bringing an impressive and diverse variety of skills to his work, including: dev. skills, product marketing, GTM, and overall technical prowess.`}</p>
                    </blockquote>
                    <figcaption className="flex items-center gap-x-4 border-t border-gray-900/10 dark:border-white/10 px-6 py-4 mt-auto">
                      <img
                        alt=""
                        src={featuredTestimonial.author.imageUrl}
                        className="size-10 flex-none rounded-full bg-gray-50 dark:bg-zinc-800"
                      />
                      <div className="flex-auto">
                        <div className="flex items-center gap-x-1.5 text-sm font-medium dark:text-white">
                          {featuredTestimonial.author.name}
                          <a 
                            href={featuredTestimonial.author.linkedIn} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <LinkedInIcon className="h-4 w-4 fill-current" />
                          </a>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{featuredTestimonial.author.handle}</div>
                      </div>
                    </figcaption>
                  </figure>

                  {/* Julia Gasboro (40% width) */}
                  {testimonials[0] && testimonials[0][0] && testimonials[0][0][0] && (
                    <figure 
                      className="col-span-1 md:col-span-2 rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 dark:bg-zinc-900 dark:ring-white/10 flex flex-col transition duration-300 hover:scale-[1.02] hover:shadow-xl"
                    >
                      <blockquote className="p-6 text-sm text-gray-900 dark:text-white flex-grow">
                        <p>{`"`}<span className="font-bold">Most PMs excel at strategy, but lack the execution muscle to make it all happen</span>{` Jason is the exception: he rolls up his sleeves and dives in regularly, and is constantly looking for ways to make our customers' lives better. His curiousity and positivity is infectious, and it makes working with him genuinely fun.`}</p>
                      </blockquote>
                      <figcaption className="flex items-center gap-x-4 border-t border-gray-900/10 dark:border-white/10 px-6 py-4 mt-auto">
                        <img 
                          alt="" 
                          src={testimonials[0][0][0].author.imageUrl} 
                          className="size-10 flex-none rounded-full bg-gray-50 dark:bg-zinc-800" 
                        />
                        <div className="flex-auto">
                          <div className="flex items-center gap-x-1.5 text-sm font-medium dark:text-white">
                            {testimonials[0][0][0].author.name}
                            <a 
                              href={testimonials[0][0][0].author.linkedIn} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                              <LinkedInIcon className="h-4 w-4 fill-current" />
                            </a>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{testimonials[0][0][0].author.handle}</div>
                        </div>
                      </figcaption>
                    </figure>
                  )}
                </div>
                
                {/* Second row: Greg (40%) and John (60%) */}
                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-5">
                  {/* Greg Humphreys (40% width) */}
                  {testimonials[0] && testimonials[0][1] && testimonials[0][1][0] && (
                    <figure 
                      className="col-span-1 md:col-span-2 rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 dark:bg-zinc-900 dark:ring-white/10 flex flex-col transition duration-300 hover:scale-[1.02] hover:shadow-xl"
                    >
                      <blockquote className="p-6 text-sm text-gray-900 dark:text-white flex-grow">
                        <p>{`"`}<span className="font-bold">Jason is one of the most unique Product Managers I've worked with</span>{` He never let our engineering team lose sight of their impact to the business, and cared deeply for the problems of our customers. Any product team would be insanely lucky to have him.`}</p>
                      </blockquote>
                      <figcaption className="flex items-center gap-x-4 border-t border-gray-900/10 dark:border-white/10 px-6 py-4 mt-auto">
                        <img 
                          alt="" 
                          src={testimonials[0][1][0].author.imageUrl} 
                          className="size-10 flex-none rounded-full bg-gray-50 dark:bg-zinc-800" 
                        />
                        <div className="flex-auto">
                          <div className="flex items-center gap-x-1.5 text-sm font-medium dark:text-white">
                            {testimonials[0][1][0].author.name}
                            <a 
                              href={testimonials[0][1][0].author.linkedIn} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                              <LinkedInIcon className="h-4 w-4 fill-current" />
                            </a>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Developer Engineer, NVIDIA</div>
                        </div>
                      </figcaption>
                    </figure>
                  )}
                  
                  {/* Anthony Prats (60% width) */}
                  {testimonials[0] && testimonials[0][2] && testimonials[0][2][0] && (
                    <figure 
                      className="col-span-1 md:col-span-3 rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 dark:bg-zinc-900 dark:ring-white/10 flex flex-col transition duration-300 hover:scale-[1.02] hover:shadow-xl"
                    >
                      <blockquote className="p-6 text-sm text-gray-900 dark:text-white flex-grow">
                        <p>
                          "<span className="font-bold">Jason genuinely cares about making teams feel valued and connected</span>, creating an environment where everyone does their best work. He's skilled at guiding product development clearly and practically, consistently delivering results that matter."
                        </p>
                      </blockquote>
                      <figcaption className="flex items-center gap-x-4 border-t border-gray-900/10 dark:border-white/10 px-6 py-4 mt-auto">
                        <img 
                          alt="" 
                          src={testimonials[0][2][0].author.imageUrl} 
                          className="size-10 flex-none rounded-full bg-gray-50 dark:bg-zinc-800" 
                        />
                        <div className="flex-auto">
                          <div className="flex items-center gap-x-1.5 text-sm font-medium dark:text-white">
                            {testimonials[0][2][0].author.name}
                            <a 
                              href={testimonials[0][2][0].author.linkedIn} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                              <LinkedInIcon className="h-4 w-4 fill-current" />
                            </a>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{testimonials[0][2][0].author.handle}</div>
                        </div>
                      </figcaption>
                    </figure>
                  )}
                </div>
              </div>
              
              {/* Mobile swipeable carousel */}
              <div className="md:hidden relative">
                <div {...swipeHandlers} className="relative overflow-hidden">
                  <div className="p-4">
                    
                    <div className="relative overflow-hidden" style={{ minHeight: "300px" }}>
                      <AnimatePresence initial={false} mode="wait" custom={slideDirection}>
                        {activeTestimonialIndex === 0 && testimonials[0] && testimonials[0][0] && testimonials[0][0][0] && (
                          <motion.figure 
                            key="testimonial-0"
                            className="w-full rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 dark:bg-zinc-900 dark:ring-white/10 flex flex-col absolute inset-0"
                            initial={{ 
                              opacity: 0,
                              x: slideDirection === 'right' ? 300 : -300 
                            }}
                            animate={{ 
                              opacity: 1,
                              x: 0,
                              transition: {
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                              }
                            }}
                            exit={{ 
                              opacity: 0,
                              x: slideDirection === 'right' ? -300 : 300,
                              transition: {
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                              }
                            }}
                          >
                            <blockquote className="p-6 text-sm text-gray-900 dark:text-white flex-grow">
                              <p>
                                "<span className="font-bold">Jason genuinely cares about making teams feel valued and connected</span>, creating an environment where everyone does their best work. He's skilled at guiding product development clearly and practically, consistently delivering results that matter."
                              </p>
                            </blockquote>
                            <figcaption className="flex items-center gap-x-4 border-t border-gray-900/10 dark:border-white/10 px-6 py-4 mt-auto">
                              <img 
                                alt="" 
                                src={testimonials[0][2][0].author.imageUrl} 
                                className="size-10 flex-none rounded-full bg-gray-50 dark:bg-zinc-800" 
                              />
                              <div className="flex-auto">
                                <div className="flex items-center gap-x-1.5 text-sm font-medium dark:text-white">
                                  {testimonials[0][2][0].author.name}
                                  <a 
                                    href={testimonials[0][2][0].author.linkedIn} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                  >
                                    <LinkedInIcon className="h-4 w-4 fill-current" />
                                  </a>
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">{testimonials[0][2][0].author.handle}</div>
                              </div>
                            </figcaption>
                          </motion.figure>
                        )}
                        
                        {activeTestimonialIndex === 1 && testimonials[0] && testimonials[0][0] && testimonials[0][0][0] && (
                          <motion.figure 
                            key="testimonial-1"
                            className="w-full rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 dark:bg-zinc-900 dark:ring-white/10 flex flex-col absolute inset-0"
                            initial={{ 
                              opacity: 0,
                              x: slideDirection === 'right' ? 300 : -300 
                            }}
                            animate={{ 
                              opacity: 1,
                              x: 0,
                              transition: {
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                              }
                            }}
                            exit={{ 
                              opacity: 0,
                              x: slideDirection === 'right' ? -300 : 300,
                              transition: {
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                              }
                            }}
                          >
                            <blockquote className="p-6 text-sm text-gray-900 dark:text-white flex-grow">
                              <p>
                                "<span className="font-bold">Jason genuinely cares about making teams feel valued and connected</span>, creating an environment where everyone does their best work. He's skilled at guiding product development clearly and practically, consistently delivering results that matter."
                              </p>
                            </blockquote>
                            <figcaption className="flex items-center gap-x-4 border-t border-gray-900/10 dark:border-white/10 px-6 py-4 mt-auto">
                              <img 
                                alt="" 
                                src={testimonials[0][2][0].author.imageUrl} 
                                className="size-10 flex-none rounded-full bg-gray-50 dark:bg-zinc-800" 
                              />
                              <div className="flex-auto">
                                <div className="flex items-center gap-x-1.5 text-sm font-medium dark:text-white">
                                  {testimonials[0][2][0].author.name}
                                  <a 
                                    href={testimonials[0][2][0].author.linkedIn} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                  >
                                    <LinkedInIcon className="h-4 w-4 fill-current" />
                                  </a>
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">{testimonials[0][2][0].author.handle}</div>
                              </div>
                            </figcaption>
                          </motion.figure>
                        )}
                        
                        {activeTestimonialIndex === 2 && testimonials[0] && testimonials[0][1] && testimonials[0][1][0] && (
                          <motion.figure 
                            key="testimonial-2"
                            className="w-full rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 dark:bg-zinc-900 dark:ring-white/10 flex flex-col absolute inset-0"
                            initial={{ 
                              opacity: 0,
                              x: slideDirection === 'right' ? 300 : -300 
                            }}
                            animate={{ 
                              opacity: 1,
                              x: 0,
                              transition: {
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                              }
                            }}
                            exit={{ 
                              opacity: 0,
                              x: slideDirection === 'right' ? -300 : 300,
                              transition: {
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                              }
                            }}
                          >
                            <blockquote className="p-6 text-sm text-gray-900 dark:text-white flex-grow">
                              <p>{`"`}<span className="font-bold">Jason is one of the most unique Product Managers I've worked with</span>{`" He never let our engineering team lose sight of their impact to the business, and cared deeply for the problems of our customers. Any product team would be insanely lucky to have him.`}</p>
                            </blockquote>
                            <figcaption className="flex items-center gap-x-4 border-t border-gray-900/10 dark:border-white/10 px-6 py-4 mt-auto">
                              <img 
                                alt="" 
                                src={testimonials[0][1][0].author.imageUrl} 
                                className="size-10 flex-none rounded-full bg-gray-50 dark:bg-zinc-800" 
                              />
                              <div className="flex-auto">
                                <div className="flex items-center gap-x-1.5 text-sm font-medium dark:text-white">
                                  {testimonials[0][1][0].author.name}
                                  <a 
                                    href={testimonials[0][1][0].author.linkedIn} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                  >
                                    <LinkedInIcon className="h-4 w-4 fill-current" />
                                  </a>
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Developer Engineer, NVIDIA</div>
                              </div>
                            </figcaption>
                          </motion.figure>
                        )}
                        
                        {activeTestimonialIndex === 3 && testimonials[0] && testimonials[0][2] && testimonials[0][2][0] && (
                          <motion.figure 
                            key="testimonial-3"
                            className="w-full rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 dark:bg-zinc-900 dark:ring-white/10 flex flex-col absolute inset-0"
                            initial={{ 
                              opacity: 0,
                              x: slideDirection === 'right' ? 300 : -300 
                            }}
                            animate={{ 
                              opacity: 1,
                              x: 0,
                              transition: {
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                              }
                            }}
                            exit={{ 
                              opacity: 0,
                              x: slideDirection === 'right' ? -300 : 300,
                              transition: {
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                              }
                            }}
                          >
                            <blockquote className="p-6 text-sm text-gray-900 dark:text-white flex-grow">
                              <p>{`"`}<span className="font-bold">Jason genuinely cares about making teams feel valued and connected</span>{`" creating an environment where everyone does their best work. He's skilled at guiding product development clearly and practically, consistently delivering results that matter.`}</p>
                            </blockquote>
                            <figcaption className="flex items-center gap-x-4 border-t border-gray-900/10 dark:border-white/10 px-6 py-4 mt-auto">
                              <img 
                                alt="" 
                                src={testimonials[0][2][0].author.imageUrl} 
                                className="size-10 flex-none rounded-full bg-gray-50 dark:bg-zinc-800" 
                              />
                              <div className="flex-auto">
                                <div className="flex items-center gap-x-1.5 text-sm font-medium dark:text-white">
                                  {testimonials[0][2][0].author.name}
                                  <a 
                                    href={testimonials[0][2][0].author.linkedIn} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                  >
                                    <LinkedInIcon className="h-4 w-4 fill-current" />
                                  </a>
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">{testimonials[0][2][0].author.handle}</div>
                              </div>
                            </figcaption>
                          </motion.figure>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                </div>
              </div>
              
              {/* Pagination indicators */}
              <div className="flex justify-center mt-6 space-x-2 md:hidden">
                {[...Array(totalTestimonials)].map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeTestimonialIndex === index 
                        ? 'bg-blue-600 w-6' 
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                    onClick={() => handleDotClick(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div 
            className="h-px bg-zinc-200 dark:bg-zinc-800 mb-8 mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Timeline */}
          <motion.div 
            className="space-y-8" 
            suppressHydrationWarning
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto text-center mb-12">
              <h2 className="text-base/7 font-semibold text-indigo-600 dark:text-indigo-400">Experience</h2>
              <p className="mt-2 text-balance text-2xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                What I've done
              </p>
            </div>
            <Timeline data={timelineData} />
          </motion.div>

          {/* FAQs Section */}
          <motion.div 
            id="faqs" 
            className="mt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 mb-8" />
            <div className="mx-auto text-center mb-8">
              <h2 className="text-base/7 font-semibold text-indigo-600 dark:text-indigo-400">FAQ</h2>
              <p className="mt-2 text-balance text-2xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                Learn more
              </p>
            </div>
            <Accordion 
              type="single" 
              collapsible 
              className="w-full"
              defaultValue="item-0"
              onValueChange={handleFaqOpen}
            >
              <AccordionItem value="item-0">
                <AccordionTrigger>What makes you unique?</AccordionTrigger>
                <AccordionContent>
                  I bring a rare combination of technical depth and product leadership. My background as a tinkerer with all things technology gives me the ability to understand complex technical challenges, while my product experience allows me to translate those into business value. I'm known for my ability to bridge communication gaps between technical and non-technical stakeholders, and for building products that users genuinely love.
                </AccordionContent>
              </AccordionItem>

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
            transition={{ duration: 0.5 }}
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
