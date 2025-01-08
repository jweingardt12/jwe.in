import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const dynamic = 'force-dynamic'

// Function to recursively find all page files
async function findPages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name)
    
    // Skip components, api, and other non-content directories
    if (entry.isDirectory()) {
      if (['components', 'api', 'ui', 'lib', 'styles', 'hooks'].includes(entry.name)) {
        return null
      }
      return findPages(fullPath)
    } 
    
    // Only include page.jsx/tsx files that are in content directories
    if (entry.name === 'page.jsx' || entry.name === 'page.tsx') {
      const relativePath = fullPath.replace(process.cwd(), '')
      // Include only main content pages and exclude dynamic route pages
      if (['/src/app/about', '/src/app/work', '/src/app/notes', '/src/app/reading'].some(path => relativePath.startsWith(path)) &&
          !relativePath.includes('[') && // Skip dynamic route pages like [slug]
          !relativePath.includes('/_')) { // Skip private/internal pages
        return fullPath
      }
    }
    return null
  }))
  return files.flat().filter(Boolean)
}

// Function to extract text content from JSX
function extractTextContent(content) {
  let textContent = ''
  
  // Extract text from paragraphs with className containing text/description
  const paragraphs = content.match(/<p[^>]*className="[^"]*(?:text|description)[^"]*"[^>]*>([^<]+)<\/p>/g) || []
  textContent += paragraphs.map(p => p.replace(/<[^>]+>/g, '')).join(' ')
  
  // Extract text from headings
  const headings = content.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/g) || []
  textContent += ' ' + headings.map(h => h.replace(/<[^>]+>/g, '')).join(' ')
  
  // Extract text from string literals (including multiline)
  const strings = content.match(/['"`]([\s\S]*?)['"`]/g) || []
  textContent += ' ' + strings
    .map(s => s.slice(1, -1))
    .filter(s => s.length > 3) // Only include meaningful strings
    .join(' ')
  
  // Extract text from JSX expressions
  const jsxExpressions = content.match(/>[^<>{}]+</g) || []
  textContent += ' ' + jsxExpressions
    .map(e => e.slice(1, -1))
    .filter(e => e.trim().length > 0)
    .join(' ')
  
  // Add page-specific content
  if (content.includes('reading/page')) {
    textContent += ' RSS feed reader RSS feeds RSS feed URL RSS reader RSS subscription'
  }
  
  // Clean up and normalize
  const cleanText = textContent
    .replace(/\s+/g, ' ') // normalize whitespace
    .replace(/[^\w\s-]/g, ' ') // remove special chars except hyphens
    .replace(/\b(RSS|Feed|URL)\b/gi, word => word.toUpperCase()) // normalize case for important terms
    .trim()
  
  // Debug log
  console.log('Page content:', cleanText.substring(0, 200))
  
  return cleanText
}

// Function to get page content and metadata
async function getPageContent(pagePath) {
  try {
    const content = await fs.readFile(pagePath, 'utf8')
    
    // Extract meaningful text content
    const textContent = extractTextContent(content)
    
    // Get URL from file path
    const relativePath = pagePath.replace(process.cwd(), '').replace('/src/app', '')
    const url = relativePath
      .replace(/\/page\.(jsx|tsx)$/, '')
      .replace(/\/index$/, '')
      || '/'
    
    // Get title from content or fallback to URL
    const titleMatch = content.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i) ||
                      content.match(/[<{].*?title.*?["'`](.*?)["'`]/i)
    const title = titleMatch ? titleMatch[1] : url.split('/').pop() || 'Home'
    
    // Get description from content
    const descMatch = content.match(/<p[^>]*>([^<]+)<\/p>/i) ||
                     content.match(/[<{].*?description.*?["'`](.*?)["'`]/i)
    const description = descMatch ? descMatch[1] : ''
    
    return {
      title,
      url,
      content: textContent,
      description
    }
  } catch (error) {
    console.error(`Error reading page ${pagePath}:`, error)
    return ''
  }
}

// Function to get all pages content
async function getNavigationItems() {
  try {
    const appDir = path.join(process.cwd(), 'src/app')
    const pageFiles = await findPages(appDir)
    
    const pages = await Promise.all(
      pageFiles.map(async (filePath) => {
        const pageContent = await getPageContent(filePath)
        return {
          type: 'page',
          ...pageContent
        }
      })
    )
    
    return pages
  } catch (error) {
    console.error('Error getting navigation items:', error)
    return []
  }
}

// Hidden pages that are searchable but not in navigation
const hiddenPages = [
  {
    type: 'page',
    title: 'Schedule a Meeting',
    url: '/meet',
    content: 'Schedule a meeting using Reclaim.ai calendar',
    description: 'Find a time that works for us to connect',
    icon: 'CalendarIcon'
  }
]

async function getMarkdownFiles() {
  try {
    const notesDir = path.join(process.cwd(), 'src/app/notes')
    const files = await fs.readdir(notesDir)
    const markdownFiles = files.filter(file => file.endsWith('.md') && !file.startsWith('_'))

    const notes = await Promise.all(
      markdownFiles.map(async (filename) => {
        try {
          const filePath = path.join(notesDir, filename)
          const content = await fs.readFile(filePath, 'utf8')
          const { data, content: markdownContent } = matter(content)
          
          // Get the actual content without frontmatter
          const contentWithoutFrontmatter = markdownContent.trim()
          
          return {
            type: 'note',
            title: data.title,
            url: `/notes/${data.slug || filename.replace('.md', '')}`,
            content: contentWithoutFrontmatter,
            description: data.description,
            date: data.date,
            parent: {
              name: 'Notes',
              url: '/notes'
            }
          }
        } catch (error) {
          console.error(`Error processing file ${filename}:`, error)
          return null
        }
      })
    )

    return notes.filter(note => note !== null)
  } catch (error) {
    console.error('Error reading markdown files:', error)
    return []
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase() || ''

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    // Get all content
    const notes = await getMarkdownFiles()
    const navItems = await getNavigationItems()
    
    // Combine navigation items, hidden pages, and notes for searching
    const allContent = [...navItems, ...hiddenPages, ...notes]

    const results = allContent.filter(item => 
      item.title?.toLowerCase().includes(query) ||
      item.content?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    )

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ results: [], error: 'Internal server error' }, { status: 500 })
  }
}
