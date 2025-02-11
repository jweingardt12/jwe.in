const { NextResponse } = require('next/server');

function middleware(request) {
  // Handle API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // For preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // For actual requests
    const response = NextResponse.next();
    
    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
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