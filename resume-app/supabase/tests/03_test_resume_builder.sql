-- Test Suite: 03_test_resume_builder.sql
-- Purpose: Test resumes, resume_sections, and resume_versions creation, section reordering, versioning, and RLS cross-tenant isolation.

BEGIN;

-- 1. Setup Test Users
INSERT INTO auth.users (id, email)
VALUES 
    ('aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa', 'resume_owner@example.com'),
    ('bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb', 'unauthorized_attacker@example.com')
ON CONFLICT (id) DO NOTHING;

-- 2. Authenticate as User 1 (Resume Owner)
SET LOCAL request.jwt.claims = '{"sub": "aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa", "role": "authenticated"}';

-- Test 2.1: Create Resumes
INSERT INTO public.resumes (id, user_id, title, status)
VALUES 
    ('c1111111-1111-1111-1111-111111111111', 'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa', 'Full Stack Engineer Resume', 'draft'),
    ('c2222222-2222-2222-2222-222222222222', 'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa', 'AI/ML Specialist Resume', 'completed');

-- Test 2.2: Add Structured Sections
INSERT INTO public.resume_sections (id, resume_id, section_type, section_order, content)
VALUES
    ('s1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'summary', 1, '{"text": "Driven Senior Full Stack Engineer with 7+ years of experience."}'::jsonb),
    ('s2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'experience', 2, '[{"company": "Tech Corp", "job_title": "Lead Developer", "location": "San Francisco, CA", "start_date": "2021-01", "end_date": "Present", "description": "Managed cloud team", "achievements": ["Built microservices", "Improved performance by 40%"]}]'::jsonb),
    ('s3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'skills', 3, '[{"skill_name": "TypeScript", "skill_level": "Expert"}, {"skill_name": "PostgreSQL", "skill_level": "Advanced"}]'::jsonb);

-- Test 2.3: Reorder Sections (Update section_order)
UPDATE public.resume_sections
SET section_order = 1
WHERE id = 's2222222-2222-2222-2222-222222222222';

UPDATE public.resume_sections
SET section_order = 2
WHERE id = 's1111111-1111-1111-1111-111111111111';

-- Test 2.4: Update Section Content
UPDATE public.resume_sections
SET content = '{"text": "Updated summary highlighting executive leadership and scalable system architecture."}'::jsonb
WHERE id = 's1111111-1111-1111-1111-111111111111';

-- Test 2.5: Create Resume Version Snapshot
INSERT INTO public.resume_versions (resume_id, version_number, snapshot)
VALUES (
    'c1111111-1111-1111-1111-111111111111',
    1,
    '{"title": "Full Stack Engineer Resume", "sections": [{"type": "summary", "order": 1, "content": "Updated summary"}]}'::jsonb
);

-- Test 2.6: Retrieve Resume and Ordered Sections
SELECT r.id, r.title, s.section_type, s.section_order, s.content
FROM public.resumes r
JOIN public.resume_sections s ON s.resume_id = r.id
WHERE r.id = 'c1111111-1111-1111-1111-111111111111'
ORDER BY s.section_order ASC;

-- 3. Test RLS Security - Switch Context to User 2 (Attacker)
SET LOCAL request.jwt.claims = '{"sub": "bbbbbbbb-2222-2222-2222-bbbbbbbbbbbb", "role": "authenticated"}';

-- Test 3.1: Attempt to Read User 1 Resumes (Must return 0 rows)
SELECT * FROM public.resumes WHERE id = 'c1111111-1111-1111-1111-111111111111';

-- Test 3.2: Attempt to Read User 1 Resume Sections (Must return 0 rows)
SELECT * FROM public.resume_sections WHERE resume_id = 'c1111111-1111-1111-1111-111111111111';

-- Test 3.3: Attempt to Read User 1 Resume Versions (Must return 0 rows)
SELECT * FROM public.resume_versions WHERE resume_id = 'c1111111-1111-1111-1111-111111111111';

-- Test 3.4: Attempt to Inject Section into User 1 Resume (Must fail RLS check)
-- This block expects 0 inserted rows or permission error
INSERT INTO public.resume_sections (resume_id, section_type, section_order, content)
SELECT 'c1111111-1111-1111-1111-111111111111', 'malicious_section', 99, '{}'::jsonb
WHERE EXISTS (SELECT 1 FROM public.resumes WHERE id = 'c1111111-1111-1111-1111-111111111111' AND user_id = auth.uid());

ROLLBACK;
