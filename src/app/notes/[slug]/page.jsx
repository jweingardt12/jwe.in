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
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/notes/${article.slug}`,
      ...(article.image && {
        images: [{
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        }],
      }),
    },
    twitter: {
      card: article.image ? 'summary_large_image' : 'summary',
      title: article.title,
      description: article.description,
      ...(article.image && {
        images: [article.image],
      }),
    },
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