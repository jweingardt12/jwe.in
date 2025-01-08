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
    console.log('Fetching entries from Contentful...');
    // Try to get content types first
    const contentTypes = await client.getContentTypes();
    console.log('Available content types:', contentTypes.items.map(type => type.sys.id));

    // Use the correct content type name
    const contentTypeIds = ['notes', 'Notes'];
    let response;

    for (const contentType of contentTypeIds) {
      try {
        console.log(`Trying content type: ${contentType}`);
        response = await client.getEntries({
          content_type: contentType,
          order: '-sys.createdAt',
        });
        
        if (response.items.length > 0) {
          console.log(`Found entries with content type: ${contentType}`);
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
      return {
        slug: item.fields.slug,
        title: item.fields.title,
        date: item.sys.createdAt,
        description: item.fields.description,
        image: item.fields.image?.fields?.file?.url ? `https:${item.fields.image.fields.file.url}` : null,
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
    // Use the correct content type name
    const contentTypes = await client.getContentTypes();
    const contentTypeIds = ['notes', 'Notes'];
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
      date: post.sys.createdAt,
      image: post.fields.image?.fields?.file?.url ? `https:${post.fields.image.fields.file.url}` : null,
      content: post.fields.content || post.fields.body || null,
      slug: post.fields.slug,
    };
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}
