import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { phoneNumber, delayMinutes, sessionId, notes, name, email } = body;

    // Validate phone number
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Clean and validate phone number format
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const formattedPhone = cleanPhone.length === 10 ? `+1${cleanPhone}` : `+${cleanPhone}`;

    // Default to 5 minutes if not specified
    const delay = Math.max(1, Math.min(delayMinutes || 5, 60)); // 1-60 minutes

    // Calculate scheduled time
    const scheduledFor = new Date(Date.now() + delay * 60 * 1000);

    // Create a new lead first
    const leadName = name || 'Callback Request';
    const leadEmail = email || `callback_${Date.now()}@demo.chatmaninc.com`;

    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .insert({
        name: leadName,
        email: leadEmail,
        phone: formattedPhone,
        message: `Scheduled callback request for ${delay} minutes from now`,
        source: 'chat',
        status: 'new',
        preferred_contact: 'phone',
      })
      .select()
      .single();

    if (leadError) {
      console.error('Error creating lead:', leadError);
      // Continue even if lead creation fails - the callback is more important
    }

    // Insert scheduled callback with lead reference
    const { data, error } = await supabase
      .from('scheduled_callbacks')
      .insert({
        phone_number: formattedPhone,
        scheduled_for: scheduledFor.toISOString(),
        session_id: sessionId || null,
        notes: notes || null,
        status: 'pending',
        lead_id: leadData?.id || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error scheduling callback:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        scheduledFor: data.scheduled_for,
        phoneNumber: data.phone_number,
        delayMinutes: delay,
        // Include lead info so the chat widget can show it
        lead: leadData ? {
          id: leadData.id,
          name: leadData.name,
          email: leadData.email,
          createdAt: leadData.created_at,
        } : null,
      },
      message: `Callback scheduled for ${delay} minute${delay > 1 ? 's' : ''} from now`,
    });
  } catch (error) {
    console.error('Error in schedule callback API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to schedule callback' },
      { status: 500 }
    );
  }
}

// GET endpoint to check scheduled callbacks (for admin)
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('scheduled_callbacks')
      .select('*')
      .order('scheduled_for', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.limit(50);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching scheduled callbacks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch callbacks' },
      { status: 500 }
    );
  }
}
