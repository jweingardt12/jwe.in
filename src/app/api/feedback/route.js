import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { feedback, email, url, position, timestamp } = await request.json();

    // Validate inputs
    if (!feedback?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Feedback is required' },
        { status: 400 }
      );
    }

    // Send to ActivePieces webhook
    const webhookUrl = 'https://cloud.activepieces.com/api/v1/webhooks/1SD5tYXB3GdwCdQFUCNuS';
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          feedback,
          email,
          url: url || 'website',
          position: {
            x: Math.round(position.x),
            y: Math.round(position.y),
          },
          timestamp,
        }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
