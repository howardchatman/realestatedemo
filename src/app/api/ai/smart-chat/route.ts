import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface ConversationMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface SmartChatRequest {
  message: string;
  conversationHistory?: ConversationMessage[];
  sessionId?: string;
}

// Detect if a question requires GPT (complex analysis)
function isComplexQuestion(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  const complexPatterns = [
    // Property comparisons
    /compare/i,
    /vs\.?|versus/i,
    /difference between/i,
    /which (one|property|home|house) (is|would be)/i,
    /better (choice|option|value|investment)/i,

    // Market analysis
    /market (trend|analysis|condition|outlook)/i,
    /price (trend|history|forecast)/i,
    /appreciation/i,
    /investment (potential|opportunity|return)/i,
    /roi|return on investment/i,
    /rental (yield|income|potential)/i,

    // Neighborhood insights
    /neighborhood|area|community/i,
    /school (district|rating|quality)/i,
    /crime (rate|safety)/i,
    /walkability|walk score/i,
    /commute|transportation/i,
    /demographics/i,
    /amenities/i,

    // Pros and cons
    /pros (and|&) cons/i,
    /advantages|disadvantages/i,
    /should i (buy|invest|consider)/i,

    // Financial analysis
    /mortgage|monthly payment/i,
    /afford/i,
    /down payment/i,
    /closing costs/i,
    /property tax/i,
    /hoa fees/i,

    // General complex questions
    /what do you think/i,
    /your opinion/i,
    /recommend|suggestion/i,
    /explain|tell me (more )?about/i,
    /why (is|are|should|would)/i,
    /how (does|do|would|should)/i,
  ];

  return complexPatterns.some(pattern => pattern.test(lowerMessage));
}

// Build system prompt for real estate AI assistant
function buildSystemPrompt(): string {
  return `You are AIVA, an intelligent AI real estate assistant for Chatman RP, a real estate platform serving the Houston area.

Your capabilities:
- Property comparisons and analysis
- Market trends and investment insights
- Neighborhood information (schools, safety, amenities)
- Financial guidance (mortgages, payments, ROI)
- General real estate advice

Guidelines:
- Be helpful, friendly, and professional
- Give concise but thorough answers (2-4 paragraphs max)
- Use specific data points when available
- If you don't have specific data, provide general guidance
- Always offer to help with next steps (schedule showing, connect with agent)
- Format prices as $XXX,XXX
- For Houston-specific questions, use your knowledge of Houston neighborhoods

Available demo properties for reference:
- Oakwood: Lakefront properties, luxury homes $750K-$1.5M
- Downtown: Urban condos and townhomes $450K-$900K
- Riverside: Colonial homes, family-friendly $350K-$650K
- Tech Park: Modern smart homes $500K-$900K
- Beachfront: Ocean view properties $1M-$3M
- Pine Ridge: Mountain retreats $400K-$800K

When discussing specific properties, mention you can show them listings or schedule tours.`;
}

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured', isComplex: false },
        { status: 500 }
      );
    }

    const body = await request.json() as SmartChatRequest;
    const { message, conversationHistory = [] } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if this is a complex question that needs GPT
    const isComplex = isComplexQuestion(message);

    if (!isComplex) {
      // Return early - let the local flow handle simple questions
      return NextResponse.json({
        success: true,
        data: {
          isComplex: false,
          message: 'Question is simple, use local flow',
        },
      });
    }

    // Build messages for OpenAI
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: buildSystemPrompt() },
    ];

    // Add conversation history (last 6 messages for context)
    const recentHistory = conversationHistory.slice(-6);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      });
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: 'Failed to get AI response', isComplex: true },
        { status: 500 }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content?.trim();

    if (!aiResponse) {
      return NextResponse.json(
        { success: false, error: 'No response generated', isComplex: true },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        response: aiResponse,
        isComplex: true,
        usage: {
          prompt_tokens: data.usage?.prompt_tokens,
          completion_tokens: data.usage?.completion_tokens,
          total_tokens: data.usage?.total_tokens,
        },
      },
    });
  } catch (error) {
    console.error('Error in smart chat:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
