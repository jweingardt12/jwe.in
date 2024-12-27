/* File: /src/app/reading/page.jsx (Server Component) */
import Link from 'next/link'
import Image from 'next/image'
import ogs from 'open-graph-scraper'
import { Card } from '@/components/Card'  // Adjust the import if needed

export const metadata = {
  title: 'Liked Articles',
  description: 'Recently liked articles, displayed in descending order.',
}

export default async function ReadingPage() {
  const feedUrl = 'https://reederapp.net/9QMh31cCQtuxnR8Np2_N5g.json'

  let feedData = { items: [] }
  try {
    const res = await fetch(feedUrl, { cache: 'no-store' })
    if (!res.ok) {
      throw new Error(`Failed to fetch feed: ${res.status} ${res.statusText}`)
    }
    feedData = await res.json()
  } catch (error) {
    console.error('Error fetching JSON feed:', error)
  }

  // Build array of articles
  const articles = []
  for (const item of feedData.items || []) {
    // Date (adjust field names if your feed differs)
    const dateLiked = item.date_published || item.pubDate || null

    // Fallbacks
    let articleDescription = item.description || 'No description found'
    let publicationName = ''
    let imageUrl = ''

    // Scrape Open Graph data if a link exists
    if (item.url) {
      try {
        const { result } = await ogs({ url: item.url })
        if (result.ogDescription) {
          articleDescription = result.ogDescription
        }
        if (result.ogSiteName) {
          publicationName = result.ogSiteName
        }
        // OG image can be array or single object
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

    // Format date for display (e.g. "Dec 27, 2024")
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
      imageUrl:
        imageUrl || 'https://via.placeholder.com/256?text=No+Image', // fallback
    })
  }

  // Sort descending by date
  articles.sort((a, b) => {
    if (!a.dateISO) return 1
    if (!b.dateISO) return -1
    return new Date(b.dateISO) - new Date(a.dateISO)
  })

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Liked Articles
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Recently liked articles, displayed in descending order.
          </p>

          <div className="mt-10 space-y-8 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16">
            {articles.length === 0 ? (
              <p className="text-gray-500">
                No articles found or an error occurred.
              </p>
            ) : (
              articles.map((post) => (
                <article key={post.id} className="max-w-xl">
                  <Card as="div">
                    {/* Use flex so text is on left, image on right (md+ screens) */}
                    <div className="flex w-full flex-col items-start md:flex-row md:items-start md:justify-between">

                      {/* Left side: Eyebrow (Date + Publication), Title, Description */}
                      <div className="md:pr-6">
                        {/* Eyebrow: Date + Publication Name */}
                        <Card.Eyebrow as="p">
                          {post.dateDisplay && (
                            <time dateTime={post.dateISO}>{post.dateDisplay}</time>
                          )}
                          {post.publicationName && (
                            <>
                              {/* A small dot separator or space */}
                              <span className="mx-2 text-zinc-300" aria-hidden="true">
                                ·
                              </span>
                              {post.publicationName}
                            </>
                          )}
                        </Card.Eyebrow>

                        {/* Title with Card styles */}
                        <Card.Title href={post.href}>{post.title}</Card.Title>

                        {/* Description */}
                        <Card.Description>
                          {post.description}
                        </Card.Description>
                      </div>

                      {/* Right side: Larger image */}
                      <div className="mt-4 w-full max-w-[8rem] self-center md:mt-0 md:w-auto md:pl-6">
                        <div className="relative h-32 w-32 sm:h-40 sm:w-40 lg:h-44 lg:w-44">
                          <Image
                            alt=""
                            src={post.imageUrl}
                            fill
                            className="rounded-md object-cover bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}