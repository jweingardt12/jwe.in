import { ArticleLayout } from '../../../components/ArticleLayout'
import { getAllArticles } from '../../../lib/articles'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
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

export const revalidate = 60; // Revalidate every 60 seconds

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
  const postsDirectory = path.join(process.cwd(), 'src/app/notes')
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  const mdPath = path.join(postsDirectory, `${slug}.md`)
  
  let filePath = fs.existsSync(fullPath) ? fullPath : mdPath
  
  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    content,
    title: data.title,
    date: data.date,
    description: data.description,
    ...data,
  }
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
