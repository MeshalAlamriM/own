-- 1. Create the jobs table in Supabase
CREATE TABLE IF NOT EXISTS public.jobs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_logo TEXT,
  sector TEXT NOT NULL,
  sector_label TEXT NOT NULL,
  gender TEXT NOT NULL,
  gender_label TEXT NOT NULL,
  qualifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  publish_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  experience TEXT NOT NULL,
  salary TEXT,
  summary TEXT,
  description TEXT,
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  application_url TEXT NOT NULL,
  source_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  urgent BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 1,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- 3. Allow public read access to all visitors
CREATE POLICY "Public jobs are viewable by everyone" 
ON public.jobs FOR SELECT 
USING (true);

-- 4. Allow insert, update, and delete access
CREATE POLICY "Enable insert for all" 
ON public.jobs FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for all" 
ON public.jobs FOR UPDATE 
USING (true);

CREATE POLICY "Enable delete for all" 
ON public.jobs FOR DELETE 
USING (true);
