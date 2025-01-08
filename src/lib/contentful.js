import { createClient } from 'contentful'

let client;

try {
  client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });
} catch (error) {
  console.error('Failed to initialize Contentful client:', error);
  client = null;
}

export async function getAllPosts() {
  if (!client) {
    console.warn('Contentful client not initialized');
    return [];
  }
  
  try {
    const response = await client.getEntries({
      content_type: 'title',
      order: '-sys.createdAt',
    });

    return response.items.map((item) => ({
      slug: item.fields.slug,
      title: item.fields.title,
      date: item.sys.createdAt,
      description: item.fields.description,
      image: item.fields.image?.fields?.file?.url ? `https:${item.fields.image.fields.file.url}` : null,
      content: item.fields.content,
    }));
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug) {
  if (!client) {
    console.warn('Contentful client not initialized');
    return null;
  }

  try {
    const response = await client.getEntries({
      content_type: 'title',
      'fields.slug': slug,
      limit: 1,
    });

    if (!response.items.length) {
      return null;
    }

    const post = response.items[0];
    return {
      title: post.fields.title,
      description: post.fields.description,
      date: post.sys.createdAt,
      image: post.fields.image?.fields?.file?.url ? `https:${post.fields.image.fields.file.url}` : null,
      content: post.fields.content,
      slug: post.fields.slug,
    };
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}
