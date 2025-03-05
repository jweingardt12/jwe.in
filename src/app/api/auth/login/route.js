import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Most permissive CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400'
};

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Handle OPTIONS request for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function POST(request) {
  // Set response headers for all responses
  const baseHeaders = {
    ...corsHeaders,
    'Content-Type': 'application/json'
  };

  try {
    const body = await request.json().catch(() => ({}));
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400, headers: baseHeaders }
      );
    }
    
    // Check if password matches environment variable
    if (password === process.env.ADMIN_PASSWORD) {
      console.log('Password matched, setting cookie...');
      
      // Get the host from the request
      const host = request.headers.get('host') || '';
      console.log('Request host:', host);
      
      // Create response with success
      const response = NextResponse.json(
        { 
          success: true,
          message: 'Login successful. Redirecting...',
          redirectTo: '/work/create'
        },
        { status: 200, headers: baseHeaders }
      );

      // Set auth cookie on the response
      response.cookies.set('admin_auth', password, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });
      
      console.log('Cookie set, returning response');
      return response;
    }
    
    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401, headers: baseHeaders }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: baseHeaders }
    );
  }
} 