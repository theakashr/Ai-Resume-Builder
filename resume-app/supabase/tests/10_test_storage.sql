-- Test Suite: 10_test_storage.sql
-- Purpose: Verify storage bucket configuration, path conventions, and path-based RLS security on storage.objects.

BEGIN;

-- 1. Setup Mock Authenticated Users
INSERT INTO auth.users (id, email)
VALUES 
    ('12121212-1212-1212-1212-121212121212', 'storage_user@example.com'),
    ('34343434-3434-3434-3434-343434343434', 'storage_intruder@example.com')
ON CONFLICT (id) DO NOTHING;

-- 2. Test 1: Verify Bucket Registration & Limits
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id IN ('profile-images', 'resume-files', 'interview-recordings')
ORDER BY id ASC;

-- 3. Test 2: Upload Files under User 1 Auth Context
SET LOCAL request.jwt.claims = '{"sub": "12121212-1212-1212-1212-121212121212", "role": "authenticated"}';

INSERT INTO storage.objects (id, bucket_id, name, owner, metadata)
VALUES 
    (
        'o1111111-1111-1111-1111-111111111111',
        'profile-images',
        '12121212-1212-1212-1212-121212121212/avatar.png',
        '12121212-1212-1212-1212-121212121212',
        '{"mimetype": "image/png", "size": 1024}'::jsonb
    ),
    (
        'o2222222-2222-2222-2222-222222222222',
        'resume-files',
        '12121212-1212-1212-1212-121212121212/resumes/c111/resume_export.pdf',
        '12121212-1212-1212-1212-121212121212',
        '{"mimetype": "application/pdf", "size": 2048}'::jsonb
    ),
    (
        'o3333333-3333-3333-3333-333333333333',
        'interview-recordings',
        '12121212-1212-1212-1212-121212121212/interviews/m111/question_1.webm',
        '12121212-1212-1212-1212-121212121212',
        '{"mimetype": "audio/webm", "size": 524288}'::jsonb
    );

-- Verify User 1 can view own objects
SELECT bucket_id, name FROM storage.objects WHERE bucket_id IN ('profile-images', 'resume-files', 'interview-recordings');

-- 4. Test RLS Security - Switch Context to User 2 (Intruder)
SET LOCAL request.jwt.claims = '{"sub": "34343434-3434-3434-3434-343434343434", "role": "authenticated"}';

-- Test 4.1: Attempt to Read User 1 Files (Must return 0 rows)
SELECT * FROM storage.objects WHERE name LIKE '12121212-1212-1212-1212-121212121212/%';

-- Test 4.2: Attempt to Delete User 1 File (Must delete 0 rows)
DELETE FROM storage.objects WHERE name = '12121212-1212-1212-1212-121212121212/avatar.png';

ROLLBACK;
