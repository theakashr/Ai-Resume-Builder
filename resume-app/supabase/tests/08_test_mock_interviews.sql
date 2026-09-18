-- Test Suite: 08_test_mock_interviews.sql
-- Purpose: Verify mock_interviews, interview_questions, and interview_answers table operations, scoring, completion, and RLS security.

BEGIN;

-- 1. Setup Mock Authenticated Users
INSERT INTO auth.users (id, email)
VALUES 
    ('99999999-1111-1111-1111-999999999999', 'interviewee@example.com'),
    ('00000000-2222-2222-2222-000000000000', 'interview_eavesdropper@example.com')
ON CONFLICT (id) DO NOTHING;

-- Authenticate as User 1 (interviewee)
SET LOCAL request.jwt.claims = '{"sub": "99999999-1111-1111-1111-999999999999", "role": "authenticated"}';

-- 2. Test 1: Create Mock Interview Session
INSERT INTO public.mock_interviews (
    id, user_id, target_role, interview_type, difficulty, status, started_at
)
VALUES (
    'm1111111-1111-1111-1111-111111111111',
    '99999999-1111-1111-1111-999999999999',
    'Senior Full Stack Engineer',
    'technical',
    'hard',
    'in_progress',
    NOW()
);

-- 3. Test 2: Add Interview Questions
INSERT INTO public.interview_questions (id, interview_id, question, question_order, category)
VALUES 
    (
        'q1111111-1111-1111-1111-111111111111',
        'm1111111-1111-1111-1111-111111111111',
        'Explain how PostgreSQL handles MVCC and concurrency control under high write load.',
        1,
        'database_architecture'
    ),
    (
        'q2222222-2222-2222-2222-222222222222',
        'm1111111-1111-1111-1111-111111111111',
        'How would you design a real-time notification service scaling to 10M active connections?',
        2,
        'system_design'
    );

-- 4. Test 3: Add Answers with Multi-Dimensional Scores & AI Feedback
INSERT INTO public.interview_answers (
    question_id, answer_text, technical_score, communication_score, confidence_score, relevance_score, overall_score, ai_feedback
)
VALUES 
    (
        'q1111111-1111-1111-1111-111111111111',
        'PostgreSQL MVCC creates tuples for modifications without in-place updates. Read transactions use snapshots to isolate uncommitted rows...',
        92, 88, 90, 95, 91,
        '{"strengths": ["Deep understanding of tuple headers and transaction snapshots"], "improvements": ["Mention autovacuum tuning"]}'::jsonb
    ),
    (
        'q2222222-2222-2222-2222-222222222222',
        'I would use WebSockets backed by Redis Pub/Sub and horizontal connection gateway servers...',
        85, 90, 88, 88, 88,
        '{"strengths": ["Good separation of concerns"], "improvements": ["Detail connection failover handling"]}'::jsonb
    );

-- 5. Test 4: Complete Interview Session
UPDATE public.mock_interviews
SET status = 'completed',
    completed_at = NOW(),
    overall_score = 90
WHERE id = 'm1111111-1111-1111-1111-111111111111';

-- 6. Test 5: Verify Joined Query & Scores Breakdown Retrieval
SELECT 
    i.target_role,
    i.interview_type,
    i.difficulty,
    i.status,
    i.overall_score AS interview_overall_score,
    q.question_order,
    q.question,
    a.technical_score,
    a.communication_score,
    a.confidence_score,
    a.overall_score AS answer_overall_score,
    a.ai_feedback->>'strengths' AS feedback_strengths
FROM public.mock_interviews i
JOIN public.interview_questions q ON q.interview_id = i.id
JOIN public.interview_answers a ON a.question_id = q.id
WHERE i.id = 'm1111111-1111-1111-1111-111111111111'
ORDER BY q.question_order ASC;

-- 7. Test RLS Security - Switch Context to User 2 (Eavesdropper)
SET LOCAL request.jwt.claims = '{"sub": "00000000-2222-2222-2222-000000000000", "role": "authenticated"}';

-- Test 7.1: Attempt to Read User 1 Mock Interview (Must return 0 rows)
SELECT * FROM public.mock_interviews WHERE id = 'm1111111-1111-1111-1111-111111111111';

-- Test 7.2: Attempt to Read User 1 Interview Questions (Must return 0 rows)
SELECT * FROM public.interview_questions WHERE interview_id = 'm1111111-1111-1111-1111-111111111111';

-- Test 7.3: Attempt to Read User 1 Interview Answers (Must return 0 rows)
SELECT * FROM public.interview_answers WHERE question_id = 'q1111111-1111-1111-1111-111111111111';

ROLLBACK;
