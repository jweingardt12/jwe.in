import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'job-analysis.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

// Initialize empty data file if it doesn't exist
async function initDataFile() {
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({}))
  }
}

// Get job analysis data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('id')
    
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    await ensureDataDir()
    await initDataFile()
    
    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'))
    const jobData = data[jobId]
    
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

    await ensureDataDir()
    await initDataFile()
    
    const existingData = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'))
    existingData[jobId] = data
    
    await fs.writeFile(DATA_FILE, JSON.stringify(existingData, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error storing job analysis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 