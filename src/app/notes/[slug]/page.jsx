import { ArticleLayout } from '@/components/ArticleLayout'
import { getAllArticles } from '@/lib/articles'

export async function generateStaticParams() {
  let articles = await getAllArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }) {
  let articles = await getAllArticles()
  let article = articles.find((article) => article.slug === params.slug)

  if (!article) {
    return {}
  }

  return {
    title: article.title,
    description: article.description,
  }
}

export default async function Article({ params }) {
  let articles = await getAllArticles()
  let article = articles.find((article) => article.slug === params.slug)

  if (!article) {
    return <div>Article not found</div>
  }

  return (
    <ArticleLayout article={article}>
      {article.content}
    </ArticleLayout>
  )
} 