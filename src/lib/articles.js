
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export async function getAllArticles() {
  const notesDirectory = path.join(process.cwd(), 'src/app/notes')
  const files = await fs.readdir(notesDirectory)
  
  const articles = await Promise.all(
    files
      .filter(file => file.endsWith('.md'))
      .map(async filename => {
        const filePath = path.join(notesDirectory, filename)
        const content = await fs.readFile(filePath, 'utf8')
        const { data, content: markdown } = matter(content)
        
        return {
          slug: filename.replace(/\.md$/, ''),
          title: data.title,
          description: data.description,
          date: data.date,
          content: marked(markdown)
        }
      })
  )

  return articles.sort((a, z) => new Date(z.date) - new Date(a.date))
}

export async function getArticleBySlug(slug) {
  const filePath = path.join(process.cwd(), 'src/app/notes', `${slug}.md`)
  const content = await fs.readFile(filePath, 'utf8')
  const { data, content: markdown } = matter(content)
  
  return {
    ...data,
    slug,
    content: marked(markdown)
  }
}
