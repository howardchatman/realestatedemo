// Retell.ai Integration for AI Voice Calls

const RETELL_API_KEY = process.env.RETELL_API_KEY;
const RETELL_AGENT_ID = process.env.NEXT_PUBLIC_RETELL_AGENT_ID;

export interface RetellCallResponse {
  call_id: string;
  web_call_link?: string;
  access_token?: string;
}

export interface RetellCallData {
  call_id: string;
  call_status: string;
  transcript?: string;
  call_analysis?: {
    summary?: string;
    sentiment?: string;
    custom_analysis?: Record<string, unknown>;
  };
  recording_url?: string;
  duration_ms?: number;
}

// Create a web call (browser-based call)
export async function createWebCall(): Promise<RetellCallResponse> {
  const response = await fetch('https://api.retellai.com/v2/create-web-call', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RETELL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agent_id: RETELL_AGENT_ID,
      metadata: {
        source: 'chatman-real-estate-demo',
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create web call: ${response.statusText}`);
  }

  return response.json();
}

// Create a phone call (outbound)
export async function createPhoneCall(toNumber: string): Promise<RetellCallResponse> {
  const response = await fetch('https://api.retellai.com/v2/create-phone-call', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RETELL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agent_id: RETELL_AGENT_ID,
      to_number: toNumber,
      metadata: {
        source: 'chatman-real-estate-demo',
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create phone call: ${response.statusText}`);
  }

  return response.json();
}

// Get call details
export async function getCallDetails(callId: string): Promise<RetellCallData> {
  const response = await fetch(`https://api.retellai.com/v2/get-call/${callId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${RETELL_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get call details: ${response.statusText}`);
  }

  return response.json();
}

// Register a phone number with Retell
export async function registerPhoneNumber(phoneNumber: string, agentId: string) {
  const response = await fetch('https://api.retellai.com/v2/register-phone-number', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RETELL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone_number: phoneNumber,
      agent_id: agentId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to register phone number: ${response.statusText}`);
  }

  return response.json();
}
