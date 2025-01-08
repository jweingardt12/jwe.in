import { createClient } from 'contentful'

let client;

// Log environment variables presence (not their values)
console.log('Environment check:', {
  hasSpaceId: !!process.env.CONTENTFUL_SPACE_ID,
  hasAccessToken: !!process.env.CONTENTFUL_ACCESS_TOKEN,
  hasPreviewToken: !!process.env.CONTENTFUL_PREVIEW_TOKEN,
  nodeEnv: process.env.NODE_ENV
});

try {
  if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN || !process.env.CONTENTFUL_PREVIEW_TOKEN) {
    throw new Error('Missing required Contentful environment variables');
  }
  
  const isPreview = process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development';
  console.log('Environment:', { isPreview, vercelEnv: process.env.VERCEL_ENV, nodeEnv: process.env.NODE_ENV });
  
  client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: isPreview ? process.env.CONTENTFUL_PREVIEW_TOKEN : process.env.CONTENTFUL_ACCESS_TOKEN,
    host: isPreview ? 'preview.contentful.com' : 'cdn.contentful.com',
  });
  
  console.log('Contentful client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Contentful client:', error.message);
  if (error.response) {
    console.error('API Response:', error.response.data);
  }
  client = null;
}

export async function getAllPosts() {
  if (!client) {
    console.warn('Contentful client not initialized');
    return [];
  }
  
  try {
    console.log('Fetching entries from Contentful...');
    console.log('Using space ID:', process.env.CONTENTFUL_SPACE_ID);
    
    // Try to get content types first
    const contentTypes = await client.getContentTypes();
    console.log('Content Types Response:', JSON.stringify(contentTypes, null, 2));

    // Use the correct content type ID from Contentful
    const contentTypeIds = ['title'];
    let response;

    for (const contentType of contentTypeIds) {
      try {
        console.log(`Trying content type: ${contentType}`);
        console.log('Query:', {
          content_type: contentType,
          order: '-sys.createdAt',
        });
        response = await client.getEntries({
          content_type: contentType,
          order: '-sys.createdAt',
        });
        
        if (response.items.length > 0) {
          console.log(`Found entries with content type: ${contentType}`);
          console.log('Response:', JSON.stringify(response, null, 2));
          break;
        }
      } catch (error) {
        console.log(`No entries found for content type: ${contentType}`);
      }
    }

    if (!response) {
      console.log('No entries found with any known content type');
      return [];
    }

    console.log(`Found ${response.items.length} entries`);
    
    return response.items.map((item) => {
      console.log('Processing item:', item.sys.id);
      console.log('Item fields:', JSON.stringify(item.fields, null, 2));
      return {
        slug: item.fields.slug,
        title: item.fields.title,
        date: item.fields.date || item.sys.createdAt,
        description: item.fields.description,
        image: item.fields.image?.fields?.file?.url ? 
          item.fields.image.fields.file.url.startsWith('//') ? 
            `https:${item.fields.image.fields.file.url}` : 
            item.fields.image.fields.file.url : null,
        content: item.fields.content || item.fields.body || null, // Try alternate field name
      };
    });
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
    // Use the correct content type ID from Contentful
    const contentTypes = await client.getContentTypes();
    const contentTypeIds = ['title'];
    let response;

    for (const contentType of contentTypeIds) {
      try {
        console.log(`Trying to fetch slug with content type: ${contentType}`);
        response = await client.getEntries({
          content_type: contentType,
          'fields.slug': slug,
          limit: 1,
        });
        
        if (response.items.length > 0) {
          console.log(`Found entry with content type: ${contentType}`);
          break;
        }
      } catch (error) {
        console.log(`No entry found for content type: ${contentType}`);
      }
    }

    if (!response || !response.items.length) {
      console.log('No entry found with any known content type');
      return null;
    }

    const post = response.items[0];
    return {
      title: post.fields.title,
      description: post.fields.description,
      date: post.fields.date || post.sys.createdAt,
      image: post.fields.image?.fields?.file?.url ? 
        post.fields.image.fields.file.url.startsWith('//') ? 
          `https:${post.fields.image.fields.file.url}` : 
          post.fields.image.fields.file.url : null,
      content: post.fields.content || post.fields.body || null,
      slug: post.fields.slug,
    };
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}
