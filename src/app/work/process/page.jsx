'use client'

import { motion } from 'framer-motion'
import { SimpleLayout } from '@/components/SimpleLayout'

export default function Process() {
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
                  My Process
                </motion.h1>
              </div>
              <div className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                <p>
                  I believe in a systematic yet flexible approach to problem-solving. Here's how I tackle challenges and deliver results.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-20">
          {/* Discovery */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-6">
              1. Discovery & Research
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <ul>
                <li>Deep dive into understanding the problem space</li>
                <li>Stakeholder interviews and requirement gathering</li>
                <li>Market and competitive analysis</li>
                <li>Technical feasibility assessment</li>
              </ul>
            </div>
          </section>

          {/* Strategy */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-6">
              2. Strategy & Planning
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <ul>
                <li>Define clear objectives and success metrics</li>
                <li>Develop roadmap and timeline</li>
                <li>Resource allocation and team alignment</li>
                <li>Risk assessment and mitigation planning</li>
              </ul>
            </div>
          </section>

          {/* Execution */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-6">
              3. Execution & Iteration
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <ul>
                <li>Agile development with regular checkpoints</li>
                <li>Continuous feedback and adaptation</li>
                <li>Data-driven decision making</li>
                <li>Regular stakeholder communication</li>
              </ul>
            </div>
          </section>

          {/* Measurement */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-6">
              4. Measurement & Optimization
            </h2>
            <div className="prose prose-zinc dark:prose-invert">
              <ul>
                <li>KPI tracking and analysis</li>
                <li>User feedback collection</li>
                <li>Performance optimization</li>
                <li>Documentation and knowledge sharing</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </SimpleLayout>
  )
} 