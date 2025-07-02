'use client'

import Image from 'next/image'
import { BlurFade } from './ui/blur-fade'
import { Container } from './Container'
import { trackProjectClick } from '@/lib/analytics/tracking'

function ArrowUpRightIcon(props) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
        clipRule="evenodd"
      />
    </svg>
  )
}

const projects = [
  {
    id: 1,
    title: 'Otter Lockers',
    description: 'End-to-end automated food pickup solution for restaurants.',
    image: '/images/photos/otter-lockers.jpeg',
    link: { url: 'https://www.tryotter.com/products/lockers', target: '_blank', rel: 'noopener noreferrer' }
  },
  {
    id: 2,
    title: 'Emoji Studio',
    description: 'Emoji analytics dashboard for custom Slack emojis.',
    image: '/images/photos/emoji-studio.png',
    link: { url: 'https://emoji-studio.xyz', target: '_blank', rel: 'noopener noreferrer' }
  },
  {
    id: 3,
    title: 'Building: Home Management Platform',
    description: 'The single source of truth for staying on top of your home.',
    image: '/images/photos/homestash.jpg',
    link: { url: 'https://homestash.ai', target: '_blank', rel: 'noopener noreferrer' }
  }
]

export default function ProjectsShowcase() {
  const handleProjectClick = (project) => {
    // Track project click with centralized utility
    trackProjectClick(project)
  }

  return (
    <>
      <Container className="mt-16 sm:mt-20">
        <BlurFade delay={0.9} inView>
          <div className="mx-auto max-w-7xl bg-zinc-50/50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-8 sm:p-12">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-3xl text-center mb-12">
              What I've Built
            </h2>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {projects.map((project) => (
                <a
                  key={project.id}
                  href={typeof project.link === 'object' ? project.link.url : project.link}
                  target={typeof project.link === 'object' ? project.link.target : undefined}
                  rel={typeof project.link === 'object' ? project.link.rel : undefined}
                  onClick={() => handleProjectClick(project)}
                  className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-sky-500 dark:hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/10 dark:hover:shadow-sky-400/10 transition-all duration-300"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={600}
                      height={338}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-sky-500 dark:bg-sky-400 rounded-full p-2 shadow-lg">
                        <ArrowUpRightIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {project.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </BlurFade>
      </Container>
    </>
  )
}