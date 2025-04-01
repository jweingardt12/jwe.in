'use client'

import { usePlausible } from '@/lib/analytics'

/**
 * Example component demonstrating the proper usage of Plausible analytics
 * with the next-plausible package according to the official documentation.
 */
export default function PlausibleExample() {
  const plausible = usePlausible()

  const handleButtonClick = () => {
    // Track a custom event with properties
    plausible('example_button_click', {
      props: {
        location: 'example component',
        timestamp: new Date().toISOString()
      }
    })
  }

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
      <h3 className="text-lg font-medium mb-2">Plausible Analytics Example</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        This component demonstrates the proper usage of Plausible analytics
        with the next-plausible package.
      </p>
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md"
      >
        Track Event
      </button>
    </div>
  )
}
