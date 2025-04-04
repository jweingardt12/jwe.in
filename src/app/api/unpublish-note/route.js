import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

// Set cache revalidation time
export const revalidate = 60; // Revalidate every minute

// Initialize Redis
const redis = new Redis({
  url: process.env.STORAGE_KV_REST_API_URL,
  token: process.env.STORAGE_KV_REST_API_TOKEN,
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json'
};

// Options handler for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

// Unpublish note (remove MDX file)
export async function POST(request) {
  try {
    if (!process.env.STORAGE_KV_REST_API_URL || !process.env.STORAGE_KV_REST_API_TOKEN) {
      console.error('Redis configuration is missing');
      return NextResponse.json({ error: 'Storage service configuration missing' }, { 
        status: 503,
        headers: corsHeaders
      });
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json({ error: 'Invalid request body' }, { 
        status: 400,
        headers: corsHeaders
      });
    }

    const { noteId } = body;
    
    if (!noteId) {
      return NextResponse.json({ error: 'Note ID is required' }, { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Get the note data from Redis
    const key = `note:${noteId}`;
    let noteData;
    try {
      noteData = await redis.get(key);
    } catch (error) {
      console.error('Failed to fetch data from Redis:', error);
      return NextResponse.json({ error: 'Failed to fetch note' }, {
        status: 500,
        headers: corsHeaders
      });
    }
    
    if (!noteData) {
      console.log('No data found for key:', key);
      return NextResponse.json({ error: 'Note not found' }, { 
        status: 404,
        headers: corsHeaders
      });
    }
    
    // Parse the note data
    const parsedData = typeof noteData === 'string' ? JSON.parse(noteData) : noteData;
    
    // Check if the note has a slug (was published)
    if (!parsedData.slug) {
      return NextResponse.json({ error: 'Note was not published' }, { 
        status: 400,
        headers: corsHeaders
      });
    }
    
    // Note: In Edge runtime, we can't directly modify the MDX file
    // The unpublished status will be stored in Redis and checked during build
    console.log(`Note marked as unpublished: ${parsedData.slug}`);
    // The actual file update will happen during the build process
    
    // Update the Redis entry to mark as unpublished
    const updatedData = {
      ...parsedData,
      published: false,
      unpublishedAt: new Date().toISOString()
      // Keep the slug for reference
    };
    
    await redis.set(key, JSON.stringify(updatedData), { ex: 60 * 60 * 24 * 90 });
    
    return NextResponse.json({
      success: true,
      message: 'Note unpublished successfully'
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error unpublishing note:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}
