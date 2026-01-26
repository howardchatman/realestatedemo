import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Generate ticket number
function generateTicketNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TKT-${year}${month}-${random}`;
}

// GET - Fetch maintenance tickets
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured', data: [] },
        { status: 200 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const tenantId = searchParams.get('tenant_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('maintenance_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (priority) {
      query = query.eq('priority', priority);
    }

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query.limit(limit);

    if (error) {
      console.error('Error fetching tickets:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch tickets',
        data: [],
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Error in tickets API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets', data: [] },
      { status: 200 }
    );
  }
}

// POST - Create maintenance ticket (from client portal)
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      // Fallback for demo - return mock success
      const body = await request.json();
      return NextResponse.json({
        success: true,
        data: {
          id: `mock-${Date.now()}`,
          ticket_number: generateTicketNumber(),
          ...body,
          status: 'open',
          created_at: new Date().toISOString(),
        },
        message: 'Ticket submitted (demo mode)',
      }, { status: 201 });
    }

    const body = await request.json();

    const ticket = {
      ticket_number: generateTicketNumber(),
      tenant_id: body.tenant_id || null,
      tenant_name: body.tenant_name,
      tenant_email: body.tenant_email,
      property_address: body.property_address,
      unit_number: body.unit_number,
      category: body.category,
      priority: body.priority || 'medium',
      title: body.title,
      description: body.description,
      images: body.images || [],
      status: 'open',
    };

    const { data, error } = await supabase
      .from('maintenance_tickets')
      .insert([ticket])
      .select()
      .single();

    if (error) {
      console.error('Error creating ticket:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to create ticket',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data,
    }, { status: 201 });
  } catch (error) {
    console.error('Error in create ticket API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}

// PATCH - Update ticket status
export async function PATCH(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (body.status) updateData.status = body.status;
    if (body.assigned_to) updateData.assigned_to = body.assigned_to;
    if (body.scheduled_date) updateData.scheduled_date = body.scheduled_date;
    if (body.resolution_notes) updateData.resolution_notes = body.resolution_notes;
    if (body.status === 'completed') updateData.resolved_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('maintenance_tickets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating ticket:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to update ticket',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error in update ticket API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}

// DELETE - Remove ticket
export async function DELETE(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('maintenance_tickets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting ticket:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to delete ticket',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error) {
    console.error('Error in delete ticket API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete ticket' },
      { status: 500 }
    );
  }
}
