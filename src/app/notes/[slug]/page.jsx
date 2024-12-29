
import { ArticleLayout } from '@/components/ArticleLayout'
import { getArticleBySlug } from '@/lib/articles'

export default async function Note({ params }) {
  const article = await getArticleBySlug(params.slug)
  return (
    <ArticleLayout article={article}>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </ArticleLayout>
  )
}
