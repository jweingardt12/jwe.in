'use client'

import { useState } from 'react'
import { SimpleLayout } from '@/components/SimpleLayout'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import OpenPanel from '@/components/analytics/OpenPanel'

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      // Track the logout event
      OpenPanel.track('admin_logout')
      
      // Call logout API
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      
      if (res.ok) {
        // Redirect to home page after logout
        window.location.href = '/'
      } else {
        console.error('Logout failed')
        setIsLoggingOut(false)
      }
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <SimpleLayout
      title="Admin Dashboard"
      intro="Manage your site content and settings."
    >
      <div className="space-y-10">
        {/* Dashboard Header with Logout */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Welcome to your dashboard</h2>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Content Management Card */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">Content Management</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">Create and manage your site content.</p>
              <div className="space-y-2">
                <Link 
                  href="/admin/notes/create" 
                  className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  Create Notes
                </Link>
              </div>
            </div>
          </div>

          {/* Job Analysis Card */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">Job Analysis</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">Create and manage job analysis cards.</p>
              <div className="space-y-2">
                <Link 
                  href="/admin/work/create" 
                  className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  Job Analysis Tool
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Quick Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link 
                href="/" 
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-center text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
              >
                View Site
              </Link>
              <Link 
                href="/notes" 
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-center text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
              >
                View Notes
              </Link>
              <Link 
                href="/work" 
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-center text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
              >
                View Work
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  )
}
