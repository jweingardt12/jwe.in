import { OpenpanelSdk } from '@openpanel/nextjs'

const opServer = new OpenpanelSdk({
  clientId: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID,
  clientSecret: process.env.OPENPANEL_SECRET,
})

export async function POST(req) {
  try {
    const body = await req.json()
    console.log('OpenPanel request:', {
      url: req.url,
      body,
      headers: Object.fromEntries(req.headers)
    })

    const { type, payload } = body

    switch (type) {
      case 'track':
        await opServer.event(payload.name, {
          ...payload.properties,
          profileId: payload.profileId,
          userAgent: req.headers.get('user-agent'),
          ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
        })
        break

      case 'identify':
        await opServer.identify({
          profileId: payload.profileId,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          properties: payload.properties
        })
        break

      case 'alias':
        await opServer.alias({
          profileId: payload.profileId,
          alias: payload.alias
        })
        break

      case 'increment':
      case 'decrement':
        await opServer[type]({
          profileId: payload.profileId,
          property: payload.property,
          value: payload.value
        })
        break

      default:
        throw new Error(`Unknown event type: ${type}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('OpenPanel error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
