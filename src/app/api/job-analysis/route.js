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

// Get job analysis data
export async function GET(request) {
  console.log('GET request received for job-analysis');
  
  try {
    if (!process.env.STORAGE_KV_REST_API_URL || !process.env.STORAGE_KV_REST_API_TOKEN) {
      console.error('Redis configuration is missing');
      return NextResponse.json({ error: 'Storage service configuration missing' }, { 
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
        console.log('Found keys:', keys);
      } catch (error) {
        console.error('Failed to fetch keys:', error);
        return NextResponse.json({ error: 'Failed to fetch job analyses' }, { 
          status: 500,
          headers: corsHeaders
        });
      }
      
      if (!keys || keys.length === 0) {
        console.log('No job analyses found');
        return NextResponse.json([], { headers: corsHeaders });
      }
      
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
    let jobData;
    try {
      jobData = await redis.get(key);
      console.log('Raw Redis response:', jobData);
    } catch (error) {
      console.error('Failed to fetch data from Redis:', error);
      return NextResponse.json({ error: 'Failed to fetch job analysis' }, {
        status: 500,
        headers: corsHeaders
      });
    }
    
    if (!jobData) {
      console.log('No data found for key:', key);
      return NextResponse.json({ error: 'Job analysis not found' }, { 
        status: 404,
        headers: corsHeaders
      });
    }
    
    try {
      // Handle case where data might already be parsed
      const parsedData = typeof jobData === 'string' ? JSON.parse(jobData) : jobData;
      console.log('Successfully retrieved and parsed job analysis');
      return NextResponse.json({
        id: jobId,
        ...parsedData
      }, { headers: corsHeaders });
    } catch (error) {
      console.error('Failed to parse job data:', error);
      return NextResponse.json({ error: 'Invalid job analysis data' }, {
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

// Store job analysis data
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
    if (!process.env.STORAGE_KV_REST_API_URL || !process.env.STORAGE_KV_REST_API_TOKEN) {
      console.error('Redis configuration is missing');
      return new NextResponse(JSON.stringify({ error: 'Storage service configuration missing' }), { 
        status: 503,
        headers: corsHeaders
      });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');

    if (!jobId) {
      console.log('No jobId provided in query params');
      return new NextResponse(JSON.stringify({ error: 'Job ID is required' }), { 
        status: 400,
        headers: corsHeaders
      });
    }

    console.log('Attempting to delete job analysis:', jobId);
    const key = `job-analysis:${jobId}`;
    
    try {
      // Attempt to delete the key directly
      const result = await redis.del(key);
      console.log('Delete operation result:', result);
      
      // Redis del returns the number of keys that were removed
      if (result === 0) {
        console.log('Key not found in Redis:', key);
        return new NextResponse(JSON.stringify({ error: 'Job analysis not found' }), { 
          status: 404,
          headers: corsHeaders
        });
      }
      
      console.log('Successfully deleted job analysis:', jobId);
      return new NextResponse(JSON.stringify({ success: true }), { 
        status: 200,
        headers: corsHeaders 
      });
    } catch (redisError) {
      console.error('Redis error during deletion:', redisError);
      return new NextResponse(JSON.stringify({ error: 'Failed to delete job analysis' }), { 
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