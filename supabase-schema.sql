-- Supabase Database Schema for Chatman Real Estate
-- Run this in your Supabase SQL Editor to create the required tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE - Captured leads become user accounts
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255), -- For future authentication
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- =====================================================
-- LEADS TABLE - Track all lead captures
-- =====================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  message TEXT,
  preferred_contact VARCHAR(20) DEFAULT 'email' CHECK (preferred_contact IN ('email', 'phone', 'text')),
  source VARCHAR(50) DEFAULT 'contact_form' CHECK (source IN ('contact_form', 'chat', 'phone', 'valuation', 'lead_capture', 'listing_detail', 'landing_page', 'listings_page')),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes TEXT,
  assigned_to VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- =====================================================
-- PROPERTY INQUIRIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS property_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  property_address TEXT NOT NULL,
  property_id VARCHAR(100),
  inquiry_type VARCHAR(20) DEFAULT 'info' CHECK (inquiry_type IN ('showing', 'info', 'offer')),
  preferred_date TIMESTAMPTZ,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- HOME VALUATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS home_valuations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  address TEXT NOT NULL,
  estimated_value DECIMAL(12, 2),
  low_estimate DECIMAL(12, 2),
  high_estimate DECIMAL(12, 2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  square_feet INTEGER,
  year_built INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CHAT CONVERSATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  messages JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_session_id ON chat_conversations(session_id);

-- =====================================================
-- SAVED PROPERTIES TABLE (User favorites)
-- =====================================================
CREATE TABLE IF NOT EXISTS saved_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  property_id VARCHAR(100) NOT NULL,
  property_data JSONB, -- Cache property details
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_properties_user ON saved_properties(user_id);

-- =====================================================
-- SAVED SEARCHES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  search_criteria JSONB NOT NULL, -- Store filter criteria
  notifications_enabled BOOLEAN DEFAULT TRUE,
  last_notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id);

-- =====================================================
-- AI CALL LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_call_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  caller_name VARCHAR(255),
  caller_phone VARCHAR(50),
  duration_seconds INTEGER,
  call_type VARCHAR(20) DEFAULT 'inbound' CHECK (call_type IN ('inbound', 'outbound')),
  sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  summary TEXT,
  transcript JSONB,
  retell_call_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_calls_created_at ON ai_call_logs(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_call_logs ENABLE ROW LEVEL SECURITY;

-- Allow public insert for lead capture (no auth required)
CREATE POLICY "Allow public insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON leads FOR INSERT WITH CHECK (true);

-- Allow service role full access (for API routes)
CREATE POLICY "Service role full access" ON users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON leads FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON property_inquiries FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON home_valuations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON chat_conversations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON saved_properties FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON saved_searches FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON ai_call_logs FOR ALL USING (auth.role() = 'service_role');

-- Allow anon key to insert (for client-side lead capture)
CREATE POLICY "Allow anon insert users" ON users FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon insert leads" ON leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon select users" ON users FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon select leads" ON leads FOR SELECT TO anon USING (true);

-- =====================================================
-- HELPFUL VIEWS
-- =====================================================

-- View for admin dashboard: Recent leads with user info
CREATE OR REPLACE VIEW lead_dashboard AS
SELECT
  l.id as lead_id,
  l.name,
  l.email,
  l.phone,
  l.source,
  l.status,
  l.message,
  l.created_at,
  u.id as user_id,
  u.is_verified,
  u.last_login,
  (SELECT COUNT(*) FROM leads WHERE user_id = u.id) as total_inquiries
FROM leads l
LEFT JOIN users u ON l.user_id = u.id
ORDER BY l.created_at DESC;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Uncomment below to insert sample data:

-- INSERT INTO users (email, name, phone, is_verified) VALUES
-- ('john@example.com', 'John Smith', '(555) 123-4567', false),
-- ('sarah@example.com', 'Sarah Johnson', '(555) 987-6543', true),
-- ('mike@example.com', 'Mike Williams', '(555) 456-7890', false);

-- INSERT INTO leads (user_id, name, email, phone, source, status)
-- SELECT id, name, email, phone, 'lead_capture', 'new' FROM users;
