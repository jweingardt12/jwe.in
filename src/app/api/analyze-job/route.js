import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI(process.env.OPENAI_API_KEY)
  : null

export async function POST(request) {
  try {
    if (!openai) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured. Please contact the site administrator.' 
      }, { status: 500 })
    }

    const { jobUrl } = await request.json()

    if (!jobUrl) {
      return NextResponse.json({ error: 'No job URL provided' }, { status: 400 })
    }

    // Use OpenAI to analyze the job posting URL
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Jason Weingardt. Write in my voice - authentic, conversational, and direct. You have the ability to browse to URLs and analyze their contents.

First, browse to this URL and analyze the job posting: ${jobUrl}

Then, based on my CV and work history, create a TL;DR summary of why I'd be great for this role. Write naturally, as if I'm explaining my fit to a friend. Avoid corporate buzzwords.

1. Write a one-sentence intro (max 20 words) that connects my experience to what they need.
2. Create exactly 3 bullet points where I:
   - Start with a bold headline (2-3 words max)
   - Share a specific win: "While I was [Role] at [Company], I [specific achievement]" (20 words max)
   - Focus on real results that matter for this role
   - Keep it conversational - write how I'd actually talk

Here are my key experiences (but put them in my voice):
• At CloudKitchens as Product Manager: I built and grew a new product line 150%, rolled out robotics to 100+ locations, made support 80% more efficient
• At Ritual as Regional Manager: I grew users 300%, kept 40% more restaurants happy, built several $1M+ markets from scratch
• At Countable as Growth Ops Manager: I led our growth strategy, got us featured on the App Store multiple times, grew partnerships 150%
• At Uber as Launch Manager: I built new markets from the ground up and created lasting university partnerships

Return a JSON response with this structure:
{
  jobTitle: string,
  companyName: string,
  introText: string,
  bulletPoints: string[], // Format each bullet as "**Headline:** While I was [Role] at [Company], I [achievement]"
  relevantSkills: string[] // List 3-5 skills that matter most for this role
}`
        },
        {
          role: "user",
          content: `Please browse to ${jobUrl} and create a TL;DR summary showing why Jason is a perfect fit for this role.`
        }
      ],
      response_format: { type: "json_object" },
    })

    const analysis = JSON.parse(completion.choices[0].message.content)
    
    // Validate the response
    if (!analysis.bulletPoints?.length) {
      return NextResponse.json({ 
        error: 'Unable to generate relevant bullet points from the job posting' 
      }, { status: 400 })
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error analyzing job:', error)
    return NextResponse.json(
      { error: 'Failed to analyze job posting. Please try again.' },
      { status: 500 }
    )
  }
} 