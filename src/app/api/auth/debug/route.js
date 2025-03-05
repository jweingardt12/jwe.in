import { NextResponse } from 'next/server'

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  // Check if the request is from localhost
  const host = request.headers.get('host') || '';
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  
  if (!isLocalhost) {
    return NextResponse.json({ error: 'This endpoint is only available in development mode' }, { status: 403 });
  }
  
  // Return environment variable status (not the actual values)
  return NextResponse.json({
    environment: process.env.NODE_ENV || 'not set',
    adminPasswordSet: !!process.env.ADMIN_PASSWORD,
    adminPasswordLength: process.env.ADMIN_PASSWORD?.length || 0,
    openaiApiKeySet: !!process.env.OPENAI_API_KEY,
    redisUrlSet: !!process.env.STORAGE_KV_REST_API_URL,
    redisTokenSet: !!process.env.STORAGE_KV_REST_API_TOKEN,
  });
} 