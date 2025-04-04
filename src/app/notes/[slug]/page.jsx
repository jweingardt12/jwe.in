import { ArticleLayout } from '../../../components/ArticleLayout'
import { getAllArticles, getArticleBySlug } from '../../../lib/redis-articles'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import NotesClientContent from '../../../components/NotesClientContent'

const components = {
  Image: Image,
  img: ({ src, alt }) => (
    <Image
      src={src}
      alt={alt || ''}
      width={1200}
      height={600}
      className="w-full rounded-lg my-8"
      priority
    />
  ),
}

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Disable static regeneration to always fetch fresh data

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
    const article = await getArticle(params.slug)

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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/notes/${params.slug}`,
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

async function getArticle(slug) {
  // Fetch the article directly from Redis
  const article = await getArticleBySlug(slug, 'notes')
  return article
}

export default async function Article({ params }) {
  try {
    const article = await getArticle(params.slug)

    if (!article) {
      notFound()
    }

    return (
      <ArticleLayout article={article}>
        <NotesClientContent content={article.content} />
      </ArticleLayout>
    )
  } catch (error) {
    console.error('Error rendering article:', error)
    notFound()
  }
}
