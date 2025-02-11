import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// CORS headers with credentials
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.jwe.in',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Expose-Headers': 'Set-Cookie'
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function POST(request) {
  try {
    const { password } = await request.json()
    
    // Log for debugging (remove in production)
    console.log('Received password:', password);
    console.log('Expected password:', process.env.ADMIN_PASSWORD);
    
    // Check if password matches environment variable
    if (password === process.env.ADMIN_PASSWORD) {
      // Create response with success
      const response = NextResponse.json(
        { success: true },
        { 
          status: 200,
          headers: corsHeaders
        }
      );

      // Set auth cookie on the response
      response.cookies.set('admin_auth', password, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.jwe.in' : 'localhost'
      });
      
      return response;
    }
    
    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401, headers: corsHeaders }
    )
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
} 