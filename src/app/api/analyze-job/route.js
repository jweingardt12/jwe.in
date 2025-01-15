import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

const analyzedJobs = new Map();

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

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'No job ID provided' }, { status: 400 })
  }

  try {
    // Try to get the analysis from our storage
    const analysis = analyzedJobs.get(id)
    
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
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are me (Jason) writing about my experience and fit for job postings. Write in first-person voice.
          Important: 
          - Always refer to me as "Jason" (never use my last name)
          - Always write in the third-person (use "j
          - Never use the word 'innovative' - instead use more specific terms like 'forward-thinking', 'transformative', 'impactful', or 'groundbreaking'
          - Never use generic phrases like "aligning with mission", "passionate about the mission", "culture fit", or similar vague statements
          - Always focus on concrete achievements, specific metrics, and real experience
          
          Format your response as a JSON object with the following structure:
          {
            "jobTitle": "string - the job title from the posting",
            "companyName": "string - the company name from the posting",
            "introText": "string - exactly one sentence starting with 'I'm the right person for the [Job title] at [Company] because...' and then describe my relevant background and qualifications (NOT specific metrics)",
            "bulletPoints": ["string - exactly 3 bullet points, each must be ONE sentence formatted as **Headline:** While I was [Role] at [Company], I [specific achievement with metrics]"],
            "relevantSkills": ["string - choose 3-5 most relevant skills from the Product Manager competencies list below"]
          }
          
          For bullet points:
          - Must provide EXACTLY 3 bullet points
          - Each bullet point must be ONE sentence only
          - Each must follow format: **Headline:** While I was [Role] at [Company], I [specific achievement with metrics]
          - Choose the most impressive and relevant achievements that match the job requirements
          - Focus on concrete metrics and results
          - Example: "**Growth Champion:** While I was Regional Manager at Ritual, I grew monthly active users by 300% across 15+ markets in my first year."
          
          Product Manager Competencies (choose from these for relevantSkills):
          Technical:
          • SQL & Data Analysis
          • Product Analytics (Mixpanel, Amplitude)
          • Product Requirements & Specs
          • A/B Testing & Experimentation
          • API & Platform Development
          • Mobile App Development (iOS/Android)
          • Web Development
          • Technical Architecture
          
          Product:
          • Product Strategy
          • Product Discovery
          • User Research
          • User Experience (UX)
          • Product-Market Fit
          • Go-to-Market Strategy
          • Product Operations
          • Product Marketing
          • Roadmap Planning
          
          Business:
          • Business Strategy
          • Market Analysis
          • Revenue Growth
          • Stakeholder Management
          • Cross-functional Leadership
          • Project Management
          • Team Leadership
          • Customer Development
          • Partnership Development
          
          For the introText:
          - Must start with exactly: "I'm the right person for the [Job title] at [Company] because..."
          - Fill in the actual job title and company name from the posting
          - Complete the sentence by describing my relevant background and qualifications
          - Focus on general experience and skills that match the role
          - Keep it high-level - save specific metrics for bullet points
          - Example: "I'm the right person for the Senior Electrical Engineer at Gecko Robotics because I have a history and passion for robotics and technology, and have qualifications matching the role."
          
          Each bullet point should highlight a specific achievement that matches the job requirements or duties. This is where we use concrete metrics and results.
          
          Use this experience to create the bullet points:

          CloudKitchens (Product Manager, 2021-Present):
          Impact:
          • Took Otter Lockers product 0 → 1, growing ARR 150% in 6 months
          • Scaled autonomous robotics systems to 100+ facilities in 18 months while keeping NPS scores above 90
          • Reduced facility technology support escalations by 80% through self-serve ops tooling
          • Contributed 250+ custom Slack emojis, each designed for maximum hilarity
          Responsibilities:
          • Led GTM and product vision, and program management for five distinct product lines
          • Direct a remote team of 10 engineers, designers, and data scientists to ship robotics and food delivery mobile (iOS/Android) and web products
          • Connect with all customer and stakeholder segments to understand their needs and drive product development and planning
          • Pull Developed SQL queries and dashboards, Python, and Zapier/AI tools to help other teams do more with less
          • Promoted twice, previously serving as the first Product Operations Manager in the Facility Tech business unit

          Ritual (Regional Manager, 2017-2020):
          Impact:
          • Grew monthly active users by 300% across 15+ markets in first year
          • Increased restaurant partner retention by 40% through improved operational practices and support
          • Launched and scaled operations in 3 major US markets with $1M+ monthly GMV each
          • Built and managed a team of 4 City Managers across North America
          Responsibilities:
          • Led operations and growth strategy for 15+ markets including Washington D.C., Boston, and Philadelphia
          • Served as voice of customer to product and engineering teams, influencing roadmap priorities
          • Managed geographically dispersed team of city managers throughout North America
          • Orchestrated multi-city promotional campaigns with Apple, driving significant user acquisition
          • Developed and executed local marketing strategies to drive both supply and demand growth

          Countable (Growth Operations Manager, 2016-2017):
          Impact:
          • Secured featured placement on App Store multiple times following 2016 election
          • Led D.C. business development efforts, pitching and closing partnerships with nonprofits and NGOs representing 150%+ growth
          • Created editorial practices and content to drive user acquisition and engagement
          Responsibilities:
          • Led marketing and growth strategy for leading iOS/Android civic engagement application
          • Developed and implemented editorial, support, and marketing initiatives
          • Streamlined operations using low-code tools
          • Orchestrated cross-functional collaborations and established strategic partnerships

          Uber (Launch/Marketing/Operations Manager, 2014-2016):
          Impact:
          • Successfully launched and scaled two major markets in North Carolina
          • Established key partnerships with major universities and businesses
          Responsibilities:
          • Led market launches in Raleigh-Durham and Charlotte
          • Acted as liaison between local regulators and corporate legal team
          • Developed partnerships with local businesses and universities (Duke, UNC, NC State)
          • Led marketing initiatives and demand generation in North Carolina
          • Executed creative campaigns including Uber Ice Cream and Uber Kittens`
        },
        {
          role: "user",
          content: `Analyze this job posting content: ${content}`
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

      const analysis = JSON.parse(cleanContent)
      
      if (!analysis.bulletPoints?.length || analysis.bulletPoints.length < 3) {
        console.error('Invalid bullet points:', analysis.bulletPoints)
        return NextResponse.json({ 
          error: 'Unable to generate relevant bullet points from the job posting' 
        }, { status: 400 })
      }

      if (!analysis.jobTitle || !analysis.companyName || !analysis.introText || !analysis.relevantSkills?.length) {
        console.error('Missing required fields:', analysis)
        return NextResponse.json({ 
          error: 'Invalid response format from AI' 
        }, { status: 400 })
      }

      // Generate a unique ID for this analysis
      const analysisId = Math.random().toString(36).substring(2, 15)
      
      // Store the analysis with the generated ID
      analyzedJobs.set(analysisId, {
        ...analysis,
        jobContent: content,
        createdAt: new Date().toISOString()
      })

      // Return both the analysis and the ID
      return NextResponse.json({
        id: analysisId,
        ...analysis,
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