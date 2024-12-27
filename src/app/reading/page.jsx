import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'

export const metadata = {
  title: "What I'm Reading",
  description: 'Recently liked articles, displayed in descending order.',
}

export default async function ReadingPage() {
  const feedUrl = 'https://reederapp.net/9QMh31cCQtuxnR8Np2_N5g.json'
  let feedData = { items: [] }

  try {
    const res = await fetch(feedUrl, { 
      next: { revalidate: 3600 },
      cache: 'force-cache'
    })
    if (!res.ok) throw new Error(`Failed to fetch feed: ${res.status}`)
    feedData = await res.json()
  } catch (error) {
    console.error('Error fetching feed:', error)
  }

  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          Reading List
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          Articles and resources I've found interesting.
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        {feedData.items?.map((post) => (
          <Card key={post.url} as="article" className="md:grid md:grid-cols-4 md:items-baseline">
            <Card.Title href={post.url}>
              {post.title}
            </Card.Title>
            <Card.Description>{post.description}</Card.Description>
          </Card>
        ))}
      </div>
    </Container>
  )
}