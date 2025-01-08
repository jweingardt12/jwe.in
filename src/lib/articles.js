import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { getAllPosts, getPostBySlug } from './contentful'

export async function getAllArticles() {
  try {
    const posts = await getAllPosts()
    if (!posts || posts.length === 0) {
      console.log('No posts found in getAllArticles');
      return [];
    }
    return posts.map(post => ({
      ...post,
      // Ensure content is passed through as is for rich text rendering
      content: post.content
    }));
  } catch (error) {
    console.error('Error in getAllArticles:', error);
    return [];
  }
}

export async function getArticleBySlug(slug) {
  try {
    const post = await getPostBySlug(slug)
    if (!post) {
      console.log(`No post found for slug: ${slug}`);
      return null;
    }
    return {
      ...post,
      // Ensure content is passed through as is for rich text rendering
      content: post.content
    };
  } catch (error) {
    console.error('Error in getArticleBySlug:', error);
    return null;
  }
}
