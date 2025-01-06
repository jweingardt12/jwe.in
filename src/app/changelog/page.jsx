'use client'

import { SimpleLayout } from '@/components/SimpleLayout'

export default function Changelog() {
  return (
    <SimpleLayout
      title="Changelog"
      intro="Track the latest updates and improvements to the site."
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-zinc-200 dark:border-zinc-700" />
            <span className="text-sm text-zinc-500 dark:text-zinc-400">January 2024</span>
            <div className="flex-1 border-t border-zinc-200 dark:border-zinc-700" />
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">January 15, 2024</span>
                <span className="px-2 py-1 text-xs font-medium bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 rounded-full">New</span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Added Changelog Page</h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Created a dedicated changelog page to track updates and improvements to the site.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">January 10, 2024</span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">Improved</span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Enhanced Performance</h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Optimized image loading and reduced bundle size for faster page loads.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-zinc-200 dark:border-zinc-700" />
            <span className="text-sm text-zinc-500 dark:text-zinc-400">December 2023</span>
            <div className="flex-1 border-t border-zinc-200 dark:border-zinc-700" />
          </div>

          <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">December 20, 2023</span>
              <span className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">Fixed</span>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Mobile Layout Fixes</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Resolved several layout issues on mobile devices and improved touch interactions.
            </p>
          </div>
        </div>
      </div>
    </SimpleLayout>
  )
}
