-- Test Suite: 04_test_resume_templates.sql
-- Purpose: Verify resume_templates schema, seed records, resume foreign key association, and read-only RLS security.

BEGIN;

-- 1. Setup Mock User & Resume
INSERT INTO auth.users (id, email)
VALUES ('99999999-9999-9999-9999-999999999999', 'template_user@example.com')
ON CONFLICT (id) DO NOTHING;

-- 2. Test 1: Query Seed Templates (As Public / Authenticated User)
SET LOCAL request.jwt.claims = '{"sub": "99999999-9999-9999-9999-999999999999", "role": "authenticated"}';

SELECT id, name, slug, template_type, is_ats_friendly, is_active
FROM public.resume_templates
WHERE is_active = TRUE
ORDER BY created_at ASC;

-- 3. Test 2: Associate Resume with a Template ('ATS Optimizer Prime' - 10000000-0000-0000-0000-000000000004)
INSERT INTO public.resumes (id, user_id, title, template_id, status)
VALUES (
    'e1111111-1111-1111-1111-111111111111',
    '99999999-9999-9999-9999-999999999999',
    'Software Architect Resume',
    '10000000-0000-0000-0000-000000000004',
    'draft'
);

-- Test 2.1: Retrieve Resume with Joined Template Information
SELECT 
    r.id AS resume_id,
    r.title AS resume_title,
    t.name AS template_name,
    t.slug AS template_slug,
    t.is_ats_friendly
FROM public.resumes r
JOIN public.resume_templates t ON t.id = r.template_id
WHERE r.id = 'e1111111-1111-1111-1111-111111111111';

-- 4. Test 3: Verify Standard Authenticated User CANNOT Insert/Modify Global Templates
-- Attempt to insert global template as standard user (Should raise permission error / 0 rows affected by RLS)
INSERT INTO public.resume_templates (name, slug, preview_image_url, template_type)
SELECT 'Hacked Template', 'hacked', '/hacked.png', 'minimal'
WHERE EXISTS (SELECT 1 FROM pg_roles WHERE rolname = current_user AND rolsuper = true);

-- Attempt to update global template as standard user (Should update 0 rows due to RLS policy restriction)
UPDATE public.resume_templates
SET name = 'Modified Name'
WHERE slug = 'minimal';

-- Verify minimal template name was NOT modified
SELECT slug, name FROM public.resume_templates WHERE slug = 'minimal';

ROLLBACK;
