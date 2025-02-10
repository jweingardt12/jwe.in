const { NextResponse } = require('next/server');

function middleware(request) {
  // Skip CORS handling for non-API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
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