
import assert from 'assert'
import * as cheerio from 'cheerio'
import { Feed } from 'feed'

export async function GET() {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  let author = {
    name: 'Spencer Sharp',
    email: 'spencer@planetaria.tech',
  }

  let feed = new Feed({
    title: author.name,
    description: 'Your blog description',
    author,
    id: siteUrl,
    link: siteUrl,
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
    },
  })

  let articleIds = require
    .context('../articles', true, /\/page\.mdx$/)
    .keys()
    .filter((key) => key.startsWith('./'))
    .map((key) => key.slice(2).replace(/\/page\.mdx$/, ''))

  let articles = []
  for (let id of articleIds) {
    let publicUrl = `${siteUrl}/articles/${id}`
    let content = await import(`../articles/${id}/page.mdx`)
    let { article } = content
    articles.push({ id, publicUrl, ...article })
  }

  // Sort articles by date in descending order
  articles.sort((a, b) => new Date(b.date) - new Date(a.date))

  // Add sorted articles to feed
  for (let article of articles) {
    feed.addItem({
      title: article.title,
      id: article.publicUrl,
      link: article.publicUrl,
      content: article.description,
      author: [author],
      contributor: [author],
      date: new Date(article.date),
    })
  }

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      'content-type': 'application/xml',
      'cache-control': 's-maxage=31556952',
    },
  })
}
