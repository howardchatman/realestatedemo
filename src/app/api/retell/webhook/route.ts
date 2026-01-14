import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use service role for webhook (server-side) - only create client if keys are available
let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

export async function POST(request: NextRequest) {
  try {
    // If Supabase isn't configured, just acknowledge the webhook
    if (!supabase) {
      console.log('Retell webhook received but Supabase service key not configured');
      return NextResponse.json({ success: true, message: 'Webhook received (database not configured)' });
    }

    const body = await request.json();

    // Retell sends various webhook events
    const { event, call } = body;

    console.log('Retell webhook received:', event, call?.call_id);

    if (event === 'call_ended' || event === 'call_analyzed') {
      // Save call data to database
      const callData = {
        retell_call_id: call.call_id,
        caller_phone: call.from_number || null,
        duration_seconds: call.duration_ms ? Math.round(call.duration_ms / 1000) : null,
        transcript: call.transcript || null,
        summary: call.call_analysis?.summary || null,
        sentiment: call.call_analysis?.sentiment || null,
        call_status: call.call_status || 'completed',
      };

      const { error } = await supabase
        .from('phone_calls')
        .upsert([callData], { onConflict: 'retell_call_id' });

      if (error) {
        console.error('Error saving call data:', error);
      }

      // If we have user info from metadata, try to link to a lead
      if (call.metadata?.user_email) {
        const { data: lead } = await supabase
          .from('leads')
          .select('id')
          .eq('email', call.metadata.user_email)
          .single();

        if (lead) {
          await supabase
            .from('phone_calls')
            .update({ lead_id: lead.id })
            .eq('retell_call_id', call.call_id);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
