import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RETELL_API_KEY = process.env.RETELL_API_KEY;
const RETELL_AGENT_ID = process.env.NEXT_PUBLIC_RETELL_AGENT_ID;

// Your Retell phone number that will make the outbound call
const RETELL_FROM_NUMBER = process.env.RETELL_FROM_NUMBER || '+18322637932';

// Live agent transfer number
const LIVE_AGENT_NUMBER = '+18328597009';

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Verify cron secret to prevent unauthorized access
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // If no secret configured, allow in development
  if (!cronSecret) {
    console.warn('CRON_SECRET not configured - allowing request');
    return true;
  }

  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    if (!verifyCronSecret(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!supabase || !RETELL_API_KEY || !RETELL_AGENT_ID) {
      return NextResponse.json(
        { success: false, error: 'Services not configured' },
        { status: 500 }
      );
    }

    // Find callbacks that are due (scheduled_for <= now) and still pending
    const now = new Date().toISOString();

    const { data: pendingCallbacks, error: fetchError } = await supabase
      .from('scheduled_callbacks')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', now)
      .order('scheduled_for', { ascending: true })
      .limit(10); // Process up to 10 at a time

    if (fetchError) {
      console.error('Error fetching pending callbacks:', fetchError);
      throw fetchError;
    }

    if (!pendingCallbacks || pendingCallbacks.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No callbacks to process',
        processed: 0,
      });
    }

    console.log(`Processing ${pendingCallbacks.length} scheduled callback(s)`);

    const results = [];

    for (const callback of pendingCallbacks) {
      try {
        // Mark as processing
        await supabase
          .from('scheduled_callbacks')
          .update({ status: 'processing' })
          .eq('id', callback.id);

        // Get chat context if session exists
        let chatContext = '';
        if (callback.session_id) {
          const { data: convo } = await supabase
            .from('chat_conversations')
            .select('messages')
            .eq('session_id', callback.session_id)
            .single();

          if (convo?.messages && Array.isArray(convo.messages)) {
            const recentMessages = convo.messages.slice(-6);
            chatContext = recentMessages
              .map((m: { role: string; content: string }) =>
                `${m.role === 'user' ? 'User' : 'AIVA'}: ${m.content}`
              )
              .join('\n');
          }
        }

        // Make outbound call via Retell
        const callResponse = await fetch('https://api.retellai.com/v2/create-phone-call', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RETELL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agent_id: RETELL_AGENT_ID,
            from_number: RETELL_FROM_NUMBER,
            to_number: callback.phone_number,
            metadata: {
              callback_id: callback.id,
              session_id: callback.session_id || '',
              scheduled_callback: true,
              live_agent_transfer_number: LIVE_AGENT_NUMBER,
              chat_context: chatContext || 'No previous chat',
            },
            // Pass context to agent
            retell_llm_dynamic_variables: {
              is_scheduled_callback: 'true',
              previous_conversation: chatContext || 'This is a scheduled callback. The user requested to be called back.',
              transfer_number: LIVE_AGENT_NUMBER,
            },
          }),
        });

        if (!callResponse.ok) {
          const errorText = await callResponse.text();
          console.error(`Failed to create call for ${callback.id}:`, errorText);

          await supabase
            .from('scheduled_callbacks')
            .update({
              status: 'failed',
              notes: `Call failed: ${errorText}`,
              processed_at: new Date().toISOString(),
            })
            .eq('id', callback.id);

          results.push({ id: callback.id, status: 'failed', error: errorText });
          continue;
        }

        const callData = await callResponse.json();

        // Mark as completed
        await supabase
          .from('scheduled_callbacks')
          .update({
            status: 'completed',
            retell_call_id: callData.call_id,
            processed_at: new Date().toISOString(),
          })
          .eq('id', callback.id);

        results.push({
          id: callback.id,
          status: 'completed',
          call_id: callData.call_id,
          phone: callback.phone_number,
        });

        console.log(`Callback ${callback.id} processed - Call ID: ${callData.call_id}`);

      } catch (callError) {
        console.error(`Error processing callback ${callback.id}:`, callError);

        await supabase
          .from('scheduled_callbacks')
          .update({
            status: 'failed',
            notes: `Error: ${callError instanceof Error ? callError.message : 'Unknown error'}`,
            processed_at: new Date().toISOString(),
          })
          .eq('id', callback.id);

        results.push({ id: callback.id, status: 'failed', error: String(callError) });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.length} callback(s)`,
      processed: results.length,
      results,
    });

  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { success: false, error: 'Cron job failed' },
      { status: 500 }
    );
  }
}
