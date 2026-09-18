-- Test Suite: 12_test_end_to_end_journey.sql
-- Purpose: Complete End-to-End User Journey Simulation, Relationship Verification, Cascade Tests, and RLS Audit.

BEGIN;

-- ============================================================================
-- STEP 1: USER REGISTRATION
-- ============================================================================
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES (
    'e2e00000-0000-0000-0000-000000000001',
    'alex.morgan@resumeai.app',
    '{"full_name": "Alex Morgan", "avatar_url": "https://avatar.url/alex.png"}'::jsonb
);

-- ============================================================================
-- STEP 2: VERIFY AUTOMATIC PROFILE CREATION & UPDATE PROFILE
-- ============================================================================
SELECT user_id, email, full_name, profile_image_url FROM public.profiles WHERE user_id = 'e2e00000-0000-0000-0000-000000000001';

SET LOCAL request.jwt.claims = '{"sub": "e2e00000-0000-0000-0000-000000000001", "role": "authenticated"}';

UPDATE public.profiles
SET professional_title = 'Staff Product Designer & Systems Architect',
    target_role = 'Lead Design Systems Engineer',
    experience_level = 'senior_level',
    phone = '+1 (555) 234-5678',
    location = 'San Francisco, CA',
    bio = 'Product designer & frontend engineer with 7+ years building enterprise platforms.'
WHERE user_id = 'e2e00000-0000-0000-0000-000000000001';

-- ============================================================================
-- STEP 3: CREATE RESUME & ASSOCIATE TEMPLATE
-- ============================================================================
-- Fetch Template ID for 'ats-friendly'
INSERT INTO public.resumes (id, user_id, title, template_id, status, completion_percentage)
VALUES (
    'e2e11111-1111-1111-1111-111111111111',
    'e2e00000-0000-0000-0000-000000000001',
    'Alex_Morgan_Senior_Product_Designer',
    '10000000-0000-0000-0000-000000000004', -- ATS Optimizer Prime
    'draft',
    82
);

-- ============================================================================
-- STEP 4: ADD RESUME SECTIONS
-- ============================================================================
INSERT INTO public.resume_sections (id, resume_id, section_type, section_order, content)
VALUES
    (
        'sec-summary-001',
        'e2e11111-1111-1111-1111-111111111111',
        'summary',
        1,
        '{"text": "Product designer & frontend engineer specialized in design systems, UX conversion optimization, and modern React applications."}'::jsonb
    ),
    (
        'sec-exp-001',
        'e2e11111-1111-1111-1111-111111111111',
        'experience',
        2,
        '[{"company": "Apex Tech Labs", "job_title": "Lead Staff Designer", "location": "San Francisco, CA", "start_date": "2022-01", "end_date": "Present", "is_current": true, "description": "Engineered AI-driven candidate workflow engine generating $2.4M ARR upgrades.", "achievements": ["Built company design system", "Architected workflow engine"]}]'::jsonb
    ),
    (
        'sec-skills-001',
        'e2e11111-1111-1111-1111-111111111111',
        'skills',
        3,
        '[{"skill_name": "Design Systems", "skill_level": "Expert"}, {"skill_name": "React / Next.js", "skill_level": "Expert"}, {"skill_name": "TypeScript", "skill_level": "Advanced"}]'::jsonb
    );

-- ============================================================================
-- STEP 5: SAVE RESUME VERSION SNAPSHOT
-- ============================================================================
INSERT INTO public.resume_versions (resume_id, version_number, snapshot)
VALUES (
    'e2e11111-1111-1111-1111-111111111111',
    1,
    '{"title": "Alex_Morgan_Senior_Product_Designer", "version": 1, "sections_count": 3}'::jsonb
);

-- ============================================================================
-- STEP 6: CREATE JOB DESCRIPTION
-- ============================================================================
INSERT INTO public.job_descriptions (id, user_id, title, company, description, source_url)
VALUES (
    'e2e22222-2222-2222-2222-222222222222',
    'e2e00000-0000-0000-0000-000000000001',
    'Senior Product Designer',
    'Workday Labs',
    'Seeking Senior Product Designer with experience in Design Systems, GraphQL, CI/CD Pipelines, Kubernetes, and OKRs.',
    'https://workday.com/careers/designer'
);

-- ============================================================================
-- STEP 7: RUN MOCK ATS ANALYSIS, KEYWORDS & RECOMMENDATIONS
-- ============================================================================
INSERT INTO public.ats_analyses (
    id, user_id, resume_id, job_description_id,
    overall_score, keyword_score, skills_score, formatting_score, experience_score
)
VALUES (
    'e2e33333-3333-3333-3333-333333333333',
    'e2e00000-0000-0000-0000-000000000001',
    'e2e11111-1111-1111-1111-111111111111',
    'e2e22222-2222-2222-2222-222222222222',
    92, 88, 90, 94, 96
);

-- Store Keywords
INSERT INTO public.ats_keywords (analysis_id, keyword, keyword_type, importance, is_matched)
VALUES 
    ('e2e33333-3333-3333-3333-333333333333', 'React', 'matched', 'high', TRUE),
    ('e2e33333-3333-3333-3333-333333333333', 'TypeScript', 'matched', 'high', TRUE),
    ('e2e33333-3333-3333-3333-333333333333', 'Design Systems', 'matched', 'high', TRUE),
    ('e2e33333-3333-3333-3333-333333333333', 'GraphQL', 'missing', 'high', FALSE),
    ('e2e33333-3333-3333-3333-333333333333', 'CI/CD Pipeline', 'missing', 'medium', FALSE),
    ('e2e33333-3333-3333-3333-333333333333', 'Kubernetes', 'missing', 'low', FALSE);

-- Store Recommendations
INSERT INTO public.ai_recommendations (id, analysis_id, category, title, description, priority)
VALUES (
    'rec-e2e-001',
    'e2e33333-3333-3333-3333-333333333333',
    'keywords',
    'Add Missing Technical Keywords',
    'Incorporate GraphQL and CI/CD Pipeline experience to boost ATS parse score to 96%.',
    'high'
);

-- Update ATS score on resume
UPDATE public.resumes SET ats_score = 92 WHERE id = 'e2e11111-1111-1111-1111-111111111111';

-- ============================================================================
-- STEP 8: CREATE & ACCEPT AI RESUME SUGGESTION
-- ============================================================================
INSERT INTO public.ai_resume_suggestions (
    id, user_id, resume_id, resume_section_id,
    action_type, original_content, suggested_content, status
)
VALUES (
    'sug-e2e-001',
    'e2e00000-0000-0000-0000-000000000001',
    'e2e11111-1111-1111-1111-111111111111',
    'sec-exp-001',
    'rewrite_experience',
    'Engineered AI-driven candidate workflow engine generating $2.4M ARR upgrades.',
    'Architected design system governance and AI candidate workflow engine, scaling ARR upgrades by $2.4M with 96% ATS match efficiency.',
    'generated'
);

UPDATE public.ai_resume_suggestions SET status = 'accepted' WHERE id = 'sug-e2e-001';

-- ============================================================================
-- STEP 9: CREATE MOCK INTERVIEW, QUESTIONS, ANSWERS & SCORES
-- ============================================================================
INSERT INTO public.mock_interviews (id, user_id, target_role, interview_type, difficulty, status, started_at)
VALUES (
    'int-e2e-001',
    'e2e00000-0000-0000-0000-000000000001',
    'Senior Product Designer',
    'technical',
    'hard',
    'in_progress',
    NOW()
);

INSERT INTO public.interview_questions (id, interview_id, question, question_order)
VALUES (
    'q-e2e-001',
    'int-e2e-001',
    'Describe your design system tokens architecture and component sync model across React and Figma.',
    1
);

INSERT INTO public.interview_answers (question_id, answer_text, technical_score, communication_score, confidence_score, relevance_score, overall_score, ai_feedback)
VALUES (
    'q-e2e-001',
    'We use Style Dictionary to transform design tokens into CSS variables and TypeScript constants, synced via GitHub Actions...',
    94, 92, 90, 96, 93,
    '{"strengths": ["Clear design system token automation"], "improvements": ["Elaborate on accessibility testing"]}'::jsonb
);

UPDATE public.mock_interviews
SET status = 'completed',
    completed_at = NOW(),
    overall_score = 93
WHERE id = 'int-e2e-001';

-- ============================================================================
-- STEP 10: CREATE SUBSCRIPTION & USAGE RECORD
-- ============================================================================
INSERT INTO public.subscriptions (user_id, plan_id, status, current_period_start, current_period_end)
VALUES (
    'e2e00000-0000-0000-0000-000000000001',
    'pro',
    'active',
    NOW(),
    NOW() + INTERVAL '1 year'
);

INSERT INTO public.user_usage (user_id, ats_scans_count, ai_generations_count, mock_interviews_count)
VALUES ('e2e00000-0000-0000-0000-000000000001', 1, 1, 1);

-- ============================================================================
-- STEP 11: VERIFY ENTIRE USER JOURNEY JOINED QUERY
-- ============================================================================
SELECT 
    p.full_name,
    p.professional_title,
    r.title AS resume_title,
    t.name AS template_used,
    r.ats_score,
    j.title AS job_title,
    j.company AS job_company,
    a.overall_score AS ats_overall_score,
    mi.target_role AS interview_target,
    mi.overall_score AS interview_score,
    sub.plan_id AS subscription_plan
FROM public.profiles p
JOIN public.resumes r ON r.user_id = p.user_id
JOIN public.resume_templates t ON t.id = r.template_id
JOIN public.job_descriptions j ON j.user_id = p.user_id
JOIN public.ats_analyses a ON a.resume_id = r.id AND a.job_description_id = j.id
JOIN public.mock_interviews mi ON mi.user_id = p.user_id
JOIN public.subscriptions sub ON sub.user_id = p.user_id
WHERE p.user_id = 'e2e00000-0000-0000-0000-000000000001';

-- ============================================================================
-- STEP 12: VERIFY CASCADE DELETE BEHAVIOR
-- Deleting the test resume must automatically clean up sections, versions, ats_analyses, keywords, and AI suggestions.
-- ============================================================================
DELETE FROM public.resumes WHERE id = 'e2e11111-1111-1111-1111-111111111111';

SELECT 
    (SELECT COUNT(*) FROM public.resume_sections WHERE resume_id = 'e2e11111-1111-1111-1111-111111111111') AS sections_remaining,
    (SELECT COUNT(*) FROM public.resume_versions WHERE resume_id = 'e2e11111-1111-1111-1111-111111111111') AS versions_remaining,
    (SELECT COUNT(*) FROM public.ats_analyses WHERE resume_id = 'e2e11111-1111-1111-1111-111111111111') AS ats_analyses_remaining,
    (SELECT COUNT(*) FROM public.ats_keywords WHERE analysis_id = 'e2e33333-3333-3333-3333-333333333333') AS keywords_remaining,
    (SELECT COUNT(*) FROM public.ai_resume_suggestions WHERE resume_id = 'e2e11111-1111-1111-1111-111111111111') AS suggestions_remaining;

-- ============================================================================
-- STEP 13: EXECUTE DATABASE HEALTH VERIFICATION FUNCTION
-- ============================================================================
SELECT * FROM public.fn_validate_database_health();

ROLLBACK;
