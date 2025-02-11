import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    
    // Check if password matches environment variable
    if (password === process.env.ADMIN_PASSWORD) {
      // Set auth cookie
      cookies().set('admin_auth', password, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
      
      return NextResponse.json({ success: true }, { headers: corsHeaders })
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