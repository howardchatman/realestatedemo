import { NextRequest, NextResponse } from 'next/server';

const RETELL_API_KEY = process.env.RETELL_API_KEY;
const RETELL_CHAT_AGENT_ID = process.env.NEXT_PUBLIC_RETELL_CHAT_AGENT_ID;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!RETELL_API_KEY || !RETELL_CHAT_AGENT_ID) {
      return NextResponse.json(
        { success: false, error: 'Retell chat not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    // Format conversation history for Retell
    const messages: ChatMessage[] = conversationHistory.map((msg: { sender: string; text: string }) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    }));

    // Add the new user message
    messages.push({
      role: 'user',
      content: message,
    });

    // Call Retell chat API
    const response = await fetch('https://api.retellai.com/v2/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RETELL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: RETELL_CHAT_AGENT_ID,
        messages: messages,
        metadata: {
          source: 'chatman-real-estate-web-chat',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Retell Chat API error:', errorText);
      throw new Error(`Failed to get chat response: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        response: data.response || data.content || data.message,
      },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get response' },
      { status: 500 }
    );
  }
}
