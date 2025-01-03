import { createNextRouteHandler } from '@openpanel/nextjs/server'

const handler = createNextRouteHandler({
  clientId: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID,
  clientSecret: process.env.OPENPANEL_SECRET
})

export async function GET(req) {
  try {
    console.log('OpenPanel GET request:', {
      url: req.url,
      headers: Object.fromEntries(req.headers)
    })
    return await handler(req)
  } catch (error) {
    console.error('OpenPanel GET error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function POST(req) {
  try {
    const body = await req.clone().json()
    console.log('OpenPanel POST request:', {
      url: req.url,
      body,
      headers: Object.fromEntries(req.headers)
    })
    return await handler(req)
  } catch (error) {
    console.error('OpenPanel POST error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
