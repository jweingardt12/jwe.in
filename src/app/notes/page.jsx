import { Suspense } from 'react'
import { Container } from '@/components/Container'
import { getAllArticles } from '@/lib/articles'
import { NoteCard } from '@/components/NoteCard'
import { LoadingSkeleton } from '@/components/ArticleSkeleton'

async function ArticlesFeed() {
  const articles = await getAllArticles()
  
  return (
    <div>
      {articles.map((article) => (
        <NoteCard key={article.slug} article={article} />
      ))}
    </div>
  )
}

export default function NotesPage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          Notes
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          Writing on technology, product management, smart home endeavors, and more.
        </p>
      </header>

      <div className="mt-10 border-t border-zinc-100 pt-10 dark:border-zinc-700 sm:mt-16 sm:pt-16">
        <Suspense fallback={<LoadingSkeleton />}>
          <ArticlesFeed />
        </Suspense>
      </div>
    </Container>
  )
} 