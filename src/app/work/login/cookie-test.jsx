'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function CookieTest() {
  const [cookieStatus, setCookieStatus] = useState('Checking...')
  const [testCookieSet, setTestCookieSet] = useState(false)

  useEffect(() => {
    // Check for cookies
    const cookies = document.cookie.split(';').map(cookie => cookie.trim())
    const adminCookie = cookies.find(cookie => cookie.startsWith('admin_auth='))
    const testCookie = cookies.find(cookie => cookie.startsWith('test_cookie='))
    
    setCookieStatus(`Admin cookie: ${adminCookie ? 'Found' : 'Not found'}, Test cookie: ${testCookie ? 'Found' : 'Not found'}`)
    setTestCookieSet(!!testCookie)
  }, [])

  const setTestCookie = () => {
    // Set a test cookie
    document.cookie = `test_cookie=test_value; path=/; max-age=${60 * 60 * 24}` // 1 day
    
    // Update status
    setTimeout(() => {
      const cookies = document.cookie.split(';').map(cookie => cookie.trim())
      const adminCookie = cookies.find(cookie => cookie.startsWith('admin_auth='))
      const testCookie = cookies.find(cookie => cookie.startsWith('test_cookie='))
      
      setCookieStatus(`Admin cookie: ${adminCookie ? 'Found' : 'Not found'}, Test cookie: ${testCookie ? 'Found' : 'Not found'}`)
      setTestCookieSet(!!testCookie)
    }, 100)
  }

  return (
    <div className="mt-8 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Cookie Diagnostics</h3>
      <p className="mb-4 text-sm">{cookieStatus}</p>
      
      {!testCookieSet ? (
        <Button onClick={setTestCookie} variant="outline" size="sm">
          Test Cookie Setting
        </Button>
      ) : (
        <p className="text-sm text-green-600 dark:text-green-400">
          Test cookie set successfully! Your browser accepts cookies from this site.
        </p>
      )}
      
      <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
        <p>If the test cookie can be set but the admin cookie is not found, the issue is likely with the server-side cookie setting.</p>
        <p>If neither cookie can be set, check your browser settings or try a different browser.</p>
      </div>
    </div>
  )
} 