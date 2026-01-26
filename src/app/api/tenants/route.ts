import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// GET - Fetch tenants
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
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.limit(limit);

    if (error) {
      console.error('Error fetching tenants:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch tenants',
        data: [],
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Error in tenants API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tenants', data: [] },
      { status: 200 }
    );
  }
}

// POST - Create tenant
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();

    const tenant = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      property_address: body.property_address,
      unit_number: body.unit_number,
      lease_start: body.lease_start,
      lease_end: body.lease_end,
      rent_amount: body.rent_amount,
      status: body.status || 'active',
    };

    const { data, error } = await supabase
      .from('tenants')
      .insert([tenant])
      .select()
      .single();

    if (error) {
      console.error('Error creating tenant:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to create tenant',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data,
    }, { status: 201 });
  } catch (error) {
    console.error('Error in create tenant API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create tenant' },
      { status: 500 }
    );
  }
}

// DELETE - Remove tenant
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
        { success: false, error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting tenant:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to delete tenant',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Tenant deleted successfully',
    });
  } catch (error) {
    console.error('Error in delete tenant API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete tenant' },
      { status: 500 }
    );
  }
}
