import { NextRequest, NextResponse } from 'next/server';
import { createLead, Lead, getOrCreateUser } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // First, create or get the user account
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
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
