import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// GET - Fetch payments
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured', data: [] },
        { status: 200 }
      );
    }

    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoice_id');
    const tenantId = searchParams.get('tenant_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (invoiceId) {
      query = query.eq('invoice_id', invoiceId);
    }

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query.limit(limit);

    if (error) {
      console.error('Error fetching payments:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch payments',
        data: [],
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Error in payments API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments', data: [] },
      { status: 200 }
    );
  }
}

// POST - Record payment
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();

    const payment = {
      invoice_id: body.invoice_id || null,
      tenant_id: body.tenant_id || null,
      amount: body.amount,
      payment_method: body.payment_method || 'card',
      payment_status: body.payment_status || 'completed',
      transaction_id: body.transaction_id,
      notes: body.notes,
    };

    const { data, error } = await supabase
      .from('payments')
      .insert([payment])
      .select()
      .single();

    if (error) {
      console.error('Error recording payment:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to record payment',
      }, { status: 500 });
    }

    // If payment is linked to an invoice, update invoice status to paid
    if (body.invoice_id && body.payment_status === 'completed') {
      await supabase
        .from('invoices')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', body.invoice_id);
    }

    return NextResponse.json({
      success: true,
      data,
    }, { status: 201 });
  } catch (error) {
    console.error('Error in record payment API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record payment' },
      { status: 500 }
    );
  }
}
