import { NextResponse } from 'next/server'

// CORS headers
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
    // Create response with success message
    const response = NextResponse.json(
      { 
        success: true,
        message: 'Logged out successfully'
      },
      { status: 200, headers: baseHeaders }
    );

    // Clear the auth cookie
    response.cookies.set('admin_auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Expire immediately
      expires: new Date(0) // Also set expires to the past
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: baseHeaders }
    );
  }
}
