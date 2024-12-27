
import glob from 'fast-glob'

async function importArticle(articleFilename) {
  let module = await import(`../app/articles/${articleFilename}`)
  let article = module.article || {}

  if (!article.title) {
    throw new Error(`Missing title in ${articleFilename}`)
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    ...article,
  }
}

export async function getAllArticles() {
  let articleFilenames = await glob('*/page.mdx', {
    cwd: './src/app/articles',
  })

  let articles = await Promise.all(articleFilenames.map(importArticle))

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
