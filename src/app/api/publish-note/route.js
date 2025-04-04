import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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

// Publish note as MDX file
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
    
    if (!parsedData.title || !parsedData.content) {
      return NextResponse.json({ error: 'Note must have title and content' }, { 
        status: 400,
        headers: corsHeaders
      });
    }
    
    // Generate a slug from the title if not provided
    const slug = parsedData.slug || parsedData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    // Create the MDX file
    const date = parsedData.date || new Date().toISOString();
    const frontMatter = {
      title: parsedData.title,
      date,
      description: parsedData.description || '',
      author: parsedData.author || 'Jason Weingardt',
      image: parsedData.image || null,
      tags: parsedData.tags || [],
      published: true,
    };
    
    const mdxContent = matter.stringify(parsedData.content, frontMatter);
    const filePath = path.join(process.cwd(), 'src/app/notes', `${slug}.mdx`);
    
    fs.writeFileSync(filePath, mdxContent, 'utf8');
    
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
      message: 'Note published successfully',
      slug,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error publishing note:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}
