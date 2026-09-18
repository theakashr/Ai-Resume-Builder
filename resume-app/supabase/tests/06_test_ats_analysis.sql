-- Test Suite: 06_test_ats_analysis.sql
-- Purpose: Verify public.ats_analyses, ats_keywords, ai_recommendations schemas, relationships, recommendation resolution, and RLS security.

BEGIN;

-- 1. Setup Mock User, Resume, and Job Description
INSERT INTO auth.users (id, email)
VALUES 
    ('55555555-5555-5555-5555-555555555555', 'ats_user@example.com'),
    ('66666666-6666-6666-6666-666666666666', 'ats_intruder@example.com')
ON CONFLICT (id) DO NOTHING;

-- Authenticate as User 1 (ats_user)
SET LOCAL request.jwt.claims = '{"sub": "55555555-5555-5555-5555-555555555555", "role": "authenticated"}';

INSERT INTO public.resumes (id, user_id, title, status)
VALUES ('r6666666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555', 'Lead Architect Resume', 'completed');

INSERT INTO public.job_descriptions (id, user_id, title, company, description)
VALUES ('j6666666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555', 'Principal Software Engineer', 'Cloud Scale Inc', 'Requires TypeScript, GraphQL, Kubernetes, Microservices...');

-- 2. Test 1: Create Mock ATS Analysis Record
INSERT INTO public.ats_analyses (
    id, user_id, resume_id, job_description_id,
    overall_score, keyword_score, skills_score, formatting_score, experience_score
)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    '55555555-5555-5555-5555-555555555555',
    'r6666666-6666-6666-6666-666666666666',
    'j6666666-6666-6666-6666-666666666666',
    88, 92, 85, 94, 82
);

-- 3. Test 2: Add Matched & Missing Keywords
INSERT INTO public.ats_keywords (analysis_id, keyword, keyword_type, importance, is_matched)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', 'React', 'matched', 'high', TRUE),
    ('a1111111-1111-1111-1111-111111111111', 'TypeScript', 'matched', 'high', TRUE),
    ('a1111111-1111-1111-1111-111111111111', 'GraphQL', 'missing', 'high', FALSE),
    ('a1111111-1111-1111-1111-111111111111', 'Kubernetes', 'missing', 'medium', FALSE),
    ('a1111111-1111-1111-1111-111111111111', 'CI/CD Pipeline', 'recommended', 'low', FALSE);

-- 4. Test 3: Add AI Recommendations
INSERT INTO public.ai_recommendations (id, analysis_id, category, title, description, priority)
VALUES 
    ('rec11111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'keywords', 'Add GraphQL Experience', 'Add GraphQL API development to your technical skills section.', 'high'),
    ('rec22222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'experience', 'Quantify Impact in Recent Role', 'Add ARR metrics to your Lead Developer achievements bullet points.', 'high');

-- 5. Test 4: Mark Recommendation as Resolved
UPDATE public.ai_recommendations
SET is_resolved = TRUE
WHERE id = 'rec11111-1111-1111-1111-111111111111';

-- Verify resolution
SELECT id, title, is_resolved, updated_at FROM public.ai_recommendations WHERE id = 'rec11111-1111-1111-1111-111111111111';

-- 6. Test 5: Verify Relationship & Joined Query Retrieval
SELECT 
    a.overall_score,
    a.keyword_score,
    r.title AS resume_title,
    j.company AS job_company,
    COUNT(k.id) FILTER (WHERE k.is_matched = TRUE) AS matched_keyword_count,
    COUNT(k.id) FILTER (WHERE k.is_matched = FALSE) AS missing_keyword_count,
    COUNT(rec.id) FILTER (WHERE rec.is_resolved = TRUE) AS resolved_recommendations_count
FROM public.ats_analyses a
JOIN public.resumes r ON r.id = a.resume_id
JOIN public.job_descriptions j ON j.id = a.job_description_id
LEFT JOIN public.ats_keywords k ON k.analysis_id = a.id
LEFT JOIN public.ai_recommendations rec ON rec.analysis_id = a.id
WHERE a.id = 'a1111111-1111-1111-1111-111111111111'
GROUP BY a.id, a.overall_score, a.keyword_score, r.title, j.company;

-- 7. Test RLS Security - Switch Context to User 2 (Intruder)
SET LOCAL request.jwt.claims = '{"sub": "66666666-6666-6666-6666-666666666666", "role": "authenticated"}';

-- Test 7.1: Attempt to Read User 1 ATS Analyses (Must return 0 rows)
SELECT * FROM public.ats_analyses WHERE id = 'a1111111-1111-1111-1111-111111111111';

-- Test 7.2: Attempt to Read User 1 ATS Keywords (Must return 0 rows)
SELECT * FROM public.ats_keywords WHERE analysis_id = 'a1111111-1111-1111-1111-111111111111';

-- Test 7.3: Attempt to Read User 1 AI Recommendations (Must return 0 rows)
SELECT * FROM public.ai_recommendations WHERE analysis_id = 'a1111111-1111-1111-1111-111111111111';

ROLLBACK;
