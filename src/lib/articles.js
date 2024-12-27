import glob from 'fast-glob'

async function importArticle(articleFilename) {
  try {
    const module = await import(`../app/articles/${articleFilename}`)
    return {
      slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
      ...module.article,
    }
  } catch (error) {
    console.error(`Error importing article ${articleFilename}:`, error)
    return null
  }
}

export async function getAllArticles() {
  let articleFilenames = await glob('*/page.mdx', {
    cwd: './src/app/articles',
  })

  let articles = await Promise.all(articleFilenames.map(importArticle))

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}