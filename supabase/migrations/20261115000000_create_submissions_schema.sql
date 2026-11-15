-- Moon Sanctum Labs: Submissions Schema & Access Hardening
-- Phase 2 Database Implementation

-- ============================================================================
-- 1. TABLES & CONSTRAINTS
-- ============================================================================

-- Table 1: Contact Submissions
CREATE TABLE public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (length(trim(name)) >= 2 AND length(name) <= 100),
    email TEXT NOT NULL CHECK (length(trim(email)) >= 5 AND length(email) <= 255),
    service TEXT CHECK (service IS NULL OR length(service) <= 100),
    message TEXT NOT NULL CHECK (length(trim(message)) >= 10 AND length(message) <= 3000),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'contacted', 'closed', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_submissions_created_at 
    ON public.contact_submissions (created_at DESC);

CREATE INDEX idx_contact_submissions_status 
    ON public.contact_submissions (status);

-- Table 2: Website Review Submissions
CREATE TABLE public.review_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (length(trim(name)) >= 2 AND length(name) <= 100),
    email TEXT NOT NULL CHECK (length(trim(email)) >= 5 AND length(email) <= 255),
    has_website BOOLEAN NOT NULL DEFAULT true,
    website TEXT CHECK (website IS NULL OR length(website) <= 300),
    goal TEXT CHECK (goal IS NULL OR length(goal) <= 100),
    budget TEXT CHECK (budget IS NULL OR length(budget) <= 50),
    message TEXT CHECK (message IS NULL OR length(message) <= 2000),
    tracking JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (pg_column_size(tracking) <= 2048),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'contacted', 'completed', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_review_submissions_created_at 
    ON public.review_submissions (created_at DESC);

CREATE INDEX idx_review_submissions_status 
    ON public.review_submissions (status);

-- ============================================================================
-- 2. PERMISSIONS & ROLE GRANTS (TWO-LAYER DEFENSE)
-- ============================================================================

-- Layer A: PostgreSQL Table & Schema Permissions
-- Explicitly revoke all privileges from PUBLIC (pseudo-role), anon, and authenticated
REVOKE ALL ON TABLE public.contact_submissions FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.review_submissions FROM PUBLIC, anon, authenticated;

-- Ensure service_role has necessary schema usage and table DML privileges
GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.contact_submissions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.review_submissions TO service_role;

-- Revoke default privileges for future objects created by postgres role
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
    REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;

-- Layer B: Row Level Security (RLS)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_submissions ENABLE ROW LEVEL SECURITY;
