import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Base navigation items that are always searchable
const navigationItems = [
  {
    type: 'page',
    title: 'About',
    url: '/about',
    content: 'About page content...',
    description: 'Learn more about me and my background'
  },
  {
    type: 'page',
    title: 'Work',
    url: '/work',
    content: 'Professional experience and projects...',
    description: 'See my professional experience and projects'
  },
  {
    type: 'page',
    title: 'Notes',
    url: '/notes',
    content: 'Collection of thoughts and articles...',
    description: 'Read my thoughts and articles on various topics'
  },
  {
    type: 'page',
    title: 'Reading',
    url: '/reading',
    content: 'Current reading list and recommendations...',
    description: 'Discover what I\'m currently reading and recommendations'
  }
]

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

    // Get all markdown notes
    const notes = await getMarkdownFiles()
    
    // Combine navigation items, hidden pages, and notes for searching
    const allContent = [...navigationItems, ...hiddenPages, ...notes]

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