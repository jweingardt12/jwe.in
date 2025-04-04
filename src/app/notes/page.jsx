import { Suspense } from 'react'
import { Container } from '../../components/Container'
import { getAllArticles } from '../../lib/articles'
import { NoteCard } from '../../components/NoteCard'
import { LoadingSkeleton } from '../../components/ArticleSkeleton'

async function ArticlesFeed() {
  const articles = await getAllArticles()
  
  // Ensure articles are sorted by date (newest first)
  const sortedArticles = articles && articles.length > 0
    ? [...articles].sort((a, b) => new Date(b.date) - new Date(a.date))
    : []
  
  if (!sortedArticles || sortedArticles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-600 dark:text-zinc-400">
          No articles available at the moment. Check back soon!
        </p>
      </div>
    )
  }
  
  return (
    <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
      <div className="flex max-w-3xl flex-col space-y-16">
        {sortedArticles.map((article) => (
          <NoteCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  )
}

export const revalidate = 60; // Revalidate every 60 seconds

export default function NotesPage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          Notes
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          Writing on technology, product management, smart home endeavors, and more.
        </p>
      </div>
      <div className="mt-16 sm:mt-20">
        <Suspense fallback={<LoadingSkeleton />}>
          <ArticlesFeed />
        </Suspense>
      </div>
    </Container>
  )
}
