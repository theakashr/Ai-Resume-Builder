-- Migration: 20260801000011_security_hardening.sql
-- Description: Phase 11 - Global Security Hardening, Complete RLS Policy Audit & Comprehensive Cross-Tenant Protection

-- 1. Ensure Row Level Security (RLS) is Enabled on ALL Public Domain Tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_resume_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- 2. Revoke Dangerous Default Public Grants
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM public;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON public.resume_templates TO anon;

-- 3. Hardened RLS Policies for ats_keywords (Include UPDATE policy)
DROP POLICY IF EXISTS "Users can update keywords for own analyses" ON public.ats_keywords;
CREATE POLICY "Users can update keywords for own analyses"
    ON public.ats_keywords FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.ats_analyses
            WHERE ats_analyses.id = ats_keywords.analysis_id
              AND ats_analyses.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.ats_analyses
            WHERE ats_analyses.id = ats_keywords.analysis_id
              AND ats_analyses.user_id = auth.uid()
        )
    );

-- 4. Hardened RLS Policies for interview_questions (Include UPDATE policy)
DROP POLICY IF EXISTS "Users can update questions for own interviews" ON public.interview_questions;
CREATE POLICY "Users can update questions for own interviews"
    ON public.interview_questions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.mock_interviews
            WHERE mock_interviews.id = interview_questions.interview_id
              AND mock_interviews.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.mock_interviews
            WHERE mock_interviews.id = interview_questions.interview_id
              AND mock_interviews.user_id = auth.uid()
        )
    );

-- 5. Foreign Key Integrity Audit View (Detects orphaned records if cascades ever bypassed)
CREATE OR REPLACE VIEW public.vw_security_audit_summary AS
SELECT 
    'profiles' AS table_name, COUNT(*) AS orphaned_count FROM public.profiles p WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p.user_id)
UNION ALL
SELECT 
    'resumes', COUNT(*) FROM public.resumes r WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = r.user_id)
UNION ALL
SELECT 
    'resume_sections', COUNT(*) FROM public.resume_sections s WHERE NOT EXISTS (SELECT 1 FROM public.resumes r WHERE r.id = s.resume_id)
UNION ALL
SELECT 
    'ats_analyses', COUNT(*) FROM public.ats_analyses a WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = a.user_id)
UNION ALL
SELECT 
    'mock_interviews', COUNT(*) FROM public.mock_interviews m WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = m.user_id);
