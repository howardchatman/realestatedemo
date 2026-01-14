import { NextRequest, NextResponse } from 'next/server';

const RETELL_API_KEY = process.env.RETELL_API_KEY;
const RETELL_AGENT_ID = process.env.NEXT_PUBLIC_RETELL_AGENT_ID;

export async function POST(request: NextRequest) {
  try {
    if (!RETELL_API_KEY || !RETELL_AGENT_ID) {
      return NextResponse.json(
        { success: false, error: 'Retell.ai not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();

    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RETELL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: RETELL_AGENT_ID,
        metadata: {
          source: 'chatman-real-estate-demo',
          user_name: body.name || 'Website Visitor',
          user_email: body.email || '',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Retell API error:', errorText);
      throw new Error(`Failed to create web call: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        call_id: data.call_id,
        access_token: data.access_token,
      },
    });
  } catch (error) {
    console.error('Error creating web call:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start call' },
      { status: 500 }
    );
  }
}
