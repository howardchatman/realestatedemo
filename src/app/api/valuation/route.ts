import { NextRequest, NextResponse } from 'next/server';
import { createHomeValuation, createLead, getLeadByEmail } from '@/lib/supabase';

// Mock AI valuation - in production, integrate with a real valuation API
function generateValuation(address: string) {
  // Generate a realistic-looking valuation based on address
  const baseValue = 500000 + Math.random() * 500000;
  const variance = baseValue * 0.05; // 5% variance

  return {
    estimated_value: Math.round(baseValue),
    low_estimate: Math.round(baseValue - variance),
    high_estimate: Math.round(baseValue + variance),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, email, name, phone } = body;

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address is required' },
        { status: 400 }
      );
    }

    // Generate AI valuation
    const valuation = generateValuation(address);

    // If email provided, create/find lead and save valuation
    let leadId = null;
    if (email) {
      let lead = await getLeadByEmail(email);

      if (!lead) {
        lead = await createLead({
          name: name || 'Unknown',
          email,
          phone: phone || '',
          source: 'valuation',
          status: 'new',
          preferred_contact: 'email',
        });
      }

      leadId = lead?.id;

      // Save valuation to database
      await createHomeValuation({
        lead_id: leadId,
        address,
        ...valuation,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        address,
        ...valuation,
        formatted: {
          estimated: `$${valuation.estimated_value.toLocaleString()}`,
          low: `$${valuation.low_estimate.toLocaleString()}`,
          high: `$${valuation.high_estimate.toLocaleString()}`,
        },
      },
    });
  } catch (error) {
    console.error('Error processing valuation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process valuation' },
      { status: 500 }
    );
  }
}
