import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export async function getAllArticles() {
  const notesDirectory = path.join(process.cwd(), 'src/app/notes')
  const files = await fs.readdir(notesDirectory)
  
  const articles = await Promise.all(
    files
      .filter(file => file.endsWith('.md') && !file.startsWith('_'))
      .map(async filename => {
        const filePath = path.join(notesDirectory, filename)
        const content = await fs.readFile(filePath, 'utf8')
        const { data, content: markdown } = matter(content)
        const htmlContent = marked.parse(markdown, { 
          headerIds: false,
          mangle: false,
          gfm: true
        })
        
        // Get the slug from metadata or generate from filename
        const slug = data.slug || filename.replace(/\.md$/, '')
        
        // Parse date safely
        let date = null
        if (data.date) {
          const parsedDate = new Date(data.date)
          if (!isNaN(parsedDate.getTime())) {
            date = parsedDate.toISOString()
          }
        }
        
        return {
          slug,
          title: data.title,
          date,
          description: data.description,
          image: data.image,
          content: htmlContent,
        }
      })
  )
  
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export async function getArticleBySlug(slug) {
  const notesDirectory = path.join(process.cwd(), 'src/app/notes')
  const filePath = path.join(notesDirectory, `${slug}.md`)
  const content = await fs.readFile(filePath, 'utf8')
  const { data, content: markdown } = matter(content)
  const parsedContent = marked.parse(markdown.trim(), { 
    headerIds: false,
    mangle: false,
    gfm: true
  })
  
  // Parse date safely
  let date = new Date().toISOString()
  if (data.date) {
    const parsedDate = new Date(data.date)
    if (!isNaN(parsedDate.getTime())) {
      date = parsedDate.toISOString()
    }
  }
  
  return {
    title: data.title,
    description: data.description,
    date,
    image: data.image,
    content: parsedContent,
    slug
  }
} 