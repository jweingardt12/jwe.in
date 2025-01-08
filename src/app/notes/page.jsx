import { Suspense } from 'react'
import { Container } from '../../components/Container'
import { getAllArticles } from '../../lib/articles'
import { NoteCard } from '../../components/NoteCard'
import { LoadingSkeleton } from '../../components/ArticleSkeleton'

async function ArticlesFeed() {
  const articles = await getAllArticles()
  
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-600 dark:text-zinc-400">
          No articles available at the moment. Check back soon!
        </p>
      </div>
    )
  }
  
  return (
    <div className="space-y-16">
      {articles.map((article) => (
        <NoteCard key={article.slug} article={article} />
      ))}
    </div>
  )
}

export const revalidate = 60; // Revalidate every 60 seconds

export default function NotesPage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <h2 className="text-4xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
        Notes
      </h2>
      <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
        Writing on technology, product management, smart home endeavors, and more.
      </p>

      <div className="mt-10 border-t border-zinc-100 pt-10 dark:border-zinc-700 sm:mt-16 sm:pt-16">
        <Suspense fallback={<LoadingSkeleton />}>
          <ArticlesFeed />
        </Suspense>
      </div>
    </Container>
  )
}
