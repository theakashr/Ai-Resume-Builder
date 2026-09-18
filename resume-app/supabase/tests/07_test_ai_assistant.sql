-- Test Suite: 07_test_ai_assistant.sql
-- Purpose: Verify public.ai_resume_suggestions schema, status mutations (accepted/rejected), and RLS security policies.

BEGIN;

-- 1. Setup Mock Authenticated Users
INSERT INTO auth.users (id, email)
VALUES 
    ('77777777-7777-7777-7777-777777777777', 'ai_user@example.com'),
    ('88888888-8888-8888-8888-888888888888', 'ai_intruder@example.com')
ON CONFLICT (id) DO NOTHING;

-- Authenticate as User 1 (ai_user)
SET LOCAL request.jwt.claims = '{"sub": "77777777-7777-7777-7777-777777777777", "role": "authenticated"}';

INSERT INTO public.resumes (id, user_id, title, status)
VALUES ('r7777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'Senior Engineer Resume', 'draft');

INSERT INTO public.resume_sections (id, resume_id, section_type, section_order, content)
VALUES ('s7777777-7777-7777-7777-777777777777', 'r7777777-7777-7777-7777-777777777777', 'experience', 1, '{"text": "Worked on backend APIs"}'::jsonb);

-- 2. Test 1: Create Mock AI Suggestion (Action: rewrite_experience)
INSERT INTO public.ai_resume_suggestions (
    id, user_id, resume_id, resume_section_id,
    action_type, original_content, suggested_content, status
)
VALUES (
    'sug11111-1111-1111-1111-111111111111',
    '77777777-7777-7777-7777-777777777777',
    'r7777777-7777-7777-7777-777777777777',
    's7777777-7777-7777-7777-777777777777',
    'rewrite_experience',
    'Worked on backend APIs',
    'Architected high-throughput REST and GraphQL microservices handling 2.5M requests/day with 99.99% uptime.',
    'generated'
);

-- 3. Test 2: Create Mock AI Suggestion (Action: generate_skills)
INSERT INTO public.ai_resume_suggestions (
    id, user_id, resume_id, resume_section_id,
    action_type, original_content, suggested_content, status
)
VALUES (
    'sug22222-2222-2222-2222-222222222222',
    '77777777-7777-7777-7777-777777777777',
    'r7777777-7777-7777-7777-777777777777',
    NULL,
    'generate_skills',
    NULL,
    'PostgreSQL, Redis, Docker, Kubernetes, AWS Lambda, System Architecture',
    'generated'
);

-- 4. Test 3: Accept Suggestion 1
UPDATE public.ai_resume_suggestions
SET status = 'accepted'
WHERE id = 'sug11111-1111-1111-1111-111111111111';

-- Verify accepted status & updated_at trigger execution
SELECT id, action_type, status, updated_at FROM public.ai_resume_suggestions WHERE id = 'sug11111-1111-1111-1111-111111111111';

-- 5. Test 4: Reject Suggestion 2
UPDATE public.ai_resume_suggestions
SET status = 'rejected'
WHERE id = 'sug22222-2222-2222-2222-222222222222';

-- Verify rejected status
SELECT id, action_type, status FROM public.ai_resume_suggestions WHERE id = 'sug22222-2222-2222-2222-222222222222';

-- 6. Test RLS Security - Switch Context to User 2 (Intruder)
SET LOCAL request.jwt.claims = '{"sub": "88888888-8888-8888-8888-888888888888", "role": "authenticated"}';

-- Test 6.1: Attempt to Read User 1 AI Suggestions (Must return 0 rows)
SELECT * FROM public.ai_resume_suggestions WHERE id = 'sug11111-1111-1111-1111-111111111111';

-- Test 6.2: Attempt to Update User 1 AI Suggestion Status (Must update 0 rows)
UPDATE public.ai_resume_suggestions
SET status = 'accepted'
WHERE id = 'sug22222-2222-2222-2222-222222222222';

ROLLBACK;
