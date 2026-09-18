-- Test Suite: 02_test_profiles.sql
-- Purpose: Verify public.profiles table creation, constraints, trigger automation, and RLS enforcement.

BEGIN;

-- 1. Create Mock Authenticated Users in auth.users schema
INSERT INTO auth.users (id, email)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'user_one@example.com'),
    ('22222222-2222-2222-2222-222222222222', 'user_two@example.com')
ON CONFLICT (id) DO NOTHING;

-- 2. Test Trigger Automation: Verify profiles were automatically created for both users
SELECT user_id, email FROM public.profiles WHERE user_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');

-- 3. Test RLS - Simulate User 1 Context
SET LOCAL request.jwt.claims = '{"sub": "11111111-1111-1111-1111-111111111111", "role": "authenticated"}';

-- Test 3.1: Read Own Profile (Should Return 1 row)
SELECT * FROM public.profiles WHERE user_id = '11111111-1111-1111-1111-111111111111';

-- Test 3.2: Update Own Profile (Should Succeed)
UPDATE public.profiles
SET full_name = 'Alice Johnson',
    professional_title = 'Senior Software Engineer',
    experience_level = 'senior_level'
WHERE user_id = '11111111-1111-1111-1111-111111111111';

-- Test 3.3: Attempt to Read User 2 Profile under User 1 Context (Should Return 0 rows due to RLS)
SELECT * FROM public.profiles WHERE user_id = '22222222-2222-2222-2222-222222222222';

-- Test 3.4: Attempt to Update User 2 Profile under User 1 Context (Should Update 0 rows due to RLS)
UPDATE public.profiles
SET full_name = 'Hacked Name'
WHERE user_id = '22222222-2222-2222-2222-222222222222';

-- Test 3.5: Verify User 2 Profile remains uncompromised
SET LOCAL request.jwt.claims = '{"sub": "22222222-2222-2222-2222-222222222222", "role": "authenticated"}';
SELECT user_id, full_name, email FROM public.profiles WHERE user_id = '22222222-2222-2222-2222-222222222222';

-- Rollback mock test transaction
ROLLBACK;
