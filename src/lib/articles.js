import axios from 'axios'
import { marked } from 'marked'

const strapiUrl = 'http://localhost:1339'

export async function getAllArticles() {
  try {
    const response = await axios.get(`${strapiUrl}/api/notes`)
    
    const articles = response.data.data.map(article => {
      const attributes = article.attributes
      
      return {
        slug: article.id.toString(),
        title: attributes.title,
        date: attributes.createdAt,
        description: attributes.description,
        image: attributes.image,
        content: marked.parse(attributes.content || '', {
          headerIds: false,
          mangle: false,
          gfm: true
        })
      }
    })
    
    return articles.sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

export async function getArticleBySlug(slug) {
  try {
    const response = await axios.get(`${strapiUrl}/api/notes/${slug}`)
    const article = response.data.data
    const attributes = article.attributes
    
    return {
      title: attributes.title,
      description: attributes.description,
      date: attributes.createdAt,
      image: attributes.image,
      content: marked.parse(attributes.content || '', {
        headerIds: false,
        mangle: false,
        gfm: true
      }),
      slug: article.id.toString()
    }
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}
