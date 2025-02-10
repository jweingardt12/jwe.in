import { NextResponse } from 'next/server'

export function middleware(request) {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next()

    // Add the CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')

    // Handle OPTIONS request
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: response.headers
      })
    }

    return response
  }

  // Protect /work/create route
  if (request.nextUrl.pathname.startsWith('/work/create')) {
    const authCookie = request.cookies.get('admin_auth')
    
    // If no auth cookie, redirect to login
    if (!authCookie?.value) {
      const loginUrl = new URL('/work/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
    
    // Verify the auth cookie value matches our env var
    if (authCookie.value !== process.env.ADMIN_PASSWORD) {
      const loginUrl = new URL('/work/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/work/create',
    '/api/:path*'
  ]
} 