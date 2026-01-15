import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface User {
  id?: string;
  email: string;
  name: string;
  phone: string;
  password_hash?: string;
  avatar_url?: string;
  is_verified: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Lead {
  id?: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  preferred_contact: 'email' | 'phone' | 'text';
  source: 'contact_form' | 'chat' | 'phone' | 'valuation' | 'lead_capture';
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

// User functions
export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      ...user,
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getUserByPhone(phone: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateUser(id: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Create or get user (for lead capture - returns existing user or creates new one)
export async function getOrCreateUser(userData: { email: string; name: string; phone: string }) {
  // First check if user exists by email
  let user = await getUserByEmail(userData.email);

  if (user) {
    // Update phone if different
    if (user.phone !== userData.phone) {
      user = await updateUser(user.id, { phone: userData.phone, name: userData.name });
    }
    return { user, isNew: false };
  }

  // Check by phone number
  user = await getUserByPhone(userData.phone);

  if (user) {
    // Update email if different
    if (user.email !== userData.email) {
      user = await updateUser(user.id, { email: userData.email, name: userData.name });
    }
    return { user, isNew: false };
  }

  // Create new user
  user = await createUser({
    email: userData.email,
    name: userData.name,
    phone: userData.phone,
    is_verified: false,
  });

  return { user, isNew: true };
}
