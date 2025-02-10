import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

// Validate Redis configuration
if (!process.env.STORAGE_KV_REST_API_URL || !process.env.STORAGE_KV_REST_API_TOKEN) {
  console.error('Redis configuration is missing. Please check environment variables STORAGE_KV_REST_API_URL and STORAGE_KV_REST_API_TOKEN');
}

// Initialize Redis with error handling
let redis;
try {
  if (!process.env.STORAGE_KV_REST_API_URL || !process.env.STORAGE_KV_REST_API_TOKEN) {
    throw new Error('Redis configuration is missing');
  }
  redis = new Redis({
    url: process.env.STORAGE_KV_REST_API_URL,
    token: process.env.STORAGE_KV_REST_API_TOKEN,
  });
  console.log('Redis initialized successfully with URL:', process.env.STORAGE_KV_REST_API_URL);
} catch (error) {
  console.error('Failed to initialize Redis:', error.message);
  console.error('Stack trace:', error.stack);
  // Don't throw here - we'll handle connection issues in the route handlers
}

// Get job analysis data
export async function GET(request) {
  try {
    if (!redis) {
      console.error('Redis client not initialized');
      return NextResponse.json({ error: 'Storage service unavailable' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');
    
    // If no ID is provided, return all job analyses
    if (!jobId) {
      console.log('Fetching all job analyses');
      let keys;
      try {
        keys = await redis.keys('job-analysis:*');
      } catch (error) {
        console.error('Failed to fetch keys:', error);
        return NextResponse.json({ error: 'Failed to fetch job analyses' }, { status: 500 });
      }
      console.log('Found keys:', keys);
      
      try {
        const analyses = await Promise.all(
          keys.map(async (key) => {
            try {
              const data = await redis.get(key);
              if (!data) return null;
              
              const id = key.replace('job-analysis:', '');
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
        const validAnalyses = analyses.filter(Boolean);
        console.log('Returning analyses count:', validAnalyses.length);
        return NextResponse.json(validAnalyses);
      } catch (error) {
        console.error('Failed to process analyses:', error);
        return NextResponse.json({ error: 'Failed to process job analyses' }, { status: 500 });
      }
    }

    console.log('Fetching job analysis for ID:', jobId)
    const key = `job-analysis:${jobId}`
    const jobData = await redis.get(key)
    
    if (!jobData) {
      console.log('No data found for key:', key)
      return NextResponse.json({ error: 'Job analysis not found' }, { status: 404 })
    }
    
    // Handle case where data might already be parsed
    const parsedData = typeof jobData === 'string' ? JSON.parse(jobData) : jobData
    console.log('Successfully retrieved job analysis')
    return NextResponse.json({
      id: jobId,
      ...parsedData
    })
  } catch (error) {
    console.error('Error getting job analysis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Store job analysis data
export async function POST(request) {
  try {
    if (!redis) {
      console.error('Redis client not initialized');
      return NextResponse.json({ error: 'Storage service unavailable' }, { status: 503 });
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { jobId, data } = body;
    
    if (!jobId || !data) {
      return NextResponse.json({ error: 'Job ID and data are required' }, { status: 400 });
    }

    try {
      // Validate that data can be stringified
      const jsonString = JSON.stringify(data);
      
      // Store with 90-day expiration to match analyze-job route
      await redis.set(`job-analysis:${jobId}`, jsonString, { ex: 60 * 60 * 24 * 90 });
      console.log('Successfully stored job analysis for ID:', jobId);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Failed to store job analysis:', error);
      return NextResponse.json({ error: 'Failed to store job analysis' }, { status: 500 });
    }
  } catch (error) {
    console.error('Unexpected error in POST handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete job analysis data
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('id')

    if (!jobId) {
      console.log('No jobId provided in query params')
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    console.log('Checking if job analysis exists:', jobId)
    const key = `job-analysis:${jobId}`
    
    // Get all keys to check what we have
    const allKeys = await redis.keys('job-analysis:*')
    console.log('All Redis keys:', allKeys)
    
    // First check if the key exists
    const exists = await redis.exists(key)
    console.log('Key exists check:', { key, exists })

    if (!exists) {
      console.log('Key not found in Redis:', key)
      return NextResponse.json({ error: 'Job analysis not found' }, { status: 404 })
    }

    console.log('Deleting job analysis with ID:', jobId)
    await redis.del(key)
    console.log('Successfully deleted job analysis:', jobId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting job analysis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 