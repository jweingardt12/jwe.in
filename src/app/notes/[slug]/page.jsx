import { ArticleLayout } from '../../../components/ArticleLayout'
import { getAllArticles, getArticleBySlug } from '../../../lib/articles'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  try {
    const articles = await getAllArticles()
    return articles.map((article) => ({
      slug: article.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({ params }) {
  try {
    const article = await getArticleBySlug(params.slug)

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
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {}
  }
}

export default async function Article({ params }) {
  try {
    const article = await getArticleBySlug(params.slug)

    if (!article) {
      notFound()
    }

    return (
      <ArticleLayout article={article}>
        {article.content}
      </ArticleLayout>
    )
  } catch (error) {
    console.error('Error rendering article:', error)
    notFound()
  }
}
