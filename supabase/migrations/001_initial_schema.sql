-- InspectIQ Database Schema

-- Companies
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  plan TEXT NOT NULL DEFAULT 'solo' CHECK (plan IN ('solo', 'team', 'company', 'enterprise')),
  state TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  abn TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  licence_number TEXT,
  state TEXT NOT NULL,
  company_id UUID REFERENCES companies(id),
  role TEXT NOT NULL DEFAULT 'inspector' CHECK (role IN ('company_admin', 'inspector', 'subcontractor', 'office_staff')),
  phone TEXT,
  signature_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) NOT NULL,
  inspector_id UUID REFERENCES users(id) NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  property_address TEXT NOT NULL,
  inspection_type TEXT NOT NULL CHECK (inspection_type IN ('pre_purchase_standard', 'building_only', 'pest_only', 'stage', 'dilapidation')),
  scheduled_date TIMESTAMPTZ NOT NULL,
  fee DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'in_progress', 'report_draft', 'awaiting_payment', 'completed', 'cancelled')),
  notes TEXT,
  agreement_signed_at TIMESTAMPTZ,
  agreement_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'final', 'delivered')),
  data JSONB NOT NULL DEFAULT '{}',
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photos
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  location_tag TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  gps_lat DECIMAL(10,8),
  gps_lng DECIMAL(11,8),
  ai_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  gst_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'paid', 'overdue', 'cancelled')),
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  paid_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  line_items JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client Agreements
CREATE TABLE agreements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  template_id UUID,
  content TEXT NOT NULL,
  signed_at TIMESTAMPTZ,
  signature_data TEXT,
  client_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agreement Templates
CREATE TABLE agreement_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) NOT NULL,
  name TEXT NOT NULL,
  inspection_type TEXT,
  content TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can see their company data)
CREATE POLICY "Users can view own company data" ON companies
  FOR SELECT USING (id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view own profile" ON users
  FOR ALL USING (id = auth.uid());

CREATE POLICY "Users can view company users" ON users
  FOR SELECT USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can manage own company jobs" ON jobs
  FOR ALL USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can manage reports for their jobs" ON reports
  FOR ALL USING (job_id IN (SELECT id FROM jobs WHERE company_id IN (SELECT company_id FROM users WHERE id = auth.uid())));

CREATE POLICY "Users can manage photos for their reports" ON photos
  FOR ALL USING (report_id IN (SELECT id FROM reports WHERE job_id IN (SELECT id FROM jobs WHERE company_id IN (SELECT company_id FROM users WHERE id = auth.uid()))));
