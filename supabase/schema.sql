-- Supabase Schema for Chatman Real Estate Demo
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Leads table - captures all potential customers
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  preferred_contact VARCHAR(20) DEFAULT 'email' CHECK (preferred_contact IN ('email', 'phone', 'text')),
  source VARCHAR(50) DEFAULT 'contact_form' CHECK (source IN ('contact_form', 'chat', 'phone', 'valuation')),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property inquiries - requests for showings, info, etc.
CREATE TABLE IF NOT EXISTS property_inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  property_address VARCHAR(500) NOT NULL,
  inquiry_type VARCHAR(20) DEFAULT 'info' CHECK (inquiry_type IN ('showing', 'info', 'offer')),
  preferred_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Home valuations - AI-powered property estimates
CREATE TABLE IF NOT EXISTS home_valuations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  address VARCHAR(500) NOT NULL,
  estimated_value DECIMAL(12, 2),
  low_estimate DECIMAL(12, 2),
  high_estimate DECIMAL(12, 2),
  property_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat conversations - AIVA chat history
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phone calls - Retell.ai call logs
CREATE TABLE IF NOT EXISTS phone_calls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  retell_call_id VARCHAR(255) UNIQUE,
  caller_phone VARCHAR(50),
  duration_seconds INTEGER,
  transcript TEXT,
  summary TEXT,
  sentiment VARCHAR(20),
  call_status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_lead_id ON property_inquiries(lead_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_session_id ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_phone_calls_retell_call_id ON phone_calls(retell_call_id);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (for the demo)
-- In production, you'd want more restrictive policies

CREATE POLICY "Allow anonymous insert on leads" ON leads
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on property_inquiries" ON property_inquiries
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on home_valuations" ON home_valuations
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous access to chat_conversations" ON chat_conversations
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on phone_calls" ON phone_calls
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on newsletter_subscriptions" ON newsletter_subscriptions
  FOR INSERT TO anon WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at
  BEFORE UPDATE ON chat_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
