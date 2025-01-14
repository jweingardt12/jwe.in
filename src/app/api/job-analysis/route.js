import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.STORAGE_KV_REST_API_URL,
  token: process.env.STORAGE_KV_REST_API_TOKEN,
})

// Get job analysis data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('id')
    
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    const jobData = await redis.get(`job-analysis:${jobId}`)
    
    if (!jobData) {
      return NextResponse.json({ error: 'Job analysis not found' }, { status: 404 })
    }
    
    return NextResponse.json(jobData)
  } catch (error) {
    console.error('Error getting job analysis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Store job analysis data
export async function POST(request) {
  try {
    const { jobId, data } = await request.json()
    
    if (!jobId || !data) {
      return NextResponse.json({ error: 'Job ID and data are required' }, { status: 400 })
    }

    // Store in Upstash Redis
    await redis.set(`job-analysis:${jobId}`, data)
    
    // Set expiration to 30 days (in seconds)
    await redis.expire(`job-analysis:${jobId}`, 30 * 24 * 60 * 60)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error storing job analysis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 