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

-- Scheduled callbacks - for "call me back in X minutes" feature
CREATE TABLE IF NOT EXISTS scheduled_callbacks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  session_id VARCHAR(255),
  phone_number VARCHAR(50) NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  retell_call_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Tenants/Clients - property tenants or clients
CREATE TABLE IF NOT EXISTS tenants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  property_address VARCHAR(500),
  unit_number VARCHAR(50),
  lease_start DATE,
  lease_end DATE,
  rent_amount DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices - for rent, fees, services
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  tenant_name VARCHAR(255) NOT NULL,
  tenant_email VARCHAR(255) NOT NULL,
  property_address VARCHAR(500),
  description TEXT NOT NULL,
  line_items JSONB DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'sent', 'paid', 'overdue', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Payments - track all payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'card' CHECK (payment_method IN ('card', 'bank_transfer', 'cash', 'check', 'other')),
  payment_status VARCHAR(20) DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maintenance Tickets - from client portal
CREATE TABLE IF NOT EXISTS maintenance_tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  tenant_name VARCHAR(255) NOT NULL,
  tenant_email VARCHAR(255) NOT NULL,
  property_address VARCHAR(500) NOT NULL,
  unit_number VARCHAR(50),
  category VARCHAR(50) NOT NULL CHECK (category IN ('plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'pest', 'other')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'pending_parts', 'scheduled', 'completed', 'cancelled')),
  assigned_to VARCHAR(255),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_lead_id ON property_inquiries(lead_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_session_id ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_phone_calls_retell_call_id ON phone_calls(retell_call_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_callbacks_scheduled_for ON scheduled_callbacks(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_callbacks_status ON scheduled_callbacks(status);
CREATE INDEX IF NOT EXISTS idx_tenants_email ON tenants(email);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant_id ON invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_tenant_id ON payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tickets_tenant_id ON maintenance_tickets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tickets_status ON maintenance_tickets(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_tickets_priority ON maintenance_tickets(priority);

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

ALTER TABLE scheduled_callbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert on scheduled_callbacks" ON scheduled_callbacks
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Service role full access on scheduled_callbacks" ON scheduled_callbacks
  FOR ALL USING (auth.role() = 'service_role');

-- RLS for new tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on tenants" ON tenants
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on invoices" ON invoices
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on payments" ON payments
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow anonymous insert on maintenance_tickets" ON maintenance_tickets
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Service role full access on maintenance_tickets" ON maintenance_tickets
  FOR ALL USING (auth.role() = 'service_role');

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

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_tickets_updated_at
  BEFORE UPDATE ON maintenance_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
