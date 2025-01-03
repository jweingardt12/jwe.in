import { createClient } from 'strapi-sdk-js'

const strapi = createClient({
  url: process.env.STRAPI_URL,
  store: {
    key: 'strapi_jwt',
    useLocalStorage: false,
    cookieOptions: { path: '/' },
  },
})

export async function getAllArticles() {
  const response = await strapi.find('articles', {
    populate: '*',
  })
  const articles = response.data.map((article) => ({
    slug: article.attributes.slug,
    title: article.attributes.title,
    date: article.attributes.date,
    description: article.attributes.description,
    image: article.attributes.image,
    content: article.attributes.content,
  }))
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export async function getArticleBySlug(slug) {
  const response = await strapi.findOne('articles', {
    filters: { slug },
    populate: '*',
  })
  const article = response.data
  return {
    title: article.attributes.title,
    description: article.attributes.description,
    date: article.attributes.date,
    image: article.attributes.image,
    content: article.attributes.content,
    slug: article.attributes.slug,
  }
}
