import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl

  // Add OpenPanel secret to outgoing requests to OpenPanel API
  if (hostname === 'openpanel.dev' || pathname.includes('/op1.js')) {
    const headers = new Headers(request.headers)
    headers.set('Authorization', `Bearer ${process.env.OPENPANEL_SECRET}`)
    headers.set('Content-Type', 'application/javascript')
    
    return NextResponse.next({
      request: {
        headers
      }
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/:path*',
    '/op1.js'
  ]
}
