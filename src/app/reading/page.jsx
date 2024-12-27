
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/Card'

export const metadata = {
  title: 'Liked Articles',
  description: 'Recently liked articles, displayed in descending order.',
}

// This ensures the page is generated at build time
export const generateStaticParams = async () => {
  return []
}

async function getFeedData() {
  const feedUrl = 'https://reederapp.net/9QMh31cCQtuxnR8Np2_N5g.json'
  try {
    const res = await fetch(feedUrl, { next: { revalidate: false } })
    if (!res.ok) {
      throw new Error(`Failed to fetch feed`)
    }
    return await res.json()
  } catch (error) {
    console.error('Error fetching JSON feed:', error)
    return { items: [] }
  }
}

export default async function ReadingPage() {
  const feedData = await getFeedData()
  const articles = feedData.items?.map(item => ({
    id: item.id || item.url,
    title: item.title,
    href: item.url,
    description: item.content_text || item.description,
    publicationName: item.author?.name || '',
    dateDisplay: new Date(item.date_published || item.pubDate).toLocaleDateString(),
    dateISO: item.date_published || item.pubDate,
    imageUrl: item.image || 'https://via.placeholder.com/256?text=No+Image'
  })) || []

  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            Liked Articles
          </h2>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            Recently liked articles, displayed in descending order.
          </p>

          <div className="mt-10 space-y-8 border-t border-zinc-100 dark:border-zinc-700/40 pt-10 sm:mt-16 sm:pt-16">
            {articles.map((post) => (
              <article key={post.id} className="max-w-xl">
                <Card as="div">
                  <div className="flex w-full flex-col items-start md:flex-row md:items-start md:justify-between">
                    <div className="md:pr-6">
                      <Card.Eyebrow as="p">
                        {post.dateDisplay && (
                          <time dateTime={post.dateISO}>{post.dateDisplay}</time>
                        )}
                        {post.publicationName && (
                          <>
                            <span className="mx-2 text-zinc-300" aria-hidden="true">
                              ·
                            </span>
                            {post.publicationName}
                          </>
                        )}
                      </Card.Eyebrow>
                      <Card.Title href={post.href}>{post.title}</Card.Title>
                      <Card.Description>
                        {post.description}
                      </Card.Description>
                    </div>
                    <div className="mt-4 w-full max-w-[8rem] self-center md:mt-0 md:w-auto md:pl-6">
                      <div className="relative h-32 w-32 sm:h-40 sm:w-40 lg:h-44 lg:w-44">
                        <Image
                          alt=""
                          src={post.imageUrl}
                          fill
                          className="rounded-md object-cover bg-zinc-100 dark:bg-zinc-800"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
