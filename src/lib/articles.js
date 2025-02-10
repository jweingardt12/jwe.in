import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'src/app/notes')

export async function getAllArticles() {
  try {
    console.log('Reading articles from filesystem...')
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
      .filter(fileName => (fileName.endsWith('.md') || fileName.endsWith('.mdx')) && !fileName.startsWith('.'))
      .map(fileName => {
        const slug = fileName.replace(/\.mdx?$/, '')
        const fullPath = path.join(postsDirectory, fileName)
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
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const mdPath = path.join(postsDirectory, `${slug}.md`)
    
    let filePath = fs.existsSync(fullPath) ? fullPath : mdPath
    
    if (!fs.existsSync(filePath)) {
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
