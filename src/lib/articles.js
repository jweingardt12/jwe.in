import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { getAllPosts, getPostBySlug } from './contentful'

export async function getAllArticles() {
  const posts = await getAllPosts()
  return posts.map(post => ({
    ...post,
    content: post.content // Keep the raw content for React rendering
  }))
}

export async function getArticleBySlug(slug) {
  const post = await getPostBySlug(slug)
  return {
    ...post,
    content: post.content // Keep the raw content for React rendering
  }
}
