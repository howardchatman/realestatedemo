import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const RETELL_API_KEY = process.env.RETELL_API_KEY;
const RETELL_AGENT_ID = process.env.NEXT_PUBLIC_RETELL_AGENT_ID;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client for fetching chat history
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

interface StoredMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!RETELL_API_KEY || !RETELL_AGENT_ID) {
      return NextResponse.json(
        { success: false, error: 'Retell.ai not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { sessionId, name, email } = body;

    // Try to get chat history for context
    let chatContext = '';
    if (supabase && sessionId) {
      try {
        const { data: convo } = await supabase
          .from('chat_conversations')
          .select('messages')
          .eq('session_id', sessionId)
          .single();

        if (convo?.messages && Array.isArray(convo.messages)) {
          // Create a summary of recent chat messages for the voice agent
          const recentMessages = convo.messages.slice(-6) as StoredMessage[];
          chatContext = recentMessages
            .map((m: StoredMessage) => `${m.role === 'user' ? 'User' : 'AIVA'}: ${m.content}`)
            .join('\n');
        }
      } catch (dbError) {
        console.error('Error fetching chat context:', dbError);
        // Continue without chat context
      }
    }

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
          session_id: sessionId || '',
          user_name: name || 'Website Visitor',
          user_email: email || '',
          // Pass chat context so voice agent knows what was discussed
          chat_context: chatContext || 'No previous chat conversation',
        },
        // If there's chat context, add it to the agent's context
        ...(chatContext && {
          retell_llm_dynamic_variables: {
            previous_conversation: chatContext,
          },
        }),
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
