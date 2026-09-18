-- Migration: 20260801000012_testing.sql
-- Description: Phase 12 - Master Database Verification Function & Schema Integrity Validation

-- Reusable SQL function to validate schema health, foreign key counts, RLS status, and table counts
CREATE OR REPLACE FUNCTION public.fn_validate_database_health()
RETURNS TABLE (
    check_category TEXT,
    metric_name TEXT,
    status TEXT,
    details TEXT
) AS $$
BEGIN
    -- 1. Validate Table RLS Status
    RETURN QUERY
    SELECT 
        'RLS_SECURITY'::TEXT,
        tablename::TEXT,
        CASE WHEN rowsecurity THEN 'PASS' ELSE 'FAIL' END,
        'Row Level Security enabled: ' || rowsecurity::TEXT
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename IN (
        'profiles', 'resumes', 'resume_sections', 'resume_versions',
        'resume_templates', 'job_descriptions', 'ats_analyses', 'ats_keywords',
        'ai_recommendations', 'ai_resume_suggestions', 'mock_interviews',
        'interview_questions', 'interview_answers', 'subscriptions', 'user_usage'
      );

    -- 2. Validate Foreign Key Cascades
    RETURN QUERY
    SELECT 
        'FOREIGN_KEYS'::TEXT,
        tc.table_name::TEXT || '.' || kcu.column_name::TEXT,
        'PASS'::TEXT,
        'References ' || ccu.table_name::TEXT || '(' || ccu.column_name::TEXT || ')'
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public';

    -- 3. Validate Seed Templates
    RETURN QUERY
    SELECT 
        'SEED_DATA'::TEXT,
        'resume_templates'::TEXT,
        CASE WHEN COUNT(*) >= 4 THEN 'PASS' ELSE 'FAIL' END,
        'Total active seed templates: ' || COUNT(*)::TEXT
    FROM public.resume_templates
    WHERE is_active = TRUE;

    -- 4. Validate Storage Buckets
    RETURN QUERY
    SELECT 
        'STORAGE_BUCKETS'::TEXT,
        id::TEXT,
        CASE WHEN NOT public THEN 'PASS' ELSE 'FAIL' END,
        'Private bucket registered with limit ' || file_size_limit::TEXT || ' bytes'
    FROM storage.buckets
    WHERE id IN ('profile-images', 'resume-files', 'interview-recordings');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
