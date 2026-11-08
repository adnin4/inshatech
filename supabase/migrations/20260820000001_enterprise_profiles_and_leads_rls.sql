-- IINSHA AI-BOS: Pillar 1 Security & Database RLS Migration
-- Enforces Profile RBAC, Leads Isolation, and Admin Security Boundaries

-- 1. Profiles & Roles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin', 'affiliate', 'owner', 'super_admin')),
  full_name TEXT,
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Security Policies for Profiles
DROP POLICY IF EXISTS "User can view own profile" ON public.profiles;
CREATE POLICY "User can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "User can update own profile" ON public.profiles;
CREATE POLICY "User can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 4. Public Leads Table with RLS
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  requirement TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'contacted', 'converted', 'closed')),
  score INT DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable insert for public" ON public.leads;
CREATE POLICY "Enable insert for public" ON public.leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin only view leads" ON public.leads;
CREATE POLICY "Admin only view leads" ON public.leads FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner', 'super_admin'))
);
