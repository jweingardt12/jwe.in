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

// Get blog posts data
export async function GET(request) {
  console.log('GET request received for blog-posts');
  
  try {
    if (!process.env.STORAGE_KV_REST_API_URL || !process.env.STORAGE_KV_REST_API_TOKEN) {
      console.error('Redis configuration is missing');
      return NextResponse.json({ error: 'Storage service configuration missing' }, { 
        status: 503,
        headers: corsHeaders
      });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');
    
    // If no ID is provided, return all blog posts
    if (!postId) {
      console.log('Fetching all blog posts');
      let keys;
      try {
        keys = await redis.keys('blog-post:*');
        console.log('Found keys:', keys);
      } catch (error) {
        console.error('Failed to fetch keys:', error);
        return NextResponse.json({ error: 'Failed to fetch blog posts' }, { 
          status: 500,
          headers: corsHeaders
        });
      }
      
      if (!keys || keys.length === 0) {
        console.log('No blog posts found');
        return NextResponse.json([], { headers: corsHeaders });
      }
      
      try {
        const posts = await Promise.all(
          keys.map(async (key) => {
            try {
              const data = await redis.get(key);
              if (!data) return null;
              
              const id = key.replace('blog-post:', '');
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
        const validPosts = posts.filter(Boolean);
        console.log('Returning posts count:', validPosts.length);
        return NextResponse.json(validPosts, { headers: corsHeaders });
      } catch (error) {
        console.error('Failed to process posts:', error);
        return NextResponse.json({ error: 'Failed to process blog posts' }, { 
          status: 500,
          headers: corsHeaders
        });
      }
    }

    console.log('Fetching blog post for ID:', postId);
    const key = `blog-post:${postId}`;
    let postData;
    try {
      postData = await redis.get(key);
      console.log('Raw Redis response:', postData);
    } catch (error) {
      console.error('Failed to fetch data from Redis:', error);
      return NextResponse.json({ error: 'Failed to fetch blog post' }, {
        status: 500,
        headers: corsHeaders
      });
    }
    
    if (!postData) {
      console.log('No data found for key:', key);
      return NextResponse.json({ error: 'Blog post not found' }, { 
        status: 404,
        headers: corsHeaders
      });
    }
    
    try {
      // Handle case where data might already be parsed
      const parsedData = typeof postData === 'string' ? JSON.parse(postData) : postData;
      console.log('Successfully retrieved and parsed blog post');
      return NextResponse.json({
        id: postId,
        ...parsedData
      }, { headers: corsHeaders });
    } catch (error) {
      console.error('Failed to parse post data:', error);
      return NextResponse.json({ error: 'Invalid blog post data' }, {
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

// Store blog post data
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

    const { postId, data, publish } = body;
    
    if (!postId || !data) {
      return NextResponse.json({ error: 'Post ID and data are required' }, { 
        status: 400,
        headers: corsHeaders
      });
    }

    try {
      // Validate that data can be stringified
      const jsonString = JSON.stringify(data);
      
      // Store with 90-day expiration
      await redis.set(`blog-post:${postId}`, jsonString, { ex: 60 * 60 * 24 * 90 });
      console.log('Successfully stored blog post for ID:', postId);
      
      // If publish flag is true, note that in the response
      if (publish && data.title && data.content) {
        return NextResponse.json({ 
          success: true, 
          message: 'Blog post saved. Use the publish endpoint to create the MDX file.' 
        }, { headers: corsHeaders });
      }
      
      return NextResponse.json({ success: true }, { headers: corsHeaders });
    } catch (error) {
      console.error('Failed to store blog post:', error);
      return NextResponse.json({ error: 'Failed to store blog post' }, { 
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

// Delete blog post data
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
    const postId = searchParams.get('id');

    if (!postId) {
      console.log('No postId provided in query params');
      return new NextResponse(JSON.stringify({ error: 'Post ID is required' }), { 
        status: 400,
        headers: corsHeaders
      });
    }

    console.log('Attempting to delete blog post:', postId);
    const key = `blog-post:${postId}`;
    
    try {
      // Attempt to delete the key directly
      const result = await redis.del(key);
      console.log('Delete operation result:', result);
      
      // Redis del returns the number of keys that were removed
      if (result === 0) {
        console.log('Key not found in Redis:', key);
        return new NextResponse(JSON.stringify({ error: 'Blog post not found' }), { 
          status: 404,
          headers: corsHeaders
        });
      }
      
      console.log('Successfully deleted blog post:', postId);
      return new NextResponse(JSON.stringify({ success: true }), { 
        status: 200,
        headers: corsHeaders 
      });
    } catch (redisError) {
      console.error('Redis error during deletion:', redisError);
      return new NextResponse(JSON.stringify({ error: 'Failed to delete blog post' }), { 
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
