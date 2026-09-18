-- Migration: 20260801000007_ai_assistant.sql
-- Description: Phase 7 - AI Resume Assistant Activity Database Layer (AI Suggestions, Action Types, Status Tracking, RLS & Indexes)

-- 1. Create AI Resume Suggestions Table
CREATE TABLE IF NOT EXISTS public.ai_resume_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    resume_section_id UUID REFERENCES public.resume_sections(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL CHECK (action_type IN ('improve_summary', 'rewrite_experience', 'improve_project', 'generate_skills', 'improve_achievement')),
    original_content TEXT,
    suggested_content TEXT NOT NULL CHECK (length(trim(suggested_content)) > 0),
    status TEXT NOT NULL DEFAULT 'generated' CHECK (status IN ('generated', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Attach Automated updated_at Trigger
DROP TRIGGER IF EXISTS set_ai_resume_suggestions_updated_at ON public.ai_resume_suggestions;
CREATE TRIGGER set_ai_resume_suggestions_updated_at
    BEFORE UPDATE ON public.ai_resume_suggestions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 3. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_user_id ON public.ai_resume_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_resume_id ON public.ai_resume_suggestions(resume_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_section_id ON public.ai_resume_suggestions(resume_section_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_status ON public.ai_resume_suggestions(user_id, status);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.ai_resume_suggestions ENABLE ROW LEVEL SECURITY;

-- 5. Define Secure RLS Policies
DROP POLICY IF EXISTS "Users can view own AI suggestions" ON public.ai_resume_suggestions;
CREATE POLICY "Users can view own AI suggestions"
    ON public.ai_resume_suggestions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own AI suggestions" ON public.ai_resume_suggestions;
CREATE POLICY "Users can insert own AI suggestions"
    ON public.ai_resume_suggestions FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.resumes
            WHERE resumes.id = ai_resume_suggestions.resume_id
              AND resumes.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update own AI suggestions" ON public.ai_resume_suggestions;
CREATE POLICY "Users can update own AI suggestions"
    ON public.ai_resume_suggestions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own AI suggestions" ON public.ai_resume_suggestions;
CREATE POLICY "Users can delete own AI suggestions"
    ON public.ai_resume_suggestions FOR DELETE
    USING (auth.uid() = user_id);
