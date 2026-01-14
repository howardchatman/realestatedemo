import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  preferred_contact: 'email' | 'phone' | 'text';
  source: 'contact_form' | 'chat' | 'phone' | 'valuation';
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  created_at?: string;
}

export interface PropertyInquiry {
  id?: string;
  lead_id?: string;
  property_address: string;
  inquiry_type: 'showing' | 'info' | 'offer';
  preferred_date?: string;
  notes?: string;
  created_at?: string;
}

export interface HomeValuation {
  id?: string;
  lead_id?: string;
  address: string;
  estimated_value?: number;
  low_estimate?: number;
  high_estimate?: number;
  created_at?: string;
}

export interface ChatConversation {
  id?: string;
  lead_id?: string;
  session_id: string;
  messages: {
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
  }[];
  created_at?: string;
  updated_at?: string;
}

// Database functions
export async function createLead(lead: Lead) {
  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createPropertyInquiry(inquiry: PropertyInquiry) {
  const { data, error } = await supabase
    .from('property_inquiries')
    .insert([inquiry])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createHomeValuation(valuation: HomeValuation) {
  const { data, error } = await supabase
    .from('home_valuations')
    .insert([valuation])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveChatConversation(conversation: ChatConversation) {
  const { data, error } = await supabase
    .from('chat_conversations')
    .upsert([conversation], { onConflict: 'session_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLeadByEmail(email: string) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}
