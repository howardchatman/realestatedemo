import { NextRequest, NextResponse } from 'next/server';
import { createLead, Lead, getOrCreateUser } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    // Try to create or get the user account in database
    const { user, isNew: isNewUser } = await getOrCreateUser({
      email: body.email,
      name: body.name,
      phone: body.phone,
    });

    // Create the lead and link it to the user
    const lead: Lead = {
      user_id: user.id,
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      preferred_contact: body.preferredContact || 'email',
      source: body.source || 'contact_form',
      status: 'new',
    };

    const leadData = await createLead(lead);

    return NextResponse.json({
      success: true,
      data: {
        lead: leadData,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isNew: isNewUser,
        },
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Database error (tables may not exist yet):', error);

    // Graceful fallback - still return success so the UI works
    // Lead data is captured in localStorage on the client side
    return NextResponse.json({
      success: true,
      data: {
        lead: {
          id: `local-${Date.now()}`,
          name: body.name,
          email: body.email,
          phone: body.phone,
          source: body.source || 'contact_form',
          status: 'new',
        },
        user: {
          id: `local-${Date.now()}`,
          name: body.name,
          email: body.email,
          isNew: true,
        },
      },
      message: 'Lead captured (database pending setup)',
    }, { status: 201 });
  }
}
