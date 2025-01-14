import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

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
      
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 