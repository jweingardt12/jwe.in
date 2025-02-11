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

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function POST(request) {
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
      // Create response with success
      const response = NextResponse.json(
        { success: true },
        { status: 200, headers: corsHeaders }
      );

      // Set auth cookie on the response
      response.cookies.set('admin_auth', password, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/'
      });
      
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