import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// CORS headers with credentials
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.jwe.in',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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