
/* File: /src/app/reading/page.jsx (Server Component) */

import Link from 'next/link'
import Image from 'next/image'
import ogs from 'open-graph-scraper'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'

export const metadata = {
  title: 'Liked Articles',
  description: 'Recently liked articles, displayed in descending order.',
}

export const revalidate = 0 // Revalidate on every request

export default async function ReadingPage() {
  const feedUrl = 'https://reederapp.net/9QMh31cCQtuxnR8Np2_N5g.json'
  let feedData = { items: [] }

  try {
    const res = await fetch(feedUrl, {
      cache: 'no-store', // Don't cache the response
      headers: {
        'Accept': 'application/json',
      },
    })
    if (!res.ok) {
      throw new Error(`Failed to fetch feed: ${res.status} ${res.statusText}`)
    }
    feedData = await res.json()
  } catch (error) {
    console.error('Error fetching JSON feed:', error)
  }

  // Parse the feed items
  const articles = []
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

  articles.sort((a, b) => {
    if (!a.dateISO) return 1
    if (!b.dateISO) return -1
    return new Date(b.dateISO) - new Date(a.dateISO)
  })

  return (
    <>
      <Container className="mt-16 sm:mt-32">
        <h2 className="text-4xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          What I'm Reading
        </h2>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          Recently liked articles, displayed in descending order.
        </p>

        <div className="mt-10 space-y-8 border-t border-zinc-100 pt-10 dark:border-zinc-700 sm:mt-16 sm:pt-16">
          {articles.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400">
              No articles found or an error occurred.
            </p>
          ) : (
            articles.map((post) => (
              <article key={post.id} className="max-w-xl">
                <Card as="div">
                  <div className="flex w-full flex-row items-start justify-between gap-x-6">
                    <div className="flex-1">
                      <Card.Eyebrow
                        as="p"
                        className="text-zinc-400 dark:text-zinc-500"
                      >
                        {post.dateDisplay && (
                          <time dateTime={post.dateISO}>{post.dateDisplay}</time>
                        )}
                        {post.publicationName && (
                          <>
                            <span
                              className="mx-2 text-zinc-300 dark:text-zinc-600"
                              aria-hidden="true"
                            >
                              ·
                            </span>
                            {post.publicationName}
                          </>
                        )}
                      </Card.Eyebrow>

                      <Card.Title href={post.href} className="text-zinc-800 dark:text-zinc-100">
                        {post.title}
                      </Card.Title>

                      <Card.Description>
                        {post.description}
                      </Card.Description>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="relative h-32 w-32 sm:h-40 sm:w-40 lg:h-44 lg:w-44">
                        <Image
                          alt=""
                          src={post.imageUrl}
                          fill
                          sizes="(min-width: 1024px) 176px, (min-width: 640px) 160px, 128px"
                          className="rounded-md object-cover bg-zinc-200 dark:bg-zinc-800"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </article>
            ))
          )}
        </div>
      </Container>
    </>
  )
}
