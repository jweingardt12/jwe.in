import { Redis } from '@upstash/redis';

// Initialize Redis
const redis = new Redis({
  url: process.env.STORAGE_KV_REST_API_URL,
  token: process.env.STORAGE_KV_REST_API_TOKEN,
});

export async function getAllArticles(type = 'notes') {
  try {
    console.log(`Fetching ${type} from Redis...`);
    
    // Get all keys with the appropriate prefix
    const prefix = type === 'blog' ? 'blog-post:' : 'note:';
    const keys = await redis.keys(`${prefix}*`);
    
    if (!keys || keys.length === 0) {
      console.log(`No ${type} found in Redis`);
      return [];
    }
    
    // Fetch all articles data
    const articlesData = await Promise.all(
      keys.map(async (key) => {
        try {
          const data = await redis.get(key);
          if (!data) return null;
          
          const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
          
          // Skip unpublished articles
          if (parsedData.published === false) {
            return null;
          }
          
          // Skip articles without required fields
          if (!parsedData.title || !parsedData.content) {
            return null;
          }
          
          return {
            id: key.replace(`${prefix}`, ''),
            slug: parsedData.slug || '',
            title: parsedData.title,
            date: parsedData.date || new Date().toISOString(),
            description: parsedData.description || '',
            content: parsedData.content,
            author: parsedData.author || 'Jason Weingardt',
            image: parsedData.image || null,
            tags: parsedData.tags || [],
            type,
            ...parsedData,
          };
        } catch (error) {
          console.error(`Error processing ${key}:`, error);
          return null;
        }
      })
    );
    
    // Filter out nulls and sort by date (newest first)
    const validArticles = articlesData
      .filter(Boolean)
      .sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1));
    
    console.log(`Found ${validArticles.length} published ${type}`);
    return validArticles;
  } catch (error) {
    console.error(`Error fetching ${type} from Redis:`, error);
    return [];
  }
}

export async function getArticleBySlug(slug, type = 'notes') {
  try {
    console.log(`Fetching ${type} article by slug:`, slug);
    
    // First try to find by slug in the specified type
    const prefix = type === 'blog' ? 'blog-post:' : 'note:';
    const keys = await redis.keys(`${prefix}*`);
    
    for (const key of keys) {
      const data = await redis.get(key);
      if (!data) continue;
      
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      
      if (parsedData.slug === slug && parsedData.published !== false) {
        return {
          id: key.replace(`${prefix}`, ''),
          slug,
          title: parsedData.title,
          date: parsedData.date || new Date().toISOString(),
          description: parsedData.description || '',
          content: parsedData.content,
          author: parsedData.author || 'Jason Weingardt',
          image: parsedData.image || null,
          tags: parsedData.tags || [],
          type,
          ...parsedData,
        };
      }
    }
    
    // If not found in the specified type, try the other type
    const otherPrefix = type === 'blog' ? 'note:' : 'blog-post:';
    const otherKeys = await redis.keys(`${otherPrefix}*`);
    
    for (const key of otherKeys) {
      const data = await redis.get(key);
      if (!data) continue;
      
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      
      if (parsedData.slug === slug && parsedData.published !== false) {
        const actualType = type === 'blog' ? 'notes' : 'blog';
        return {
          id: key.replace(`${otherPrefix}`, ''),
          slug,
          title: parsedData.title,
          date: parsedData.date || new Date().toISOString(),
          description: parsedData.description || '',
          content: parsedData.content,
          author: parsedData.author || 'Jason Weingardt',
          image: parsedData.image || null,
          tags: parsedData.tags || [],
          type: actualType,
          ...parsedData,
        };
      }
    }
    
    console.log(`Article with slug ${slug} not found`);
    return null;
  } catch (error) {
    console.error(`Error fetching article by slug ${slug}:`, error);
    return null;
  }
}
