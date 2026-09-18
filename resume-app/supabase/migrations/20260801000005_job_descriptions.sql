-- Migration: 20260801000005_job_descriptions.sql
-- Description: Phase 5 - Job Description Database Layer (Job Descriptions table, Indexes, Triggers, and RLS)

-- 1. Create Job Descriptions Table
CREATE TABLE IF NOT EXISTS public.job_descriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL CHECK (length(trim(title)) > 0),
    company TEXT NOT NULL CHECK (length(trim(company)) > 0),
    description TEXT NOT NULL CHECK (length(trim(description)) > 0),
    source_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Attach Automated updated_at Trigger
DROP TRIGGER IF EXISTS set_job_descriptions_updated_at ON public.job_descriptions;
CREATE TRIGGER set_job_descriptions_updated_at
    BEFORE UPDATE ON public.job_descriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 3. Create Indexes for Query & FK Performance
CREATE INDEX IF NOT EXISTS idx_job_descriptions_user_id ON public.job_descriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_job_descriptions_user_created ON public.job_descriptions(user_id, created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.job_descriptions ENABLE ROW LEVEL SECURITY;

-- 5. Define Secure RLS Policies
DROP POLICY IF EXISTS "Users can view own job descriptions" ON public.job_descriptions;
CREATE POLICY "Users can view own job descriptions"
    ON public.job_descriptions
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own job descriptions" ON public.job_descriptions;
CREATE POLICY "Users can insert own job descriptions"
    ON public.job_descriptions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own job descriptions" ON public.job_descriptions;
CREATE POLICY "Users can update own job descriptions"
    ON public.job_descriptions
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own job descriptions" ON public.job_descriptions;
CREATE POLICY "Users can delete own job descriptions"
    ON public.job_descriptions
    FOR DELETE
    USING (auth.uid() = user_id);
