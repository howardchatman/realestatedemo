import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const RETELL_API_KEY = process.env.RETELL_API_KEY;
const RETELL_CHAT_AGENT_ID = process.env.NEXT_PUBLIC_RETELL_CHAT_AGENT_ID;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client for saving conversations
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface StoredMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
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
    const { message, conversationHistory = [], sessionId } = body;

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
          session_id: sessionId,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Retell Chat API error:', errorText);
      throw new Error(`Failed to get chat response: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.response || data.content || data.message;

    // Save conversation to database if sessionId is provided
    if (supabase && sessionId) {
      try {
        const timestamp = new Date().toISOString();

        // Get existing conversation or create new one
        const { data: existingConvo } = await supabase
          .from('chat_conversations')
          .select('id, messages')
          .eq('session_id', sessionId)
          .single();

        const newMessages: StoredMessage[] = [
          { role: 'user', content: message, timestamp },
          { role: 'assistant', content: aiResponse, timestamp },
        ];

        if (existingConvo) {
          // Append to existing messages
          const updatedMessages = [...(existingConvo.messages || []), ...newMessages];
          await supabase
            .from('chat_conversations')
            .update({
              messages: updatedMessages,
              updated_at: timestamp
            })
            .eq('session_id', sessionId);
        } else {
          // Create new conversation
          await supabase
            .from('chat_conversations')
            .insert({
              session_id: sessionId,
              messages: newMessages,
            });
        }
      } catch (dbError) {
        console.error('Error saving chat to database:', dbError);
        // Don't fail the request if DB save fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        response: aiResponse,
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

// GET endpoint to retrieve conversation history (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      // Get specific conversation
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    } else {
      // Get all recent conversations (for admin dashboard)
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }
  } catch (error) {
    console.error('Error fetching chat conversations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
