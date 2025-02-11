import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { Redis } from '@upstash/redis'
import { SYSTEM_PROMPT } from './prompt.js'

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Initialize OpenAI
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// Initialize Redis
const redis = new Redis({
  url: process.env.STORAGE_KV_REST_API_URL,
  token: process.env.STORAGE_KV_REST_API_TOKEN,
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json'
};

// Helper function to store job analysis in Redis
async function storeAnalysis(id, analysis) {
  try {
    // Store with 90 day expiration
    await redis.set(`job-analysis:${id}`, JSON.stringify(analysis), { ex: 60 * 60 * 24 * 90 })
    return true
  } catch (error) {
    console.error('Error storing analysis in Redis:', error)
    return false
  }
}

// Helper function to retrieve job analysis from Redis
async function getAnalysis(id) {
  try {
    console.log('Attempting to get analysis for ID:', id)
    const analysis = await redis.get(`job-analysis:${id}`)
    console.log('Raw Redis response:', analysis)
    
    if (!analysis) {
      console.log('No analysis found for ID:', id)
      return null
    }
    
    // Handle case where data might already be parsed
    const parsedData = typeof analysis === 'string' ? JSON.parse(analysis) : analysis
    console.log('Parsed analysis data:', parsedData)
    
    return {
      id,
      ...parsedData
    }
  } catch (error) {
    console.error('Error retrieving analysis from Redis:', error)
    return null
  }
}

function cleanHtmlContent(html) {
  // Remove script and style tags and their contents
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  
  // Convert <br> and </p> to newlines
  html = html.replace(/<br\s*\/?>/gi, '\n')
  html = html.replace(/<\/p>/gi, '\n\n')
  
  // Remove all other HTML tags
  html = html.replace(/<[^>]+>/g, '')
  
  // Decode HTML entities
  html = html.replace(/&nbsp;/g, ' ')
  html = html.replace(/&amp;/g, '&')
  html = html.replace(/&lt;/g, '<')
  html = html.replace(/&gt;/g, '>')
  html = html.replace(/&quot;/g, '"')
  
  // Remove excessive whitespace
  html = html.replace(/\n\s*\n\s*\n/g, '\n\n')
  html = html.replace(/  +/g, ' ')
  html = html.trim()
  
  return html
}

async function fetchJobContent(url) {
  try {
    // Special handling for Gem job board URLs
    if (url.includes('jobs.gem.com')) {
      // Extract the job ID from the URL
      const jobId = url.split('/').pop().split('?')[0]
      // Use Gem's API endpoint to fetch the job data
      const apiUrl = `https://jobs.gem.com/api/jobs/${jobId}`
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error('Could not fetch job details from Gem. Please try pasting the job description directly.')
      }
      
      const data = await response.json()
      // Combine relevant fields into a single text
      const content = [
        `Job Title: ${data.title || ''}`,
        `Company: ${data.company || ''}`,
        `Description: ${data.description || ''}`,
        `Requirements: ${data.requirements || ''}`,
        `Responsibilities: ${data.responsibilities || ''}`
      ].filter(Boolean).join('\n\n')
      
      return content
    }

    // Special handling for Ashby job board URLs
    if (url.includes('jobs.ashbyhq.com')) {
      // Extract the job ID from the URL
      const jobId = url.split('/').pop().split('?')[0]
      // Use Ashby's API endpoint to fetch the job data
      const apiUrl = `https://jobs.ashbyhq.com/api/public-job/${jobId}`
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error('Could not fetch job details from Ashby. Please try pasting the job description directly.')
      }
      
      const data = await response.json()
      // Combine relevant fields into a single text
      const content = [
        `Job Title: ${data.title || ''}`,
        `Company: ${data.organizationName || ''}`,
        `Description: ${data.descriptionHtml || data.description || ''}`,
        `Requirements: ${data.requirements || ''}`,
        `Location: ${data.locationName || ''}`
      ].filter(Boolean).join('\n\n')
      
      return cleanHtmlContent(content)
    }

    // Default handling for other URLs
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch job posting')
    }
    
    const html = await response.text()
    const cleanText = cleanHtmlContent(html)
    
    if (cleanText.length < 100) {
      throw new Error('Could not extract meaningful job description. This might be a client-rendered page. Please try pasting the job description directly.')
    }
    
    return cleanText
  } catch (error) {
    console.error('Error fetching job content:', error)
    throw new Error(`Failed to fetch job posting content: ${error.message}. Please paste the job description directly.`)
  }
}

function countSentences(text) {
  // Remove the emoji and headline part before counting sentences
  const contentPart = text.replace(/\*\*[^*]+\*\*:/, '').trim();
  
  // Split by period, exclamation, or question mark followed by a space or end of string
  // But ignore periods in common abbreviations and numbers
  const sentences = contentPart.match(/[^.!?]+(?:[.!?](?:(?=\s)|$))/g) || [];
  
  // Filter out false positives from abbreviations like "U.S." or "Ph.D."
  return sentences.filter(s => {
    // Ignore if it's just an abbreviation or number
    if (s.trim().match(/^(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|U\.S|Ph\.D|Inc|Ltd|etc)\./i)) {
      return false;
    }
    return true;
  }).length;
}

function validateAnalysis(analysis) {
  // Check required fields exist
  if (!analysis.jobTitle || !analysis.companyName || !analysis.introText || !analysis.relevantSkills?.length) {
    throw new Error('Missing required fields in analysis');
  }

  // Validate intro text is exactly one sentence
  if (countSentences(analysis.introText) !== 1) {
    throw new Error('Intro text must be exactly one sentence');
  }

  // Validate bullet points
  if (!analysis.bulletPoints?.length || analysis.bulletPoints.length !== 3) {
    throw new Error('Must have exactly 3 bullet points');
  }

  // Validate each bullet point is one sentence
  for (const bullet of analysis.bulletPoints) {
    if (countSentences(bullet) !== 1) {
      throw new Error('Each bullet point must be exactly one sentence');
    }
  }

  return true;
}

// Set longer timeout for this route
export const maxDuration = 30 // 30 seconds

// Handle OPTIONS request for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function GET(request) {
  try {
    if (!process.env.STORAGE_KV_REST_API_URL || !process.env.STORAGE_KV_REST_API_TOKEN) {
      console.error('Redis configuration is missing');
      return NextResponse.json({ error: 'Storage service configuration missing' }, { 
        status: 503,
        headers: corsHeaders
      });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'No job ID provided' }, { 
        status: 400,
        headers: corsHeaders 
      });
    }

    const analysis = await getAnalysis(id);
    
    if (!analysis) {
      return NextResponse.json({ 
        error: 'Job analysis not found. Please generate a new analysis.' 
      }, { 
        status: 404,
        headers: corsHeaders 
      });
    }

    return NextResponse.json(analysis, { headers: corsHeaders });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ error: 'Failed to retrieve job analysis' }, { 
      status: 500,
      headers: corsHeaders 
    });
  }
}

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return NextResponse.json({ 
        error: 'OpenAI API key not configured. Please contact the site administrator.' 
      }, { 
        status: 500,
        headers: corsHeaders 
      });
    }

    const body = await request.json();
    const { jobUrl, jobContent } = body;

    if (!jobUrl && !jobContent) {
      return NextResponse.json({ error: 'No job URL or content provided' }, { 
        status: 400,
        headers: corsHeaders 
      });
    }

    // If we have a URL but no content, fetch the content
    let content = jobContent;
    if (jobUrl && !jobContent) {
      if (!jobUrl.startsWith('http')) {
        return NextResponse.json({ error: 'Invalid URL format' }, { 
          status: 400,
          headers: corsHeaders 
        });
      }
      try {
        content = await fetchJobContent(jobUrl);
      } catch (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { 
          status: 500,
          headers: corsHeaders 
        });
      }
    }

    if (!content) {
      return NextResponse.json({ error: 'No content available for analysis' }, { 
        status: 400,
        headers: corsHeaders 
      });
    }

    // Validate content has enough information
    const minWords = 50;
    const words = content.trim().split(/\s+/).length;
    if (words < minWords) {
      return NextResponse.json({ 
        error: 'Please provide more details from the job posting. The provided content seems incomplete.' 
      }, { 
        status: 400,
        headers: corsHeaders 
      });
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: `Analyze this job posting content and create a response following the format specified in the system prompt: ${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      if (!completion?.choices?.[0]?.message?.content) {
        throw new Error('Failed to get valid response from OpenAI');
      }

      const cleanContent = completion.choices[0].message.content
        .replace(/```json\n/, '')
        .replace(/\n```$/, '')
        .trim();

      let parsedContent;
      try {
        parsedContent = JSON.parse(cleanContent);
      } catch (parseError) {
        return NextResponse.json({ 
          error: 'Could not extract job details. Please ensure the URL points to a specific job posting.' 
        }, { 
          status: 400,
          headers: corsHeaders 
        });
      }

      // Generate a unique ID for this analysis
      const analysisId = Math.random().toString(36).substring(2, 15);
      
      // Store the analysis in Redis
      const analysisData = {
        ...parsedContent,
        jobContent: content,
        createdAt: new Date().toISOString()
      };
      
      const stored = await storeAnalysis(analysisId, analysisData);
      if (!stored) {
        return NextResponse.json({ 
          error: 'Failed to store job analysis. Please try again.' 
        }, { 
          status: 500,
          headers: corsHeaders 
        });
      }

      return NextResponse.json({
        id: analysisId,
        ...parsedContent,
        jobContent: content
      }, { 
        headers: corsHeaders 
      });
    } catch (error) {
      console.error('Error in OpenAI request:', error);
      return NextResponse.json({ 
        error: error.message || 'Failed to analyze job posting. Please try again.' 
      }, { 
        status: 500,
        headers: corsHeaders 
      });
    }
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze job posting. Please try again.' },
      { status: 500, headers: corsHeaders }
    );
  }
} 