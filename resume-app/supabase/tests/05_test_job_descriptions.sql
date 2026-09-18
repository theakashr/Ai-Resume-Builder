-- Test Suite: 05_test_job_descriptions.sql
-- Purpose: Verify public.job_descriptions table, CRUD operations, updated_at automation, and RLS tenant isolation.

BEGIN;

-- 1. Setup Mock Authenticated Users
INSERT INTO auth.users (id, email)
VALUES 
    ('33333333-3333-3333-3333-333333333333', 'job_seeker@example.com'),
    ('44444444-4444-4444-4444-444444444444', 'job_intruder@example.com')
ON CONFLICT (id) DO NOTHING;

-- 2. Authenticate as User 1 (Job Seeker)
SET LOCAL request.jwt.claims = '{"sub": "33333333-3333-3333-3333-333333333333", "role": "authenticated"}';

-- Test 2.1: Create Job Description
INSERT INTO public.job_descriptions (id, user_id, title, company, description, source_url)
VALUES (
    'j1111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'Senior Product Designer',
    'Apex Tech Labs',
    'We are seeking a Staff/Senior Product Designer with experience in design systems, React, and TypeScript...',
    'https://careers.apextech.com/jobs/designer-123'
);

-- Test 2.2: Read Own Job Description
SELECT id, title, company, source_url FROM public.job_descriptions WHERE id = 'j1111111-1111-1111-1111-111111111111';

-- Test 2.3: Update Own Job Description
UPDATE public.job_descriptions
SET title = 'Lead Staff Product Designer',
    company = 'Apex Tech Labs Global'
WHERE id = 'j1111111-1111-1111-1111-111111111111';

-- Verify update succeeded
SELECT title, company, updated_at FROM public.job_descriptions WHERE id = 'j1111111-1111-1111-1111-111111111111';

-- 3. Test RLS Security - Switch Context to User 2 (Intruder)
SET LOCAL request.jwt.claims = '{"sub": "44444444-4444-4444-4444-444444444444", "role": "authenticated"}';

-- Test 3.1: Attempt to Read User 1 Job Description (Must return 0 rows)
SELECT * FROM public.job_descriptions WHERE id = 'j1111111-1111-1111-1111-111111111111';

-- Test 3.2: Attempt to Update User 1 Job Description (Must update 0 rows)
UPDATE public.job_descriptions
SET title = 'Hacked Job Title'
WHERE id = 'j1111111-1111-1111-1111-111111111111';

-- Test 3.3: Attempt to Delete User 1 Job Description (Must delete 0 rows)
DELETE FROM public.job_descriptions WHERE id = 'j1111111-1111-1111-1111-111111111111';

-- 4. Switch Back to User 1 (Owner) and Delete Job Description
SET LOCAL request.jwt.claims = '{"sub": "33333333-3333-3333-3333-333333333333", "role": "authenticated"}';

DELETE FROM public.job_descriptions WHERE id = 'j1111111-1111-1111-1111-111111111111';

-- Verify job description was deleted
SELECT COUNT(*) FROM public.job_descriptions WHERE id = 'j1111111-1111-1111-1111-111111111111';

ROLLBACK;
