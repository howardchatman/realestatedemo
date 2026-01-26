import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface DocumentAnalysisRequest {
  documentType: 'lease' | 'contract' | 'agreement' | 'other';
  documentText: string;
  fileName?: string;
}

function buildAnalysisPrompt(documentType: string, text: string): string {
  const typeInstructions: Record<string, string> = {
    lease: `Analyze this lease agreement and extract:
- Lease term (start date, end date, duration)
- Monthly rent amount
- Security deposit
- Late fees and grace period
- Pet policy
- Maintenance responsibilities (tenant vs landlord)
- Move-out requirements
- Early termination clause
- Key restrictions (subletting, modifications, etc.)
- Renewal terms`,

    contract: `Analyze this real estate contract and extract:
- Parties involved
- Property address/description
- Purchase price or terms
- Key dates (closing, inspection, etc.)
- Contingencies
- Included/excluded items
- Financing terms
- Default clauses
- Important deadlines`,

    agreement: `Analyze this agreement and extract:
- Parties involved
- Purpose of agreement
- Key terms and conditions
- Duration/timeline
- Payment terms (if any)
- Obligations of each party
- Termination conditions
- Important clauses`,

    other: `Analyze this document and extract:
- Document type/purpose
- Key parties mentioned
- Important dates
- Main terms and conditions
- Any financial obligations
- Notable clauses or restrictions`
  };

  return `${typeInstructions[documentType] || typeInstructions.other}

Provide your analysis in a clear, structured format with:
1. A brief summary (2-3 sentences)
2. Key Terms section with bullet points
3. Important Dates section
4. Financial Summary (if applicable)
5. Things to Watch Out For (potential concerns or unusual clauses)

Be concise but thorough. Highlight anything that seems unusual or requires attention.

Document text:
${text}`;
}

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json() as DocumentAnalysisRequest;
    const { documentType, documentText, fileName } = body;

    if (!documentText) {
      return NextResponse.json(
        { success: false, error: 'Document text is required' },
        { status: 400 }
      );
    }

    // Limit text length to prevent excessive API costs
    const maxLength = 15000;
    const truncatedText = documentText.length > maxLength
      ? documentText.substring(0, maxLength) + '\n\n[Document truncated for analysis...]'
      : documentText;

    const prompt = buildAnalysisPrompt(documentType, truncatedText);

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
            content: 'You are an expert legal document analyst specializing in real estate documents. Provide clear, accurate summaries that help tenants and buyers understand their documents. Always highlight important deadlines, financial obligations, and potential concerns.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent analysis
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: 'Failed to analyze document' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content?.trim();

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: 'No analysis generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        documentType,
        fileName,
        analyzedAt: new Date().toISOString(),
        usage: {
          prompt_tokens: data.usage?.prompt_tokens,
          completion_tokens: data.usage?.completion_tokens,
          total_tokens: data.usage?.total_tokens,
        },
      },
    });
  } catch (error) {
    console.error('Error analyzing document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze document' },
      { status: 500 }
    );
  }
}
