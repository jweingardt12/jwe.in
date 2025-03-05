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
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400'
        },
      });
    }

    // For actual requests
    const response = NextResponse.next();
    
    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', '*');
    response.headers.set('Access-Control-Allow-Headers', '*');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    return response;
  }

  // Protect /work/create route
  if (request.nextUrl.pathname.startsWith('/work/create')) {
    const authCookie = request.cookies.get('admin_auth');
    
    // Debug cookie information
    console.log('Auth cookie:', authCookie ? 'exists' : 'missing');
    console.log('Request URL:', request.nextUrl.pathname);
    console.log('Request method:', request.method);
    
    // If no auth cookie, redirect to login
    if (!authCookie?.value) {
      console.log('No auth cookie found, redirecting to login');
      const loginUrl = new URL('/work/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verify the auth cookie value matches our env var
    const passwordMatches = authCookie.value === process.env.ADMIN_PASSWORD;
    console.log('Password match:', passwordMatches ? 'yes' : 'no');
    
    if (!passwordMatches) {
      console.log('Password mismatch, redirecting to login');
      const loginUrl = new URL('/work/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    console.log('Authentication successful, allowing access to create page');
    return NextResponse.next();
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