export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID;
  
  try {
    // Try a direct API call to OpenPanel
    const response = await fetch('https://api.openpanel.dev/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'openpanel-client-id': clientId,
      },
      body: JSON.stringify({
        type: 'track',
        payload: {
          name: 'api_test_event',
          properties: {
            source: 'nextjs_api_route',
            timestamp: new Date().toISOString(),
            clientId: clientId
          }
        }
      })
    });

    const responseText = await response.text();
    
    return Response.json({
      success: response.ok,
      status: response.status,
      clientId: clientId,
      response: responseText,
      headers: Object.fromEntries(response.headers.entries())
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
      clientId: clientId
    });
  }
}