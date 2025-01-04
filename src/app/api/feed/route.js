import { NextResponse } from 'next/server'
import JSON5 from 'json5'

const FEED_URL = 'https://149ff8376a964c67a0af03641403af20.s3.pub1.infomaniak.cloud/feeds/9QMh31cCQtuxnR8Np2_N5g.json'

export async function GET(request) {
  try {
    console.log('Fetching feed from:', FEED_URL)
    const res = await fetch(FEED_URL, {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    console.log('Feed response status:', res.status)
    if (!res.ok) {
      console.error('Feed response not OK:', res.status, res.statusText)
      throw new Error(`Failed to fetch feed: ${res.status} ${res.statusText}`)
    }

    const rawData = await res.text()
    console.log('Raw feed data:', rawData.slice(0, 200) + '...')

    try {
      // Use JSON5 to parse the malformed JSON
      const data = JSON5.parse(rawData)
      console.log('Successfully parsed feed data')
      return NextResponse.json(data)
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message)
      console.error('Raw data:', rawData)
      throw new Error(`Failed to parse feed data: ${parseError.message}`)
    }
  } catch (error) {
    console.error('Error fetching feed:', error)
    return NextResponse.json({ 
      error: error.message,
      items: [{
        id: 'error',
        title: 'Unable to load articles',
        description: `Error: ${error.message}. Please try again later.`,
        href: '#',
        publicationName: 'Error',
        dateDisplay: new Date().toLocaleDateString(),
        dateISO: new Date().toISOString().split('T')[0]
      }]
    }, { 
      status: 500 
    })
  }
}
