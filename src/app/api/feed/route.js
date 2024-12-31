import { NextResponse } from 'next/server'

const FEED_URL = 'https://reederapp.net/9QMh31cCQtuxnR8Np2_N5g.json'

export async function GET() {
  try {
    const res = await fetch(FEED_URL, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!res.ok) {
      throw new Error('Failed to fetch feed')
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching feed:', error)
    return NextResponse.json({ items: [] }, { status: 500 })
  }
} 