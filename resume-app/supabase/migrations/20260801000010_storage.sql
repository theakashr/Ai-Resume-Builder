-- Migration: 20260801000010_storage.sql
-- Description: Phase 10 - Supabase Storage Buckets Configuration & Path-Based RLS Policies

-- 1. Ensure Storage Schema & Buckets Table Exist
CREATE SCHEMA IF NOT EXISTS storage;

-- 2. Insert / Update Storage Buckets Definitions
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    (
        'profile-images',
        'profile-images',
        FALSE,
        5242880, -- 5 MB limit
        ARRAY['image/png', 'image/jpeg', 'image/webp']
    ),
    (
        'resume-files',
        'resume-files',
        FALSE,
        10485760, -- 10 MB limit
        ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    ),
    (
        'interview-recordings',
        'interview-recordings',
        FALSE,
        52428800, -- 50 MB limit
        ARRAY['audio/webm', 'audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/ogg', 'video/webm', 'video/mp4']
    )
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3. Storage RLS Policies for profile-images Bucket
DROP POLICY IF EXISTS "Users can view own profile images" ON storage.objects;
CREATE POLICY "Users can view own profile images"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'profile-images'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users can upload own profile images" ON storage.objects;
CREATE POLICY "Users can upload own profile images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'profile-images'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users can update own profile images" ON storage.objects;
CREATE POLICY "Users can update own profile images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'profile-images'
        AND (storage.foldername(name))[1] = auth.uid()::text
    )
    WITH CHECK (
        bucket_id = 'profile-images'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users can delete own profile images" ON storage.objects;
CREATE POLICY "Users can delete own profile images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'profile-images'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- 4. Storage RLS Policies for resume-files Bucket
DROP POLICY IF EXISTS "Users can view own resume files" ON storage.objects;
CREATE POLICY "Users can view own resume files"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'resume-files'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users can upload own resume files" ON storage.objects;
CREATE POLICY "Users can upload own resume files"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'resume-files'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users can update own resume files" ON storage.objects;
CREATE POLICY "Users can update own resume files"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'resume-files'
        AND (storage.foldername(name))[1] = auth.uid()::text
    )
    WITH CHECK (
        bucket_id = 'resume-files'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users can delete own resume files" ON storage.objects;
CREATE POLICY "Users can delete own resume files"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'resume-files'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- 5. Storage RLS Policies for interview-recordings Bucket
DROP POLICY IF EXISTS "Users can view own interview recordings" ON storage.objects;
CREATE POLICY "Users can view own interview recordings"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'interview-recordings'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users can upload own interview recordings" ON storage.objects;
CREATE POLICY "Users can upload own interview recordings"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'interview-recordings'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users can update own interview recordings" ON storage.objects;
CREATE POLICY "Users can update own interview recordings"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'interview-recordings'
        AND (storage.foldername(name))[1] = auth.uid()::text
    )
    WITH CHECK (
        bucket_id = 'interview-recordings'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users can delete own interview recordings" ON storage.objects;
CREATE POLICY "Users can delete own interview recordings"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'interview-recordings'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );
