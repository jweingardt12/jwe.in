import { createClient } from 'contentful'

if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
  throw new Error(
    'Please provide CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN environment variables'
  )
}

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

export async function getAllPosts() {
  const response = await client.getEntries({
    content_type: 'title',
    order: '-sys.createdAt',
  })

  return response.items.map((item) => ({
    slug: item.fields.slug,
    title: item.fields.title,
    date: item.sys.createdAt,
    description: item.fields.description,
    image: item.fields.image?.fields?.file?.url ? `https:${item.fields.image.fields.file.url}` : null,
    content: item.fields.content,
  }))
}

export async function getPostBySlug(slug) {
  const response = await client.getEntries({
    content_type: 'title',
    'fields.slug': slug,
    limit: 1,
  })

  if (!response.items.length) {
    throw new Error(`Post with slug "${slug}" not found`)
  }

  const post = response.items[0]
  return {
    title: post.fields.title,
    description: post.fields.description,
    date: post.sys.createdAt,
    image: post.fields.image?.fields?.file?.url ? `https:${post.fields.image.fields.file.url}` : null,
    content: post.fields.content,
    slug: post.fields.slug,
  }
}
