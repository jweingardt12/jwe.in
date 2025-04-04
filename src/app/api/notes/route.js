import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

export const runtime = 'edge';
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
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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

// Get notes data
export async function GET(request) {
  console.log('GET request received for notes');
  
  try {
    if (!process.env.STORAGE_KV_REST_API_URL || !process.env.STORAGE_KV_REST_API_TOKEN) {
      console.error('Redis configuration is missing');
      return NextResponse.json({ error: 'Storage service configuration missing' }, { 
        status: 503,
        headers: corsHeaders
      });
    }

    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('id');
    
    // If no ID is provided, return all notes
    if (!noteId) {
      console.log('Fetching all notes');
      let keys;
      try {
        keys = await redis.keys('note:*');
        console.log('Found keys:', keys);
      } catch (error) {
        console.error('Failed to fetch keys:', error);
        return NextResponse.json({ error: 'Failed to fetch notes' }, { 
          status: 500,
          headers: corsHeaders
        });
      }
      
      if (!keys || keys.length === 0) {
        console.log('No notes found');
        return NextResponse.json([], { headers: corsHeaders });
      }
      
      try {
        const notes = await Promise.all(
          keys.map(async (key) => {
            try {
              const data = await redis.get(key);
              if (!data) return null;
              
              const id = key.replace('note:', '');
              const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
              return {
                id,
                ...parsedData,
              };
            } catch (error) {
              console.error(`Failed to process key ${key}:`, error);
              return null;
            }
          })
        );
        
        // Filter out any null entries from failed processing
        const validNotes = notes.filter(Boolean);
        console.log('Returning notes count:', validNotes.length);
        return NextResponse.json(validNotes, { headers: corsHeaders });
      } catch (error) {
        console.error('Failed to process notes:', error);
        return NextResponse.json({ error: 'Failed to process notes' }, { 
          status: 500,
          headers: corsHeaders
        });
      }
    }

    console.log('Fetching note for ID:', noteId);
    const key = `note:${noteId}`;
    let noteData;
    try {
      noteData = await redis.get(key);
      console.log('Raw Redis response:', noteData);
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
    
    try {
      // Handle case where data might already be parsed
      const parsedData = typeof noteData === 'string' ? JSON.parse(noteData) : noteData;
      console.log('Successfully retrieved and parsed note');
      return NextResponse.json({
        id: noteId,
        ...parsedData
      }, { headers: corsHeaders });
    } catch (error) {
      console.error('Failed to parse note data:', error);
      return NextResponse.json({ error: 'Invalid note data' }, {
        status: 500,
        headers: corsHeaders
      });
    }
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}

// Store note data
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

    const { noteId, data } = body;
    
    if (!noteId || !data) {
      return NextResponse.json({ error: 'Note ID and data are required' }, { 
        status: 400,
        headers: corsHeaders
      });
    }

    try {
      // Validate that data can be stringified
      const jsonString = JSON.stringify(data);
      
      // Store with 90-day expiration
      await redis.set(`note:${noteId}`, jsonString, { ex: 60 * 60 * 24 * 90 });
      console.log('Successfully stored note for ID:', noteId);
      
      return NextResponse.json({ success: true }, { headers: corsHeaders });
    } catch (error) {
      console.error('Failed to store note:', error);
      return NextResponse.json({ error: 'Failed to store note' }, { 
        status: 500,
        headers: corsHeaders
      });
    }
  } catch (error) {
    console.error('Unexpected error in POST handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}

// Delete note data
export async function DELETE(request) {
  try {
    if (!process.env.STORAGE_KV_REST_API_URL || !process.env.STORAGE_KV_REST_API_TOKEN) {
      console.error('Redis configuration is missing');
      return new NextResponse(JSON.stringify({ error: 'Storage service configuration missing' }), { 
        status: 503,
        headers: corsHeaders
      });
    }

    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('id');

    if (!noteId) {
      console.log('No noteId provided in query params');
      return new NextResponse(JSON.stringify({ error: 'Note ID is required' }), { 
        status: 400,
        headers: corsHeaders
      });
    }

    console.log('Attempting to delete note:', noteId);
    const key = `note:${noteId}`;
    
    try {
      // Attempt to delete the key directly
      const result = await redis.del(key);
      console.log('Delete operation result:', result);
      
      // Redis del returns the number of keys that were removed
      if (result === 0) {
        console.log('Key not found in Redis:', key);
        return new NextResponse(JSON.stringify({ error: 'Note not found' }), { 
          status: 404,
          headers: corsHeaders
        });
      }
      
      console.log('Successfully deleted note:', noteId);
      return new NextResponse(JSON.stringify({ success: true }), { 
        status: 200,
        headers: corsHeaders 
      });
    } catch (redisError) {
      console.error('Redis error during deletion:', redisError);
      return new NextResponse(JSON.stringify({ error: 'Failed to delete note' }), { 
        status: 500,
        headers: corsHeaders
      });
    }
  } catch (error) {
    console.error('Error in DELETE handler:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: corsHeaders
    });
  }
}
