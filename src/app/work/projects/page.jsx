'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { SimpleLayout } from '@/components/SimpleLayout'
import { Card } from '@/components/Card'

const projects = [
  {
    name: 'Robotics Automation',
    description: 'Led GTM and product vision for autonomous robotics systems at CloudKitchens, achieving 30% labor cost savings.',
    link: { href: '#', label: 'Learn more' },
    image: '/images/photos/robots.jpg'
  },
  {
    name: 'Supply Chain Optimization',
    description: 'Developed delivery supply-class optimization improvements in LATAM market, resulting in 30% cost savings.',
    link: { href: '#', label: 'Learn more' },
    image: '/images/photos/supply-chain.jpg'
  },
  {
    name: 'Market Expansion',
    description: 'Successfully launched and scaled multiple markets for Ritual and Uber across North America.',
    link: { href: '#', label: 'Learn more' },
    image: '/images/photos/market.jpg'
  },
]

function Project({ project }) {
  return (
    <Card as="article" className="md:grid md:grid-cols-4 md:items-baseline">
      <Card.Title as="h2" href={project.link.href} className="md:col-span-3">
        {project.name}
      </Card.Title>
      <Card.Eyebrow
        as="time"
        decorate
        className="md:hidden"
        dateTime={project.date}
      >
        {project.date}
      </Card.Eyebrow>
      <Card.Description className="md:col-span-3">
        {project.description}
      </Card.Description>
      <Card.Cta>{project.link.label}</Card.Cta>
    </Card>
  )
}

export default function Projects() {
  return (
    <SimpleLayout>
      <div className="relative">
        {/* Header section */}
        <div className="relative mb-16">
          <div className="max-w-2xl">
            <div className="relative">
              <div className="overflow-hidden min-h-[3.5rem]">
                <motion.h1 
                  className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                >
                  Featured Projects
                </motion.h1>
              </div>
              <div className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                <p>
                  A selection of my most impactful projects that showcase my expertise in product management, operations, and growth.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects grid */}
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div className="flex max-w-3xl flex-col space-y-16">
            {projects.map((project) => (
              <Project key={project.name} project={project} />
            ))}
          </div>
        </div>
      </div>
    </SimpleLayout>
  )
} 