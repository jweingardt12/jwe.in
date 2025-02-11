const { NextResponse } = require('next/server');

function middleware(request) {
  // Handle API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Create the response first
    const response = request.method === 'OPTIONS'
      ? new NextResponse(null, { status: 204 })
      : NextResponse.next();

    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    // Apply CORS headers to the response
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  // Protect /work/create route
  if (request.nextUrl.pathname.startsWith('/work/create')) {
    const authCookie = request.cookies.get('admin_auth');

    // If no auth cookie, redirect to login
    if (!authCookie?.value) {
      const loginUrl = new URL('/work/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verify the auth cookie value matches our env var
    if (authCookie.value !== process.env.ADMIN_PASSWORD) {
      const loginUrl = new URL('/work/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

module.exports = {
  middleware,
  config: {
    matcher: [
      '/work/create',
      '/api/:path*'
    ]
  }
};