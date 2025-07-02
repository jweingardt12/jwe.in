'use client'

import { Container } from './Container'
import { BentoDemo } from './ui/bento-demo'

export default function Projects() {
  return (
    <div className="py-24 sm:py-32">
      <Container className="">
        <h2 className="text-base/7 font-semibold text-indigo-600">Recent Work</h2>
        <p className="mt-2 max-w-lg text-pretty text-4xl font-semibold tracking-tight text-gray-950 dark:text-zinc-100 sm:text-5xl">
          Projects I've Built
        </p>
        <div className="mt-10 sm:mt-16">
          <BentoDemo />
        </div>
      </Container>
    </div>
  )
} 