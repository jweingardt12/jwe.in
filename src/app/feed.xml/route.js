import assert from 'assert'
import * as cheerio from 'cheerio'
import { Feed } from 'feed'
import Parser from 'rss-parser'

export async function GET() {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jwe.in'
  const FEED_URL = 'https://reederapp.net/9QMh31cCQtuxnR8Np2_N5g.json'

  let author = {
    name: 'Jason Weingardt',
    email: 'jason@jwe.in',
  }

  let feed = new Feed({
    title: author.name,
    description: 'What I\'m reading',
    author,
    id: siteUrl,
    link: siteUrl,
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
      json: FEED_URL,
    },
  })

  try {
    const res = await fetch(FEED_URL)
    if (!res.ok) throw new Error('Failed to fetch feed')
    const feedData = await res.json()
    
    // Add items to feed
    for (let item of (feedData.items || [])) {
      feed.addItem({
        title: item.title || '',
        id: item.url || '',
        link: item.url || '',
        content: item.content_text || item.content_html || item.description || item.summary || '',
        author: [author],
        contributor: [author],
        date: new Date(item.date_published || item.pubDate || Date.now()),
      })
    }
  } catch (error) {
    console.error('Error fetching feed:', error)
  }

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      'content-type': 'application/xml',
      'cache-control': 's-maxage=31556952',
    },
  })
}
