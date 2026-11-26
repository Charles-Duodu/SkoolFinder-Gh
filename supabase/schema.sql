-- ==============================================================================
-- SkoolFinder Ghana - Production SaaS Schema for Supabase PostgreSQL
-- Native Supabase Auth (@supabase/ssr, auth.uid(), private.current_user_role())
-- ==============================================================================

CREATE SCHEMA IF NOT EXISTS private;

-- 1. PROFILES (Synced automatically from auth.users via trigger)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  clerk_user_id TEXT UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'parent' CHECK (role IN ('guest', 'parent', 'school_owner', 'professional', 'supplier', 'super_admin')),
  locality TEXT DEFAULT 'East Legon',
  digital_address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles (user_id);

-- 2. SCHOOLS DIRECTORY
CREATE TABLE IF NOT EXISTS public.schools (
  id TEXT PRIMARY KEY,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  clerk_org_id TEXT UNIQUE,
  owner_clerk_id TEXT REFERENCES public.profiles(clerk_user_id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT NOT NULL,
  crest_url TEXT,
  cover_image_url TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  locality TEXT NOT NULL,
  digital_address TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  year_established INTEGER NOT NULL DEFAULT 2015,
  ownership_type TEXT NOT NULL DEFAULT 'Private',
  education_levels TEXT[] NOT NULL DEFAULT '{}',
  curricula TEXT[] NOT NULL DEFAULT '{}',
  boarding_status TEXT NOT NULL DEFAULT 'Day Only',
  gender TEXT NOT NULL DEFAULT 'Co-educational',
  facilities TEXT[] NOT NULL DEFAULT '{}',
  annual_fee_min INTEGER NOT NULL DEFAULT 10000,
  annual_fee_max INTEGER NOT NULL DEFAULT 25000,
  currency TEXT NOT NULL DEFAULT 'GHS',
  student_teacher_ratio TEXT DEFAULT '15:1',
  class_size_avg INTEGER DEFAULT 22,
  about_text TEXT NOT NULL,
  admissions_overview TEXT NOT NULL,
  admissions_deadline DATE,
  contact_person_name TEXT NOT NULL,
  contact_person_role TEXT NOT NULL DEFAULT 'Head of Admissions',
  contact_person_phone TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'under_review' CHECK (verification_status IN ('draft', 'submitted', 'under_review', 'corrections_requested', 'approved', 'rejected')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  plan_tier TEXT NOT NULL DEFAULT 'free_launch' CHECK (plan_tier IN ('free_launch', 'standard', 'pro', 'enterprise')),
  is_claimed BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS schools_owner_user_id_idx ON public.schools (owner_user_id);
CREATE INDEX IF NOT EXISTS schools_locality_idx ON public.schools (locality);
CREATE INDEX IF NOT EXISTS schools_verification_status_idx ON public.schools (verification_status);

-- 3. PARENT WORKSPACE PREFERENCES
CREATE TABLE IF NOT EXISTS public.parent_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_clerk_id TEXT UNIQUE REFERENCES public.profiles(clerk_user_id) ON DELETE CASCADE,
  children JSONB NOT NULL DEFAULT '[]'::jsonb,
  saved_school_ids TEXT[] NOT NULL DEFAULT '{}',
  shortlisted_school_ids TEXT[] NOT NULL DEFAULT '{}',
  comparison_school_ids TEXT[] NOT NULL DEFAULT '{}',
  alert_preferences JSONB NOT NULL DEFAULT '{"admissionsDeadlines": true, "feeChanges": false, "newMatchingSchools": true}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS parent_workspaces_user_id_idx ON public.parent_workspaces (user_id);

-- 4. FORMAL STUDENT ADMISSION APPLICATIONS
CREATE TABLE IF NOT EXISTS public.admission_applications (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  school_locality TEXT NOT NULL,
  parent_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  parent_clerk_id TEXT REFERENCES public.profiles(clerk_user_id) ON DELETE SET NULL,
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT,
  student_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
  target_level TEXT NOT NULL,
  target_term TEXT NOT NULL,
  target_year INTEGER NOT NULL DEFAULT 2026,
  digital_address TEXT NOT NULL,
  previous_school TEXT,
  special_needs TEXT,
  documents_attached TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Under Review', 'Assessment Scheduled', 'Admitted / Offered', 'Enrolled', 'Declined')),
  assessment_date TIMESTAMPTZ,
  school_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admission_applications_school_id_idx ON public.admission_applications (school_id);
CREATE INDEX IF NOT EXISTS admission_applications_parent_user_id_idx ON public.admission_applications (parent_user_id);

-- 5. PARENT-TO-SCHOOL ENQUIRIES
CREATE TABLE IF NOT EXISTS public.parent_enquiries (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  parent_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  parent_clerk_id TEXT REFERENCES public.profiles(clerk_user_id) ON DELETE SET NULL,
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT,
  child_target_level TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Responded', 'Archived')),
  response_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS parent_enquiries_school_id_idx ON public.parent_enquiries (school_id);
CREATE INDEX IF NOT EXISTS parent_enquiries_parent_user_id_idx ON public.parent_enquiries (parent_user_id);

-- 6. PROFESSIONALS, RECRUITMENT, SUPPLIERS, SAFEGUARDING & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.professionals (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  clerk_user_id TEXT REFERENCES public.profiles(clerk_user_id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  title TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'both' CHECK (mode IN ('career', 'services', 'both')),
  locality TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  ntc_license_number TEXT,
  years_experience INTEGER NOT NULL DEFAULT 0,
  highest_qualification TEXT NOT NULL,
  subjects TEXT[] NOT NULL DEFAULT '{}',
  education_levels TEXT[] NOT NULL DEFAULT '{}',
  curricula_expertise TEXT[] NOT NULL DEFAULT '{}',
  service_offerings TEXT[] DEFAULT '{}',
  rate_range TEXT,
  bio TEXT NOT NULL,
  availability TEXT NOT NULL DEFAULT 'Available Immediately',
  cv_file_path TEXT,
  verification_status TEXT NOT NULL DEFAULT 'under_review',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS professionals_user_id_idx ON public.professionals (user_id);

CREATE TABLE IF NOT EXISTS public.job_vacancies (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  school_locality TEXT NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  employment_type TEXT NOT NULL DEFAULT 'Full-time',
  education_level TEXT NOT NULL,
  salary_range_ghs TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL DEFAULT '{}',
  deadline DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Reviewing', 'Closed')),
  applicants_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS job_vacancies_school_id_idx ON public.job_vacancies (school_id);

CREATE TABLE IF NOT EXISTS public.job_applications (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES public.job_vacancies(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  school_id TEXT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  applicant_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  applicant_clerk_id TEXT REFERENCES public.profiles(clerk_user_id) ON DELETE SET NULL,
  applicant_id TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  cover_note TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Shortlisted', 'Interview Scheduled', 'Offer Made', 'Rejected')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS job_applications_job_id_idx ON public.job_applications (job_id);
CREATE INDEX IF NOT EXISTS job_applications_school_id_idx ON public.job_applications (school_id);
CREATE INDEX IF NOT EXISTS job_applications_applicant_user_id_idx ON public.job_applications (applicant_user_id);

CREATE TABLE IF NOT EXISTS public.suppliers (
  id TEXT PRIMARY KEY,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  clerk_org_id TEXT UNIQUE,
  owner_clerk_id TEXT REFERENCES public.profiles(clerk_user_id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  category TEXT NOT NULL,
  additional_categories TEXT[] DEFAULT '{}',
  logo_url TEXT,
  locality TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  description TEXT NOT NULL,
  years_in_operation INTEGER NOT NULL DEFAULT 1,
  service_areas TEXT[] NOT NULL DEFAULT '{}',
  verification_status TEXT NOT NULL DEFAULT 'under_review',
  plan_tier TEXT NOT NULL DEFAULT 'free_launch',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS suppliers_owner_user_id_idx ON public.suppliers (owner_user_id);

CREATE TABLE IF NOT EXISTS public.rfq_tenders (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  school_locality TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  deadline DATE NOT NULL,
  delivery_locality TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Under Review', 'Awarded', 'Closed')),
  bids_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS rfq_tenders_school_id_idx ON public.rfq_tenders (school_id);

CREATE TABLE IF NOT EXISTS public.quotation_bids (
  id TEXT PRIMARY KEY,
  rfq_id TEXT NOT NULL REFERENCES public.rfq_tenders(id) ON DELETE CASCADE,
  rfq_title TEXT NOT NULL,
  school_id TEXT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  supplier_id TEXT NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  supplier_name TEXT NOT NULL,
  supplier_category TEXT NOT NULL,
  total_amount_ghs INTEGER NOT NULL,
  delivery_timeline_days INTEGER NOT NULL,
  warranty_period_months INTEGER NOT NULL DEFAULT 12,
  valid_until DATE NOT NULL,
  proposal_notes TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending Review' CHECK (status IN ('Pending Review', 'Shortlisted', 'Accepted', 'Declined')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quotation_bids_rfq_id_idx ON public.quotation_bids (rfq_id);
CREATE INDEX IF NOT EXISTS quotation_bids_school_id_idx ON public.quotation_bids (school_id);
CREATE INDEX IF NOT EXISTS quotation_bids_supplier_id_idx ON public.quotation_bids (supplier_id);

CREATE TABLE IF NOT EXISTS public.safeguarding_cases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Investigating', 'Action Required', 'Resolved')),
  is_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
  reporter_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  summary TEXT NOT NULL,
  notes TEXT[] NOT NULL DEFAULT '{}',
  reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_clerk_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROLE HELPERS & AUTO-PROFILE TRIGGER (auth.users -> public.profiles)
-- ==============================================================================
CREATE OR REPLACE FUNCTION private.current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT CASE
    WHEN (SELECT auth.uid()) IS NULL THEN 'guest'
    ELSE COALESCE(
      NULLIF((SELECT auth.jwt()) -> 'app_metadata' ->> 'role', ''),
      (SELECT role FROM public.profiles WHERE user_id = (SELECT auth.uid()) LIMIT 1),
      'parent'
    )
  END;
$$;

REVOKE ALL ON FUNCTION private.current_user_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.current_user_role() TO authenticated, anon;

CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  requested_role TEXT;
  safe_role TEXT;
  display_name TEXT;
BEGIN
  requested_role := COALESCE(NEW.raw_user_meta_data ->> 'requested_role', 'parent');
  IF requested_role IN ('parent', 'school_owner', 'professional', 'supplier') THEN
    safe_role := requested_role;
  ELSE
    safe_role := 'parent';
  END IF;

  display_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''),
    split_part(COALESCE(NEW.email, 'User'), '@', 1)
  );

  INSERT INTO public.profiles (id, user_id, clerk_user_id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.id,
    NEW.id::text,
    COALESCE(NEW.email, ''),
    display_name,
    NULLIF(NEW.raw_user_meta_data ->> 'phone', ''),
    safe_role
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

  IF safe_role = 'parent' THEN
    INSERT INTO public.parent_workspaces (user_id, profile_clerk_id)
    VALUES (NEW.id, NEW.id::text)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- ==============================================================================
-- RLS ENABLE & BUCKETS
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safeguarding_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

INSERT INTO storage.buckets (id, name, public)
VALUES ('public-media', 'public-media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('private-vault', 'private-vault', false)
ON CONFLICT (id) DO NOTHING;
