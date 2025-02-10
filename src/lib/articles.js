import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'src/app/notes')

export async function getAllArticles() {
  try {
    console.log('Reading articles from filesystem...')
    const findMDXFiles = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      return entries.flatMap(entry => {
        const fullPath = path.join(dir, entry.name)
        // Skip the template directory
        if (entry.isDirectory() && entry.name === 'template') {
          return []
        }
        if (entry.isDirectory()) {
          return findMDXFiles(fullPath)
        } else if ((entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) && !entry.name.startsWith('.')) {
          return [{ path: fullPath, name: entry.name }]
        }
        return []
      })
    }

    const mdxFiles = findMDXFiles(postsDirectory)
    const allPostsData = mdxFiles.map(({ path: fullPath, name: fileName }) => {
      const relativePath = path.relative(postsDirectory, fullPath)
      const slug = relativePath.replace(/\.mdx?$/, '').replace(/\/?content$/, '')
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

        return {
          slug,
          title: data.title,
          date: data.date,
          description: data.description,
          content,
          ...data,
        }
      })
      .sort((a, b) => (a.date > b.date ? -1 : 1))

    console.log('Found articles:', allPostsData)
    return allPostsData
  } catch (error) {
    console.error('Error reading articles:', error)
    return []
  }
}

export async function getArticleBySlug(slug) {
  try {
    console.log('Reading article by slug:', slug)
    const findMDXFile = (dir, targetSlug) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          const found = findMDXFile(fullPath, targetSlug)
          if (found) return found
        } else if ((entry.name === 'content.mdx' || entry.name === `${targetSlug}.mdx` || entry.name === `${targetSlug}.md`) && !entry.name.startsWith('.')) {
          const relativePath = path.relative(postsDirectory, fullPath)
          const fileSlug = relativePath.replace(/\.mdx?$/, '').replace(/\/?content$/, '')
          if (fileSlug === targetSlug) {
            return fullPath
          }
        }
      }
      return null
    }

    const filePath = findMDXFile(postsDirectory, slug)
    if (!filePath) {
      console.error('Article not found:', slug)
      return null
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    const article = {
      slug,
      content,
      title: data.title,
      date: data.date,
      description: data.description,
      ...data,
    }

    console.log('Found article:', article)
    return article
  } catch (error) {
    console.error('Error reading article:', error)
    return null
  }
}
