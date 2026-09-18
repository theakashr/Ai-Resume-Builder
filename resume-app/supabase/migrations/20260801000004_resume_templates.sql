-- Migration: 20260801000004_resume_templates.sql
-- Description: Phase 4 - Resume Templates Catalog, FK Constraints, Seed Data & RLS Policies

-- 1. Create Resume Templates Table
CREATE TABLE IF NOT EXISTS public.resume_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL CHECK (length(trim(slug)) > 0),
    description TEXT,
    preview_image_url TEXT NOT NULL,
    template_type TEXT NOT NULL CHECK (template_type IN ('minimal', 'modern', 'professional', 'ats_friendly')),
    is_ats_friendly BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Attach Automated updated_at Trigger
DROP TRIGGER IF EXISTS set_resume_templates_updated_at ON public.resume_templates;
CREATE TRIGGER set_resume_templates_updated_at
    BEFORE UPDATE ON public.resume_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 3. Add Foreign Key Relationship from resumes to resume_templates
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_resumes_template_id'
    ) THEN
        ALTER TABLE public.resumes
        ADD CONSTRAINT fk_resumes_template_id
        FOREIGN KEY (template_id) REFERENCES public.resume_templates(id)
        ON DELETE SET NULL;
    END IF;
END $$;

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS idx_resume_templates_slug ON public.resume_templates(slug);
CREATE INDEX IF NOT EXISTS idx_resume_templates_type ON public.resume_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_resume_templates_active ON public.resume_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_resumes_template_id ON public.resumes(template_id);

-- 5. Seed Initial Template Records
INSERT INTO public.resume_templates (id, name, slug, description, preview_image_url, template_type, is_ats_friendly, is_active)
VALUES
    (
        '10000000-0000-0000-0000-000000000001',
        'Minimal Clean',
        'minimal',
        'Sleek, minimalist design focusing on clarity, whitespace, and essential experience details.',
        '/templates/minimal.png',
        'minimal',
        TRUE,
        TRUE
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        'Modern Tech',
        'modern',
        'Dynamic modern layout with subtle accents ideal for tech professionals and product leaders.',
        '/templates/modern.png',
        'modern',
        FALSE,
        TRUE
    ),
    (
        '10000000-0000-0000-0000-000000000003',
        'Corporate Professional',
        'professional',
        'Classic, high-impact structure tailored for executive, legal, and financial roles.',
        '/templates/professional.png',
        'professional',
        TRUE,
        TRUE
    ),
    (
        '10000000-0000-0000-0000-000000000004',
        'ATS Optimizer Prime',
        'ats-friendly',
        'Strict single-column text format optimized 100% for ATS parsing software and keyword matching.',
        '/templates/ats-friendly.png',
        'ats_friendly',
        TRUE,
        TRUE
    )
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    preview_image_url = EXCLUDED.preview_image_url,
    template_type = EXCLUDED.template_type,
    is_ats_friendly = EXCLUDED.is_ats_friendly,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.resume_templates ENABLE ROW LEVEL SECURITY;

-- 7. Define RLS Policies
-- Allow all authenticated and anonymous users to view active templates
DROP POLICY IF EXISTS "Anyone can view active resume templates" ON public.resume_templates;
CREATE POLICY "Anyone can view active resume templates"
    ON public.resume_templates
    FOR SELECT
    USING (is_active = TRUE);

-- Modifications (INSERT, UPDATE, DELETE) are restricted (no policy created for standard users)
