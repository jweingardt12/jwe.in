import ogs from 'open-graph-scraper'
import { Articles } from '@/components/Articles'

async function getArticles(feedUrl) {
  let articles = []
  try {
    const res = await fetch(feedUrl, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    })
    if (!res.ok) {
      throw new Error(`Failed to fetch feed: ${res.status} ${res.statusText}`)
    }
    const feedData = await res.json()

    // Parse the feed items
    for (const item of feedData.items || []) {
      const dateLiked = item.date_published || item.pubDate || null

      let articleDescription = item.description || 'No description found'
      let publicationName = ''
      let imageUrl = ''

      // Scrape OG data if a link exists
      if (item.url) {
        try {
          const { result } = await ogs({ url: item.url })
          if (result.ogDescription) articleDescription = result.ogDescription
          if (result.ogSiteName) publicationName = result.ogSiteName

          if (result.ogImage) {
            if (Array.isArray(result.ogImage) && result.ogImage.length > 0) {
              imageUrl = result.ogImage[0].url
            } else if (result.ogImage.url) {
              imageUrl = result.ogImage.url
            }
          }
        } catch (err) {
          console.warn(`Failed to fetch OG data for ${item.url}:`, err)
        }
      }

      let displayDate = ''
      let isoDate = ''
      if (dateLiked) {
        const d = new Date(dateLiked)
        displayDate = d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
        isoDate = d.toISOString().split('T')[0]
      }

      articles.push({
        id: item.url || Math.random(),
        title: item.title || 'Untitled',
        href: item.url || '#',
        description: articleDescription,
        publicationName,
        dateDisplay: displayDate,
        dateISO: isoDate,
        imageUrl: imageUrl || 'https://via.placeholder.com/256?text=No+Image',
      })
    }
  } catch (error) {
    console.error('Error fetching JSON feed:', error)
  }
  return articles
}

export async function FeedContent({ feedUrl }) {
  const articles = await getArticles(feedUrl)
  return <Articles articles={articles} />
} 