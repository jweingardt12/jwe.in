import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { Redis } from '@upstash/redis'
import { SYSTEM_PROMPT } from './prompt.js'

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

// Initialize Redis client with proper environment variables
const redis = new Redis({
  url: process.env.STORAGE_KV_REST_API_URL,
  token: process.env.STORAGE_KV_REST_API_TOKEN,
})

// Helper function to store job analysis in Redis
async function storeAnalysis(id, analysis) {
  try {
    // Store with 7 day expiration
    await redis.set(`job:${id}`, JSON.stringify(analysis), { ex: 60 * 60 * 24 * 7 })
    return true
  } catch (error) {
    console.error('Error storing analysis in Redis:', error)
    return false
  }
}

// Helper function to retrieve job analysis from Redis
async function getAnalysis(id) {
  try {
    const analysis = await redis.get(`job:${id}`)
    return analysis ? JSON.parse(analysis) : null
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

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'No job ID provided' }, { status: 400 })
  }

  try {
    // Try to get the analysis from Redis
    const analysis = await getAnalysis(id)
    
    if (!analysis) {
      return NextResponse.json({ 
        error: 'Job analysis not found. Please generate a new analysis.' 
      }, { status: 404 })
    }

    // Return the stored analysis
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error in GET handler:', error)
    return NextResponse.json({ error: 'Failed to retrieve job analysis' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    if (!openai) {
      console.error('OpenAI API key not configured')
      return NextResponse.json({ 
        error: 'OpenAI API key not configured. Please contact the site administrator.' 
      }, { status: 500 })
    }

    const body = await request.json()
    console.log('Request body:', body)

    const { jobUrl, jobContent } = body

    if (!jobUrl && !jobContent) {
      console.error('No job URL or content provided')
      return NextResponse.json({ error: 'No job URL or content provided' }, { status: 400 })
    }

    // If we have a URL but no content, fetch the content
    let content = jobContent
    if (jobUrl && !jobContent) {
      console.log('Fetching content from URL:', jobUrl)
      if (!jobUrl.startsWith('http')) {
        console.error('Invalid URL format:', jobUrl)
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
      }
      try {
        content = await fetchJobContent(jobUrl)
        console.log('Successfully fetched content, length:', content.length)
      } catch (fetchError) {
        console.error('Error fetching content:', fetchError)
        return NextResponse.json({ error: fetchError.message }, { status: 500 })
      }
    }

    if (!content) {
      console.error('No content available for analysis')
      return NextResponse.json({ error: 'No content available for analysis' }, { status: 400 })
    }

    console.log('Making OpenAI request with content length:', content.length)

    // Use OpenAI to analyze the job posting
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `First verify this is a valid job posting by checking for a job title and company name. If you cannot find these, return { "error": true, "message": "explanation of what's missing" }. Otherwise, analyze this job posting content: ${content}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    console.log('OpenAI response received')
    console.log('Raw OpenAI response:', completion.choices[0].message.content)

    try {
      const cleanContent = completion.choices[0].message.content
        .replace(/```json\n/, '')
        .replace(/\n```$/, '')
        .trim()

      let parsedContent;
      try {
        parsedContent = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError)
        return NextResponse.json({ 
          error: 'Could not extract job details. Please ensure the URL points to a specific job posting.' 
        }, { status: 400 })
      }

      // Check if the response indicates an error
      if (parsedContent.error) {
        return NextResponse.json({ 
          error: parsedContent.message || 'Could not extract job details from the provided content.' 
        }, { status: 400 })
      }

      // Generate a unique ID for this analysis
      const analysisId = Math.random().toString(36).substring(2, 15)
      
      // Store the analysis in Redis
      const analysisData = {
        ...parsedContent,
        jobContent: content,
        createdAt: new Date().toISOString()
      }
      
      const stored = await storeAnalysis(analysisId, analysisData)
      if (!stored) {
        return NextResponse.json({ 
          error: 'Failed to store job analysis. Please try again.' 
        }, { status: 500 })
      }

      // Return both the analysis and the ID
      return NextResponse.json({
        id: analysisId,
        ...parsedContent,
        jobContent: content
      })
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError)
      return NextResponse.json({ 
        error: 'Failed to parse AI response. Please try again.' 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in POST handler:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze job posting. Please try again.' },
      { status: 500 }
    )
  }
} 