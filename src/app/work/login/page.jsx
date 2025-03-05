'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SimpleLayout } from '@/components/SimpleLayout'
import { CookieTest } from './cookie-test'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    setLoginSuccess(false)
    
    try {
      console.log('Attempting login...')
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ password }),
        credentials: 'include',
        mode: 'cors',
        cache: 'no-cache'
      })

      console.log('Login response status:', res.status)
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to login' }))
        console.error('Login error response:', errorData)
        throw new Error(errorData.error || 'Failed to login')
      }

      const data = await res.json().catch(() => null)
      console.log('Login success:', data?.success ? 'true' : 'false')
      
      if (!data?.success) {
        throw new Error('Invalid response from server')
      }

      // Set login success state
      setLoginSuccess(true)

      // Add a small delay to ensure cookie is set
      await new Promise(resolve => setTimeout(resolve, 500)) // Increased delay
      console.log('Redirecting to create page...');
      
      // Use the redirectTo from the response if available
      const redirectUrl = data.redirectTo || '/work/create';
      console.log('Redirect URL:', redirectUrl);
      
      // Try direct navigation
      window.location.href = redirectUrl;
      
      // Keep the router approach as a fallback
      setTimeout(() => {
        console.log('Fallback redirection...');
        if (window.location.pathname !== redirectUrl) {
          router.push(redirectUrl);
          router.refresh(); // Refresh to update auth state
        }
      }, 1000); // Longer timeout for fallback
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Failed to login. Please try again.')
      setPassword('') // Clear password on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualRedirect = () => {
    window.location.href = '/work/create';
  }

  return (
    <SimpleLayout>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-zinc-900 dark:text-zinc-100">
            Admin Login
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 dark:focus:ring-sky-500 sm:text-sm sm:leading-6 bg-white/5 dark:bg-zinc-800/50"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-sky-600 dark:bg-sky-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 dark:hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:focus-visible:outline-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
          {loginSuccess && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-green-700 dark:text-green-400 text-sm font-medium mb-2">
                Login successful! 
              </p>
              <p className="text-green-600 dark:text-green-500 text-xs mb-3">
                If you're not automatically redirected, please click the button below.
              </p>
              <button
                onClick={handleManualRedirect}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm"
              >
                Go to Create Page
              </button>
            </div>
          )}
          
          <CookieTest />
          
          <div className="mt-8 text-sm text-zinc-500 dark:text-zinc-400">
            <p>Having trouble logging in?</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Make sure cookies are enabled in your browser</li>
              <li>Try using a different browser</li>
              <li>Clear your browser cache and cookies</li>
              <li>If you're using a VPN or proxy, try disabling it</li>
              <li>Contact the site administrator if problems persist</li>
            </ul>
          </div>
        </div>
      </div>
    </SimpleLayout>
  )
} 