'use client'

import Image from 'next/image'
import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import logoAnimaginary from '@/images/logos/animaginary.svg'
import logoCosmos from '@/images/logos/cosmos.svg'
import logoHelioStream from '@/images/logos/helio-stream.svg'
import logoOpenShuttle from '@/images/logos/open-shuttle.svg'
import logoPlanetaria from '@/images/logos/planetaria.svg'

const projects = [
  {
    name: 'Planetaria',
    role: 'Lead Engineer',
    description:
      'Creating technology to empower civilians to explore space on their own terms.',
    technologies: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    duration: '2021 - Present',
    link: { href: 'http://planetaria.tech', label: 'planetaria.tech' },
    logo: logoPlanetaria,
  },
  {
    name: 'Animaginary',
    role: 'Senior Developer',
    description:
      'High performance web animation library, hand-written in optimized WASM.',
    technologies: ['Rust', 'WebAssembly', 'JavaScript'],
    duration: '2020 - 2021',
    link: { href: '#', label: 'github.com' },
    logo: logoAnimaginary,
  },
  {
    name: 'HelioStream',
    role: 'Backend Engineer',
    description:
      'Real-time video streaming library, optimized for interstellar transmission.',
    technologies: ['Go', 'FFMPEG', 'WebRTC'],
    duration: '2019 - 2020',
    link: { href: '#', label: 'github.com' },
    logo: logoHelioStream,
  },
  {
    name: 'cosmOS',
    role: 'System Architect',
    description:
      'The operating system that powers our Planetaria space shuttles.',
    technologies: ['C++', 'Rust', 'Assembly'],
    duration: '2018 - 2019',
    link: { href: '#', label: 'github.com' },
    logo: logoCosmos,
  },
  {
    name: 'OpenShuttle',
    role: 'Full Stack Developer',
    description:
      'The schematics for the first rocket I designed that successfully made it to orbit.',
    technologies: ['Python', 'CAD', 'Simulation'],
    duration: '2017 - 2018',
    link: { href: '#', label: 'github.com' },
    logo: logoOpenShuttle,
  },
]

function TechnologyBadge({ children }) {
  return (
    <span className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 ring-1 ring-inset ring-zinc-500/10">
      {children}
    </span>
  )
}

function ProjectCard({ project }) {
  return (
    <Card as="article" className="p-6">
      <div className="flex items-start gap-4">
        <div className="relative flex h-12 w-12 flex-none items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
          <Image
            src={project.logo}
            alt=""
            className="h-8 w-8"
            unoptimized
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {project.name}
            </h3>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {project.duration}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {project.role}
          </p>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            {project.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <TechnologyBadge key={tech}>{tech}</TechnologyBadge>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              asChild
            >
              <a
                href={project.link.href}
                className="group"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (project.link.href !== '#') {
                    window.umami?.track('external_link_click', {
                      domain: new URL(project.link.href).hostname,
                      type: 'project',
                      project: project.name
                    })
                  }
                }}
              >
                <span>{project.link.label}</span>
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4 stroke-zinc-400 transition group-hover:stroke-zinc-600 dark:group-hover:stroke-zinc-300"
                >
                  <path
                    d="M6.75 5.75 9.25 8l-2.5 2.25"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function AnimatedTitle() {
  return (
    <div className="space-y-2">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl whitespace-nowrap">
        What I've done. Where I've done it.
      </h1>
      <p className="animate-delayed-fade-in text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
        Why it mattered.
      </p>
    </div>
  )
}

export default function Work() {
  return (
    <SimpleLayout
      customTitle={<AnimatedTitle />}
      intro="I've had the privilege of working with some amazing teams on products that millions of people use every day. Here are a few that I'm particularly proud of."
    >
      <div className="mt-16 sm:mt-20">
        <div className="space-y-8">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </SimpleLayout>
  )
}
