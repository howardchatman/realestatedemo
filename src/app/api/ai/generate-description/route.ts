import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface PropertyDetails {
  address?: string;
  propertyType?: string; // House, Condo, Townhouse, Commercial, etc.
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  lotSize?: string;
  yearBuilt?: number;
  price?: number;
  features?: string[]; // Pool, garage, updated kitchen, etc.
  neighborhood?: string;
  style?: 'luxury' | 'family' | 'investment' | 'starter' | 'commercial';
}

function buildPrompt(details: PropertyDetails): string {
  const {
    address,
    propertyType = 'home',
    bedrooms,
    bathrooms,
    squareFootage,
    lotSize,
    yearBuilt,
    price,
    features = [],
    neighborhood,
    style = 'family',
  } = details;

  const styleGuide = {
    luxury: 'Use elegant, sophisticated language. Emphasize exclusivity, premium finishes, and lifestyle.',
    family: 'Warm and welcoming tone. Highlight space for family activities, safety, and convenience.',
    investment: 'Focus on ROI potential, rental income, appreciation, and market position.',
    starter: 'Friendly and encouraging. Emphasize value, potential, and first-time buyer benefits.',
    commercial: 'Professional and business-focused. Highlight location, traffic, visibility, and business potential.',
  };

  let prompt = `Write a compelling real estate listing description for a ${propertyType}.\n\n`;
  prompt += `Style: ${styleGuide[style]}\n\n`;
  prompt += `Property Details:\n`;

  if (address) prompt += `- Address: ${address}\n`;
  if (bedrooms) prompt += `- Bedrooms: ${bedrooms}\n`;
  if (bathrooms) prompt += `- Bathrooms: ${bathrooms}\n`;
  if (squareFootage) prompt += `- Square Footage: ${squareFootage.toLocaleString()} sq ft\n`;
  if (lotSize) prompt += `- Lot Size: ${lotSize}\n`;
  if (yearBuilt) prompt += `- Year Built: ${yearBuilt}\n`;
  if (price) prompt += `- Listing Price: $${price.toLocaleString()}\n`;
  if (neighborhood) prompt += `- Neighborhood: ${neighborhood}\n`;
  if (features.length > 0) prompt += `- Features: ${features.join(', ')}\n`;

  prompt += `\nRequirements:
- Write 2-3 paragraphs (150-250 words total)
- Start with an attention-grabbing opening line
- Highlight the best features naturally
- Include a call to action at the end
- Do NOT include the price in the description
- Do NOT use ALL CAPS or excessive exclamation marks
- Sound professional but personable`;

  return prompt;
}

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { propertyDetails } = body as { propertyDetails: PropertyDetails };

    if (!propertyDetails) {
      return NextResponse.json(
        { success: false, error: 'Property details are required' },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(propertyDetails);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert real estate copywriter who creates compelling, professional property listings that drive buyer interest and showings.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: 'Failed to generate description' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const description = data.choices?.[0]?.message?.content?.trim();

    if (!description) {
      return NextResponse.json(
        { success: false, error: 'No description generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        description,
        usage: {
          prompt_tokens: data.usage?.prompt_tokens,
          completion_tokens: data.usage?.completion_tokens,
          total_tokens: data.usage?.total_tokens,
        },
      },
    });
  } catch (error) {
    console.error('Error generating description:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate description' },
      { status: 500 }
    );
  }
}
