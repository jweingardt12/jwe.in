import { NextResponse } from 'next/server'
import { parseString } from 'xml2js'
import { promisify } from 'util'

const parseXML = promisify(parseString)
const FEED_URL = 'https://bg.raindrop.io/rss/public/51518726'

export async function GET(request) {
  try {
    console.log('Fetching feed from:', FEED_URL)
    const res = await fetch(FEED_URL, {
      headers: {
        'Accept': 'application/xml, application/rss+xml, text/xml',
        'Accept-Encoding': 'gzip'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch feed: ${res.status} ${res.statusText}`)
    }

    const rawData = await res.text()
    console.log('Raw feed data:', rawData)
    
    // Parse XML to JSON using xml2js
    const result = await parseXML(rawData)
    const rssItems = result.rss.channel[0].item || []

    // Extract items from RSS feed
    const items = rssItems.map((item, index) => {
      // Log raw item data
      console.log(`Raw RSS item ${index}:`, JSON.stringify(item, null, 2))

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
        ...(item.content?.[0]?.match(/<img[^>]+src="([^">]+)"/g) || [])
          .map(img => img.match(/src="([^">]+)"/)?.[1])
          .filter(Boolean),
        // Try to get image from description
        ...(item.description?.[0]?.match(/<img[^>]+src="([^">]+)"/g) || [])
          .map(img => img.match(/src="([^">]+)"/)?.[1])
          .filter(Boolean)
      ].filter(Boolean)

      // Log media URLs found
      console.log(`Media URLs for item ${index}:`, mediaUrls)
      
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

      // Log the final processed item
      console.log(`Final processed item ${index}:`, {
        id: processedItem.id,
        title: processedItem.title,
        url: processedItem.url,
        mediaUrls: processedItem._reeder.media.map(m => m.url)
      })

      return processedItem
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching feed:', error)
    return NextResponse.json({ 
      error: error.message,
      items: []
    }, { 
      status: 500 
    })
  }
}
