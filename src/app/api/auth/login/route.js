import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const origin = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : 'https://www.jwe.in';

// CORS headers with credentials
const corsHeaders = {
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400'
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function POST(request) {
  // Early return if not the correct origin
  const requestOrigin = request.headers.get('origin');
  if (requestOrigin !== origin) {
    console.error('Invalid origin:', requestOrigin);
    return NextResponse.json(
      { error: 'Invalid origin' },
      { status: 403, headers: corsHeaders }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Check if password matches environment variable
    if (password === process.env.ADMIN_PASSWORD) {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      };

      // Create response with success
      const response = NextResponse.json(
        { success: true },
        { status: 200, headers: corsHeaders }
      );

      // Set auth cookie on the response
      response.cookies.set('admin_auth', password, cookieOptions);
      
      return response;
    }
    
    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
} 