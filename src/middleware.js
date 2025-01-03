import { NextResponse } from 'next/server'

export async function middleware(request) {
  const url = new URL(request.url)
  if (url.pathname.startsWith('/api/openpanel')) {
    const openpanelUrl = new URL(url.pathname.replace('/api/openpanel', ''), process.env.NEXT_PUBLIC_OPENPANEL_API_URL)
    const response = await fetch(openpanelUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENPANEL_SECRET}`,
      },
      body: request.method !== 'GET' ? await request.text() : undefined,
    })
    
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/api/openpanel/:path*',
}
