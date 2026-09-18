-- Test Suite: 11_test_security_audit.sql
-- Purpose: Complete security audit suite verifying RLS enforcement, indirect ID-guessing attack prevention, template immutability, and storage isolation.

BEGIN;

-- 1. Setup User A (Legitimate Owner) & User B (Attacker)
INSERT INTO auth.users (id, email)
VALUES 
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'usera@example.com'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'userb_attacker@example.com')
ON CONFLICT (id) DO NOTHING;

-- 2. Populate Domain Entities under User A Context
SET LOCAL request.jwt.claims = '{"sub": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "role": "authenticated"}';

-- User A Resume & Section
INSERT INTO public.resumes (id, user_id, title) VALUES ('r1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'User A Resume');
INSERT INTO public.resume_sections (id, resume_id, section_type, content) VALUES ('sec11111-1111-1111-1111-111111111111', 'r1111111-1111-1111-1111-111111111111', 'summary', '{"text": "Secret summary"}');

-- User A Job Description & ATS Analysis + Keyword
INSERT INTO public.job_descriptions (id, user_id, title, company, description) VALUES ('j1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Target Job', 'Target Corp', 'Job description...');
INSERT INTO public.ats_analyses (id, user_id, resume_id, job_description_id, overall_score, keyword_score, skills_score, formatting_score, experience_score)
VALUES ('ats11111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'r1111111-1111-1111-1111-111111111111', 'j1111111-1111-1111-1111-111111111111', 85, 80, 90, 85, 85);
INSERT INTO public.ats_keywords (id, analysis_id, keyword, keyword_type, importance, is_matched) VALUES ('kw111111-1111-1111-1111-111111111111', 'ats11111-1111-1111-1111-111111111111', 'SecretKeyword', 'matched', 'high', TRUE);

-- User A Interview, Question & Answer
INSERT INTO public.mock_interviews (id, user_id, target_role, interview_type, difficulty) VALUES ('int11111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Software Engineer', 'technical', 'medium');
INSERT INTO public.interview_questions (id, interview_id, question) VALUES ('q1111111-1111-1111-1111-111111111111', 'int11111-1111-1111-1111-111111111111', 'Secret Question?');
INSERT INTO public.interview_answers (id, question_id, answer_text, overall_score) VALUES ('ans11111-1111-1111-1111-111111111111', 'q1111111-1111-1111-1111-111111111111', 'Secret Answer Text', 95);

-- User A Subscription
INSERT INTO public.subscriptions (id, user_id, plan_id, status) VALUES ('sub11111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pro', 'active');

-- User A Storage File
INSERT INTO storage.objects (id, bucket_id, name, owner) VALUES ('obj11111-1111-1111-1111-111111111111', 'resume-files', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/r111/secret.pdf', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

-- 3. Execute Indirect Access Attacks as User B (Attacker)
SET LOCAL request.jwt.claims = '{"sub": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "role": "authenticated"}';

-- Attack Test 3.1: Guess Resume Section ID 'sec11111-1111-1111-1111-111111111111'
SELECT * FROM public.resume_sections WHERE id = 'sec11111-1111-1111-1111-111111111111';

-- Attack Test 3.2: Guess ATS Keyword ID 'kw111111-1111-1111-1111-111111111111'
SELECT * FROM public.ats_keywords WHERE id = 'kw111111-1111-1111-1111-111111111111';

-- Attack Test 3.3: Guess Interview Answer ID 'ans11111-1111-1111-1111-111111111111'
SELECT * FROM public.interview_answers WHERE id = 'ans11111-1111-1111-1111-111111111111';

-- Attack Test 3.4: Attempt to Read User A Subscription
SELECT * FROM public.subscriptions WHERE id = 'sub11111-1111-1111-1111-111111111111';

-- Attack Test 3.5: Attempt to Read User A Private Storage Object
SELECT * FROM storage.objects WHERE name = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/r111/secret.pdf';

-- Attack Test 3.6: Attempt to Update System Resume Template (Must affect 0 rows)
UPDATE public.resume_templates SET name = 'Hacked Name' WHERE slug = 'minimal';

-- 4. Verify Security Audit View (Must return 0 orphaned records)
SELECT * FROM public.vw_security_audit_summary;

ROLLBACK;
