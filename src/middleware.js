const { NextResponse } = require('next/server');

function middleware(request) {
  const origin = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.jwe.in';

  // Handle API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // For preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
          'Access-Control-Expose-Headers': 'Set-Cookie'
        },
      });
    }

    // For actual requests
    const response = NextResponse.next();
    
    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Expose-Headers', 'Set-Cookie');
    
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