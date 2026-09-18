-- Migration: 20260801000003_resume_builder.sql
-- Description: Phase 3 - AI Resume Builder Database Layer (Resumes, Resume Sections, Resume Versions, RLS & Indexes)

-- 1. Create Resumes Table
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    template_id UUID,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'archived')),
    ats_score INTEGER CHECK (ats_score IS NULL OR (ats_score >= 0 AND ats_score <= 100)),
    completion_percentage INTEGER NOT NULL DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Resume Sections Table
CREATE TABLE IF NOT EXISTS public.resume_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    section_type TEXT NOT NULL CHECK (length(trim(section_type)) > 0),
    section_order INTEGER NOT NULL DEFAULT 0,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Resume Versions Table
CREATE TABLE IF NOT EXISTS public.resume_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL CHECK (version_number > 0),
    snapshot JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_resume_version UNIQUE (resume_id, version_number)
);

-- 4. Triggers for updated_at Timestamps
DROP TRIGGER IF EXISTS set_resumes_updated_at ON public.resumes;
CREATE TRIGGER set_resumes_updated_at
    BEFORE UPDATE ON public.resumes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_resume_sections_updated_at ON public.resume_sections;
CREATE TRIGGER set_resume_sections_updated_at
    BEFORE UPDATE ON public.resume_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_status ON public.resumes(status);
CREATE INDEX IF NOT EXISTS idx_resumes_user_created ON public.resumes(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_resume_sections_resume_id ON public.resume_sections(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_sections_order ON public.resume_sections(resume_id, section_order ASC);
CREATE INDEX IF NOT EXISTS idx_resume_sections_content ON public.resume_sections USING gin(content);

CREATE INDEX IF NOT EXISTS idx_resume_versions_resume_id ON public.resume_versions(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_versions_lookup ON public.resume_versions(resume_id, version_number DESC);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for resumes
DROP POLICY IF EXISTS "Users can view own resumes" ON public.resumes;
CREATE POLICY "Users can view own resumes"
    ON public.resumes FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own resumes" ON public.resumes;
CREATE POLICY "Users can insert own resumes"
    ON public.resumes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own resumes" ON public.resumes;
CREATE POLICY "Users can update own resumes"
    ON public.resumes FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own resumes" ON public.resumes;
CREATE POLICY "Users can delete own resumes"
    ON public.resumes FOR DELETE
    USING (auth.uid() = user_id);

-- 8. RLS Policies for resume_sections
DROP POLICY IF EXISTS "Users can view own resume sections" ON public.resume_sections;
CREATE POLICY "Users can view own resume sections"
    ON public.resume_sections FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE resumes.id = resume_sections.resume_id
              AND resumes.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert own resume sections" ON public.resume_sections;
CREATE POLICY "Users can insert own resume sections"
    ON public.resume_sections FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE resumes.id = resume_sections.resume_id
              AND resumes.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update own resume sections" ON public.resume_sections;
CREATE POLICY "Users can update own resume sections"
    ON public.resume_sections FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE resumes.id = resume_sections.resume_id
              AND resumes.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE resumes.id = resume_sections.resume_id
              AND resumes.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete own resume sections" ON public.resume_sections;
CREATE POLICY "Users can delete own resume sections"
    ON public.resume_sections FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE resumes.id = resume_sections.resume_id
              AND resumes.user_id = auth.uid()
        )
    );

-- 9. RLS Policies for resume_versions
DROP POLICY IF EXISTS "Users can view own resume versions" ON public.resume_versions;
CREATE POLICY "Users can view own resume versions"
    ON public.resume_versions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE resumes.id = resume_versions.resume_id
              AND resumes.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert own resume versions" ON public.resume_versions;
CREATE POLICY "Users can insert own resume versions"
    ON public.resume_versions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE resumes.id = resume_versions.resume_id
              AND resumes.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete own resume versions" ON public.resume_versions;
CREATE POLICY "Users can delete own resume versions"
    ON public.resume_versions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.resumes
            WHERE resumes.id = resume_versions.resume_id
              AND resumes.user_id = auth.uid()
        )
    );
