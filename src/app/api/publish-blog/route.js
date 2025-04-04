import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { v4 as uuidv4 } from 'uuid'

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

// Publish blog post as MDX file
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

    const { postId } = body;
    
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Get the post data from Redis
    const key = `blog-post:${postId}`;
    let postData;
    try {
      postData = await redis.get(key);
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
    
    // Parse the post data
    const parsedData = typeof postData === 'string' ? JSON.parse(postData) : postData;
    
    if (!parsedData.title || !parsedData.content) {
      return NextResponse.json({ error: 'Blog post must have title and content' }, { 
        status: 400,
        headers: corsHeaders
      });
    }
    
    // Generate a slug from the title if not provided
    const slug = parsedData.slug || parsedData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    // In Edge runtime, we can't directly create MDX files
    // Instead, we'll just mark the blog post as published in Redis
    // The actual MDX file will be generated during the build process
    const date = parsedData.date || new Date().toISOString();
    console.log(`Blog post marked for publishing: ${slug}`);
    // The static site generation process will use this data to create the MDX files
    
    // Update the Redis entry with the slug
    const updatedData = {
      ...parsedData,
      slug,
      published: true,
      publishedAt: new Date().toISOString(),
    };
    
    await redis.set(key, JSON.stringify(updatedData), { ex: 60 * 60 * 24 * 90 });
    
    return NextResponse.json({
      success: true,
      message: 'Blog post published successfully',
      slug,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error publishing blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}
