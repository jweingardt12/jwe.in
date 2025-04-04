// Script to process notes during build time
// This script checks Redis for published/unpublished status and updates MDX files accordingly

const { Redis } = require('@upstash/redis');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Initialize Redis
const redis = new Redis({
  url: process.env.STORAGE_KV_REST_API_URL,
  token: process.env.STORAGE_KV_REST_API_TOKEN,
});

const notesDirectory = path.join(process.cwd(), 'src/app/notes');

async function processNotes() {
  console.log('Processing notes for build...');
  
  try {
    // Get all note keys from Redis
    const keys = await redis.keys('note:*');
    console.log(`Found ${keys.length} notes in Redis`);
    
    // Process each note
    for (const key of keys) {
      try {
        const noteData = await redis.get(key);
        if (!noteData) continue;
        
        const parsedData = typeof noteData === 'string' ? JSON.parse(noteData) : noteData;
        const noteId = key.replace('note:', '');
        
        // Skip notes without a slug (never published)
        if (!parsedData.slug) {
          console.log(`Note ${noteId} has no slug, skipping`);
          continue;
        }
        
        const mdxPath = path.join(notesDirectory, `${parsedData.slug}.mdx`);
        
        // If the note is unpublished in Redis but the file exists, update its frontmatter
        if (parsedData.published === false && fs.existsSync(mdxPath)) {
          console.log(`Updating unpublished status for note: ${parsedData.slug}`);
          
          const fileContents = fs.readFileSync(mdxPath, 'utf8');
          const { data, content } = matter(fileContents);
          
          // Update the frontmatter to mark as unpublished
          data.published = false;
          data.unpublishedAt = parsedData.unpublishedAt || new Date().toISOString();
          
          // Write the updated file back
          const updatedContent = matter.stringify(content, data);
          fs.writeFileSync(mdxPath, updatedContent, 'utf8');
          console.log(`Updated file to mark as unpublished: ${mdxPath}`);
        }
        // If the note is published in Redis but the file doesn't exist, create it
        else if (parsedData.published === true && !fs.existsSync(mdxPath) && parsedData.content) {
          console.log(`Creating MDX file for published note: ${parsedData.slug}`);
          
          const frontMatter = {
            title: parsedData.title,
            date: parsedData.date || new Date().toISOString(),
            description: parsedData.description || '',
            author: parsedData.author || 'Jason Weingardt',
            image: parsedData.image || null,
            tags: parsedData.tags || [],
            published: true,
          };
          
          const mdxContent = matter.stringify(parsedData.content, frontMatter);
          fs.writeFileSync(mdxPath, mdxContent, 'utf8');
          console.log(`Created MDX file: ${mdxPath}`);
        }
      } catch (noteError) {
        console.error(`Error processing note ${key}:`, noteError);
      }
    }
    
    console.log('Finished processing notes');
  } catch (error) {
    console.error('Error processing notes:', error);
  }
}

// Run the script
processNotes().catch(console.error);
