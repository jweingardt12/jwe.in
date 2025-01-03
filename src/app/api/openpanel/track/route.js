import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, openpanel-client-id, openpanel-client-secret',
      'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers, status: 200 });
    }

    const body = await request.json();
    console.log('Received tracking request:', body);

    const secret = process.env.OPENPANEL_SECRET;
    const clientId = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID;

    if (!secret || !clientId) {
      console.error('Missing OpenPanel credentials:', { secret: !!secret, clientId: !!clientId });
      return NextResponse.json(
        { error: 'Missing OpenPanel credentials' },
        { status: 500, headers }
      );
    }

    // Format the event data according to OpenPanel's API
    const requestBody = {
      type: 'track',
      payload: {
        name: body.event || 'page_view',
        properties: {
          client_id: clientId,
          url: body.data?.url || '',
          path: body.data?.path || '',
          referrer: body.data?.referrer || '',
          timestamp: new Date().toISOString(),
          // Map browser and OS info to OpenPanel's expected fields
          browser: body.data?.browser || null,
          os: body.data?.os || null,
          device: body.data?.device || null,
          // Include other properties
          ...body.data
        }
      }
    };

    // Log the mapped data for debugging
    console.log('Mapped event data:', {
      browser: body.data?.browser,
      os: body.data?.os,
      device: body.data?.device
    });

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const requestHeaders = {
      'Content-Type': 'application/json',
      'openpanel-client-id': clientId,
      'openpanel-client-secret': secret
    };

    console.log('Forwarding to OpenPanel API:', {
      url: 'https://api.openpanel.dev/track',
      headers: requestHeaders,
      body: requestBody
    });
    
    const response = await fetch('https://api.openpanel.dev/track', {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody)
    });

    let responseData;
    const responseText = await response.text();
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse OpenPanel response:', responseText);
      responseData = { error: 'Invalid response from OpenPanel' };
    }

    console.log('OpenPanel API response:', { 
      status: response.status, 
      data: responseData,
      headers: Object.fromEntries(response.headers)
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to track event', details: responseData },
        { status: response.status, headers }
      );
    }

    return NextResponse.json(
      { success: true, data: responseData },
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Error in tracking endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500, headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }}
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, openpanel-client-id, openpanel-client-secret'
      }
    }
  );
}
