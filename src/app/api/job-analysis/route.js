import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

export const runtime = 'nodejs'

// Initialize Redis lazily
let redis = null;
let redisError = null;

async function getRedis() {
  if (redisError) {
    console.error('Redis previously failed to initialize:', redisError);
    return null;
  }

  if (!redis) {
    try {
      if (!process.env.STORAGE_KV_REST_API_URL || !process.env.STORAGE_KV_REST_API_TOKEN) {
        throw new Error('Redis configuration is missing - STORAGE_KV_REST_API_URL and STORAGE_KV_REST_API_TOKEN are required');
      }

      redis = new Redis({
        url: process.env.STORAGE_KV_REST_API_URL,
        token: process.env.STORAGE_KV_REST_API_TOKEN,
      });

      // Test the connection
      await redis.ping();
      console.log('Redis initialized and connected successfully');
    } catch (error) {
      redisError = error;
      console.error('Failed to initialize Redis:', error.message);
      console.error('Stack trace:', error.stack);
      return null;
    }
  }
  return redis;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
};

// Options handler for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

// Get job analysis data
export async function GET(request) {
  try {
    const redis = getRedis();
    if (!redis) {
      console.error('Redis client not initialized');
      return NextResponse.json({ error: 'Storage service unavailable' }, { 
        status: 503,
        headers: corsHeaders
      });
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
        return NextResponse.json({ error: 'Failed to fetch job analyses' }, { 
          status: 500,
          headers: corsHeaders
        });
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
        return NextResponse.json(validAnalyses, { headers: corsHeaders });
      } catch (error) {
        console.error('Failed to process analyses:', error);
        return NextResponse.json({ error: 'Failed to process job analyses' }, { 
          status: 500,
          headers: corsHeaders
        });
      }
    }

    console.log('Fetching job analysis for ID:', jobId);
    const key = `job-analysis:${jobId}`;
    const jobData = await redis.get(key);
    
    if (!jobData) {
      console.log('No data found for key:', key);
      return NextResponse.json({ error: 'Job analysis not found' }, { 
        status: 404,
        headers: corsHeaders
      });
    }
    
    // Handle case where data might already be parsed
    const parsedData = typeof jobData === 'string' ? JSON.parse(jobData) : jobData;
    console.log('Successfully retrieved job analysis');
    return NextResponse.json({
      id: jobId,
      ...parsedData
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error getting job analysis:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}

// Store job analysis data
export async function POST(request) {
  try {
    const redis = getRedis();
    if (!redis) {
      console.error('Redis client not initialized');
      return NextResponse.json({ error: 'Storage service unavailable' }, { 
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

    const { jobId, data } = body;
    
    if (!jobId || !data) {
      return NextResponse.json({ error: 'Job ID and data are required' }, { 
        status: 400,
        headers: corsHeaders
      });
    }

    try {
      // Validate that data can be stringified
      const jsonString = JSON.stringify(data);
      
      // Store with 90-day expiration
      await redis.set(`job-analysis:${jobId}`, jsonString, { ex: 60 * 60 * 24 * 90 });
      console.log('Successfully stored job analysis for ID:', jobId);
      return NextResponse.json({ success: true }, { headers: corsHeaders });
    } catch (error) {
      console.error('Failed to store job analysis:', error);
      return NextResponse.json({ error: 'Failed to store job analysis' }, { 
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

// Delete job analysis data
export async function DELETE(request) {
  try {
    const redis = getRedis();
    if (!redis) {
      console.error('Redis client not initialized');
      return NextResponse.json({ error: 'Storage service unavailable' }, { 
        status: 503,
        headers: corsHeaders
      });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');

    if (!jobId) {
      console.log('No jobId provided in query params');
      return NextResponse.json({ error: 'Job ID is required' }, { 
        status: 400,
        headers: corsHeaders
      });
    }

    console.log('Checking if job analysis exists:', jobId);
    const key = `job-analysis:${jobId}`;
    
    // Get all keys to check what we have
    const allKeys = await redis.keys('job-analysis:*');
    console.log('All Redis keys:', allKeys);
    
    // First check if the key exists
    const exists = await redis.exists(key);
    console.log('Key exists check:', { key, exists });

    if (!exists) {
      console.log('Key not found in Redis:', key);
      return NextResponse.json({ error: 'Job analysis not found' }, { 
        status: 404,
        headers: corsHeaders
      });
    }

    console.log('Deleting job analysis with ID:', jobId);
    await redis.del(key);
    console.log('Successfully deleted job analysis:', jobId);
    
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error deleting job analysis:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders
    });
  }
} 