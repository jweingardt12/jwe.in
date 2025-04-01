import { NextResponse } from 'next/server'
import { parseString } from 'xml2js'
import { promisify } from 'util'

const parseXML = promisify(parseString)
const FEED_URL = 'https://bg.raindrop.io/rss/public/51518726'

export async function GET(request) {
  try {
    // Check if the request has a 'fresh' parameter to bypass cache
    const { searchParams } = new URL(request.url)
    const fresh = searchParams.has('fresh')
    
    console.log('Fetching feed from:', FEED_URL, fresh ? '(fresh data requested)' : '')
    
    // Add more robust error handling for the fetch request
    let res;
    try {
      res = await fetch(FEED_URL, {
        headers: {
          'Accept': 'application/xml, application/rss+xml, text/xml',
          'Accept-Encoding': 'gzip',
          'User-Agent': 'jwe.in/1.0 (https://jwe.in)'
        },
        next: fresh ? { revalidate: 0 } : { revalidate: 3600 } // No cache if fresh, otherwise cache for 1 hour
      })
    } catch (fetchError) {
      console.error('Network error fetching feed:', fetchError)
      return NextResponse.json({ 
        error: `Network error fetching feed: ${fetchError.message}`,
        items: []
      }, { status: 503 })
    }

    // Log response status and headers
    console.log('Feed response status:', res.status, res.statusText)
    console.log('Feed response headers:', Object.fromEntries(res.headers.entries()))

    if (!res.ok) {
      console.error(`Failed to fetch feed: ${res.status} ${res.statusText}`)
      // Try to get the error response body
      let errorBody = ''
      try {
        errorBody = await res.text()
        console.error('Error response body:', errorBody.substring(0, 500) + '...')
      } catch (e) {
        console.error('Could not read error response body')
      }
      
      throw new Error(`Failed to fetch feed: ${res.status} ${res.statusText}`)
    }

    // Get the raw data with error handling
    let rawData
    try {
      rawData = await res.text()
      // Log a snippet of the raw data to avoid overwhelming logs
      console.log('Raw feed data (first 500 chars):', rawData.substring(0, 500) + '...')
    } catch (textError) {
      console.error('Error reading response text:', textError)
      return NextResponse.json({ 
        error: `Error reading response: ${textError.message}`,
        items: []
      }, { status: 500 })
    }
    
    // Validate that we have XML data before parsing
    if (!rawData || !rawData.trim().startsWith('<?xml') && !rawData.trim().startsWith('<rss')) {
      console.error('Invalid XML response:', rawData.substring(0, 500) + '...')
      return NextResponse.json({ 
        error: 'Invalid XML response from feed source',
        items: []
      }, { status: 500 })
    }
    
    // Parse XML to JSON using xml2js
    let result
    try {
      result = await parseXML(rawData)
    } catch (parseError) {
      console.error('Error parsing XML:', parseError)
      return NextResponse.json({ 
        error: `Error parsing XML: ${parseError.message}`,
        items: []
      }, { status: 500 })
    }
    
    // Validate the parsed result structure
    if (!result || !result.rss || !result.rss.channel || !result.rss.channel[0]) {
      console.error('Invalid RSS structure:', JSON.stringify(result, null, 2))
      return NextResponse.json({ 
        error: 'Invalid RSS feed structure',
        items: []
      }, { status: 500 })
    }

    const rssItems = result.rss.channel[0].item || []
    console.log(`Found ${rssItems.length} items in feed`)

    // Extract items from RSS feed
    const items = rssItems.map((item, index) => {
      // Extract all possible link sources
      const possibleLinks = [
        item.link?.[0],
        item.guid?.[0]?._,
        item.guid?.[0],
        item.url?.[0],
        item.id?.[0]
      ].filter(Boolean)

      const link = possibleLinks[0] || '#'

      // Extract media URLs
      const mediaUrls = [
        // Try to get thumbnail URL
        item.thumbnail?.[0]?.$.url,
        // Try media:content
        item['media:content']?.[0]?.$.url,
        // Try media:thumbnail
        item['media:thumbnail']?.[0]?.$.url,
        // Try enclosure
        item.enclosure?.[0]?.$.url,
        // Try to get image from content
        ...(item.content?.[0]?.match(/<img[^>]+src="([^">\']+)"[^>]*>/g) || [])
          .map(img => img.match(/src="([^">\']+)"/)?.[1])
          .filter(Boolean),
        // Try to get image from description
        ...(item.description?.[0]?.match(/<img[^>]+src="([^">\']+)"[^>]*>/g) || [])
          .map(img => img.match(/src="([^">\']+)"/)?.[1])
          .filter(Boolean)
      ].filter(Boolean)
      
      // Extract CDATA content from description
      const description = item.description?.[0] || ''
      
      const processedItem = {
        id: link,
        title: item.title?.[0] || 'Untitled',
        url: link,
        content_text: description,
        date_published: item.pubDate?.[0] ? new Date(item.pubDate[0]).toISOString() : null,
        dateDisplay: item.pubDate?.[0] ? new Date(item.pubDate[0]).toLocaleDateString() : null,
        dateISO: item.pubDate?.[0] ? new Date(item.pubDate[0]).toISOString() : null,
        publicationName: item['dc:creator']?.[0] || 'Unknown',
        _reeder: {
          feed: {
            title: item['dc:creator']?.[0] || 'Unknown'
          },
          media: mediaUrls.map(url => ({ url }))
        }
      }

      return processedItem
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error processing feed:', error)
    return NextResponse.json({ 
      error: error.message,
      items: []
    }, { 
      status: 500 
    })
  }
}
