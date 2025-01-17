import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

// Log Redis configuration (without exposing sensitive data)
console.log('Initializing Redis with URL:', process.env.STORAGE_KV_REST_API_URL ? 'configured' : 'missing')

const redis = new Redis({
  url: process.env.STORAGE_KV_REST_API_URL,
  token: process.env.STORAGE_KV_REST_API_TOKEN,
})

// Get job analysis data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('id')
    
    // If no ID is provided, return all job analyses
    if (!jobId) {
      console.log('Fetching all job analyses')
      const keys = await redis.keys('job-analysis:*')
      console.log('Found keys:', keys)
      
      const analyses = await Promise.all(
        keys.map(async (key) => {
          const data = await redis.get(key)
          const id = key.replace('job-analysis:', '')
          const parsedData = typeof data === 'string' ? JSON.parse(data) : data
          return {
            id,
            ...parsedData,
          }
        })
      )
      console.log('Returning analyses count:', analyses.length)
      return NextResponse.json(analyses)
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
    const { jobId, data } = await request.json()
    
    if (!jobId || !data) {
      return NextResponse.json({ error: 'Job ID and data are required' }, { status: 400 })
    }

    // Store without expiration
    await redis.set(`job-analysis:${jobId}`, JSON.stringify(data))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error storing job analysis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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