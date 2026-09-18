-- Migration: 20260801000006_ats_analysis.sql
-- Description: Phase 6 - ATS Analysis Database Layer (ATS Analyses, ATS Keywords, AI Recommendations, RLS & Indexes)

-- 1. Create ATS Analyses Table
CREATE TABLE IF NOT EXISTS public.ats_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    job_description_id UUID NOT NULL REFERENCES public.job_descriptions(id) ON DELETE CASCADE,
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    keyword_score INTEGER NOT NULL CHECK (keyword_score >= 0 AND keyword_score <= 100),
    skills_score INTEGER NOT NULL CHECK (skills_score >= 0 AND skills_score <= 100),
    formatting_score INTEGER NOT NULL CHECK (formatting_score >= 0 AND formatting_score <= 100),
    experience_score INTEGER NOT NULL CHECK (experience_score >= 0 AND experience_score <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create ATS Keywords Table
CREATE TABLE IF NOT EXISTS public.ats_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL REFERENCES public.ats_analyses(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL CHECK (length(trim(keyword)) > 0),
    keyword_type TEXT NOT NULL CHECK (keyword_type IN ('matched', 'missing', 'recommended')),
    importance TEXT NOT NULL CHECK (importance IN ('low', 'medium', 'high')),
    is_matched BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create AI Recommendations Table
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL REFERENCES public.ats_analyses(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('keywords', 'skills', 'experience', 'formatting', 'summary')),
    title TEXT NOT NULL CHECK (length(trim(title)) > 0),
    description TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Attach Automated updated_at Trigger for AI Recommendations
DROP TRIGGER IF EXISTS set_ai_recommendations_updated_at ON public.ai_recommendations;
CREATE TRIGGER set_ai_recommendations_updated_at
    BEFORE UPDATE ON public.ai_recommendations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_ats_analyses_user_id ON public.ats_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_ats_analyses_resume_id ON public.ats_analyses(resume_id);
CREATE INDEX IF NOT EXISTS idx_ats_analyses_job_desc ON public.ats_analyses(job_description_id);
CREATE INDEX IF NOT EXISTS idx_ats_analyses_created ON public.ats_analyses(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ats_keywords_analysis_id ON public.ats_keywords(analysis_id);
CREATE INDEX IF NOT EXISTS idx_ats_keywords_type ON public.ats_keywords(analysis_id, keyword_type);

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_analysis_id ON public.ai_recommendations(analysis_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_resolved ON public.ai_recommendations(analysis_id, is_resolved);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.ats_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- 7. Define RLS Policies for ats_analyses
DROP POLICY IF EXISTS "Users can view own ATS analyses" ON public.ats_analyses;
CREATE POLICY "Users can view own ATS analyses"
    ON public.ats_analyses FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own ATS analyses" ON public.ats_analyses;
CREATE POLICY "Users can insert own ATS analyses"
    ON public.ats_analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own ATS analyses" ON public.ats_analyses;
CREATE POLICY "Users can update own ATS analyses"
    ON public.ats_analyses FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own ATS analyses" ON public.ats_analyses;
CREATE POLICY "Users can delete own ATS analyses"
    ON public.ats_analyses FOR DELETE
    USING (auth.uid() = user_id);

-- 8. Define RLS Policies for ats_keywords
DROP POLICY IF EXISTS "Users can view keywords for own analyses" ON public.ats_keywords;
CREATE POLICY "Users can view keywords for own analyses"
    ON public.ats_keywords FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.ats_analyses
            WHERE ats_analyses.id = ats_keywords.analysis_id
              AND ats_analyses.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert keywords for own analyses" ON public.ats_keywords;
CREATE POLICY "Users can insert keywords for own analyses"
    ON public.ats_keywords FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.ats_analyses
            WHERE ats_analyses.id = ats_keywords.analysis_id
              AND ats_analyses.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete keywords for own analyses" ON public.ats_keywords;
CREATE POLICY "Users can delete keywords for own analyses"
    ON public.ats_keywords FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.ats_analyses
            WHERE ats_analyses.id = ats_keywords.analysis_id
              AND ats_analyses.user_id = auth.uid()
        )
    );

-- 9. Define RLS Policies for ai_recommendations
DROP POLICY IF EXISTS "Users can view recommendations for own analyses" ON public.ai_recommendations;
CREATE POLICY "Users can view recommendations for own analyses"
    ON public.ai_recommendations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.ats_analyses
            WHERE ats_analyses.id = ai_recommendations.analysis_id
              AND ats_analyses.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert recommendations for own analyses" ON public.ai_recommendations;
CREATE POLICY "Users can insert recommendations for own analyses"
    ON public.ai_recommendations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.ats_analyses
            WHERE ats_analyses.id = ai_recommendations.analysis_id
              AND ats_analyses.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update recommendations for own analyses" ON public.ai_recommendations;
CREATE POLICY "Users can update recommendations for own analyses"
    ON public.ai_recommendations FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.ats_analyses
            WHERE ats_analyses.id = ai_recommendations.analysis_id
              AND ats_analyses.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.ats_analyses
            WHERE ats_analyses.id = ai_recommendations.analysis_id
              AND ats_analyses.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete recommendations for own analyses" ON public.ai_recommendations;
CREATE POLICY "Users can delete recommendations for own analyses"
    ON public.ai_recommendations FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.ats_analyses
            WHERE ats_analyses.id = ai_recommendations.analysis_id
              AND ats_analyses.user_id = auth.uid()
        )
    );
