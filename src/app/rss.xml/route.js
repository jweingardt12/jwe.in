import { Feed } from 'feed'
import { getAllArticles } from '../../lib/redis-articles'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jwe.in'
  const siteTitle = 'Jason Weingardt'
  const siteDescription = 'Writing on technology, product management, smart home endeavors, and more.'

  // Create a new feed
  const feed = new Feed({
    title: siteTitle,
    description: siteDescription,
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Jason Weingardt`,
    updated: new Date(),
    generator: 'Next.js using Feed',
    feedLinks: {
      rss2: `${siteUrl}/rss.xml`,
      json: `${siteUrl}/feed.json`,
      atom: `${siteUrl}/atom.xml`,
    },
    author: {
      name: 'Jason Weingardt',
      email: 'jason@jwe.in',
      link: siteUrl,
    },
  })

  try {
    // Get all published notes from Redis
    const articles = await getAllArticles('notes')

    // Add each article to the feed
    for (const article of articles) {
      const url = `${siteUrl}/notes/${article.slug}`
      feed.addItem({
        title: article.title,
        id: url,
        link: url,
        description: article.description,
        content: article.content,
        author: [
          {
            name: article.author || 'Jason Weingardt',
            email: 'jason@jwe.in',
            link: siteUrl,
          },
        ],
        date: new Date(article.date),
        image: article.image,
      })
    }

    // Get blog posts too if they exist
    try {
      const blogPosts = await getAllArticles('blog')
      for (const post of blogPosts) {
        const url = `${siteUrl}/blog/${post.slug}`
        feed.addItem({
          title: post.title,
          id: url,
          link: url,
          description: post.description,
          content: post.content,
          author: [
            {
              name: post.author || 'Jason Weingardt',
              email: 'jason@jwe.in',
              link: siteUrl,
            },
          ],
          date: new Date(post.date),
          image: post.image,
        })
      }
    } catch (blogError) {
      console.error('Error fetching blog posts for RSS:', blogError)
      // Continue even if blog posts fail
    }
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    // Return an empty feed if there's an error
  }

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
    },
  })
}
