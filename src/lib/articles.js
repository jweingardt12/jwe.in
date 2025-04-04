import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const notesDirectory = path.join(process.cwd(), 'src/app/notes')
const blogDirectory = path.join(process.cwd(), 'src/app/blog')

export async function getAllArticles(type = 'notes') {
  try {
    console.log(`Reading ${type} from filesystem...`)
    const directory = type === 'blog' ? blogDirectory : notesDirectory
    
    // Check if directory exists
    if (!fs.existsSync(directory)) {
      console.log(`Directory ${directory} does not exist`)
      return []
    }
    
    const findMDXFiles = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      return entries.flatMap(entry => {
        const fullPath = path.join(dir, entry.name)
        // Skip the template directory and create directory
        if (entry.isDirectory() && (entry.name === 'template' || entry.name === 'create')) {
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

    const mdxFiles = findMDXFiles(directory)
    const allPostsData = mdxFiles.map(({ path: fullPath, name: fileName }) => {
      const relativePath = path.relative(directory, fullPath)
      const slug = relativePath.replace(/\.mdx?$/, '').replace(/\/?content$/, '')
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        content,
        type, // Add type to distinguish between blog and notes
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

export async function getArticleBySlug(slug, type = 'notes') {
  try {
    console.log(`Reading ${type} article by slug:`, slug)
    const directory = type === 'blog' ? blogDirectory : notesDirectory
    
    // Check if directory exists
    if (!fs.existsSync(directory)) {
      console.log(`Directory ${directory} does not exist`)
      return null
    }
    
    const findMDXFile = (dir, targetSlug) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory() && entry.name !== 'create') {
          const found = findMDXFile(fullPath, targetSlug)
          if (found) return found
        } else if ((entry.name === 'content.mdx' || entry.name === `${targetSlug}.mdx` || entry.name === `${targetSlug}.md`) && !entry.name.startsWith('.')) {
          const relativePath = path.relative(directory, fullPath)
          const fileSlug = relativePath.replace(/\.mdx?$/, '').replace(/\/?content$/, '')
          if (fileSlug === targetSlug) {
            return fullPath
          }
        }
      }
      return null
    }

    // First try in the specified directory
    let filePath = findMDXFile(directory, slug)
    
    // If not found and we're looking in notes, try in blog
    if (!filePath && type === 'notes') {
      console.log('Article not found in notes, trying blog directory')
      filePath = findMDXFile(blogDirectory, slug)
    }
    
    // If not found and we're looking in blog, try in notes
    if (!filePath && type === 'blog') {
      console.log('Article not found in blog, trying notes directory')
      filePath = findMDXFile(notesDirectory, slug)
    }
    
    if (!filePath) {
      console.error('Article not found:', slug)
      return null
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    // Determine the type based on which directory the file was found in
    const articleType = filePath.includes('/blog/') ? 'blog' : 'notes'
    
    const article = {
      slug,
      content,
      title: data.title,
      date: data.date,
      description: data.description,
      type: articleType,
      ...data,
    }

    console.log('Found article:', article)
    return article
  } catch (error) {
    console.error('Error reading article:', error)
    return null
  }
}
