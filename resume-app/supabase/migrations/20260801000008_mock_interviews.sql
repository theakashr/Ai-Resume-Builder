-- Migration: 20260801000008_mock_interviews.sql
-- Description: Phase 8 - AI Mock Interviews Database Layer (Mock Interviews, Questions, Answers, Multi-dimensional Scoring, RLS & Indexes)

-- 1. Create Mock Interviews Table
CREATE TABLE IF NOT EXISTS public.mock_interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_role TEXT NOT NULL CHECK (length(trim(target_role)) > 0),
    interview_type TEXT NOT NULL CHECK (interview_type IN ('technical', 'behavioral', 'hr')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    status TEXT NOT NULL DEFAULT 'setup' CHECK (status IN ('setup', 'in_progress', 'completed', 'cancelled')),
    overall_score INTEGER CHECK (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100)),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Interview Questions Table
CREATE TABLE IF NOT EXISTS public.interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL REFERENCES public.mock_interviews(id) ON DELETE CASCADE,
    question TEXT NOT NULL CHECK (length(trim(question)) > 0),
    question_order INTEGER NOT NULL DEFAULT 1 CHECK (question_order > 0),
    category TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Interview Answers Table
CREATE TABLE IF NOT EXISTS public.interview_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID UNIQUE NOT NULL REFERENCES public.interview_questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    audio_url TEXT,
    video_url TEXT,
    transcription TEXT,
    technical_score INTEGER CHECK (technical_score IS NULL OR (technical_score >= 0 AND technical_score <= 100)),
    communication_score INTEGER CHECK (communication_score IS NULL OR (communication_score >= 0 AND communication_score <= 100)),
    confidence_score INTEGER CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 100)),
    relevance_score INTEGER CHECK (relevance_score IS NULL OR (relevance_score >= 0 AND relevance_score <= 100)),
    overall_score INTEGER CHECK (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100)),
    ai_feedback JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_mock_interviews_user_id ON public.mock_interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_user_status ON public.mock_interviews(user_id, status);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_created ON public.mock_interviews(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_interview_questions_interview_id ON public.interview_questions(interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_questions_order ON public.interview_questions(interview_id, question_order ASC);

CREATE INDEX IF NOT EXISTS idx_interview_answers_question_id ON public.interview_answers(question_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.mock_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;

-- 6. Define RLS Policies for mock_interviews
DROP POLICY IF EXISTS "Users can view own mock interviews" ON public.mock_interviews;
CREATE POLICY "Users can view own mock interviews"
    ON public.mock_interviews FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own mock interviews" ON public.mock_interviews;
CREATE POLICY "Users can insert own mock interviews"
    ON public.mock_interviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own mock interviews" ON public.mock_interviews;
CREATE POLICY "Users can update own mock interviews"
    ON public.mock_interviews FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own mock interviews" ON public.mock_interviews;
CREATE POLICY "Users can delete own mock interviews"
    ON public.mock_interviews FOR DELETE
    USING (auth.uid() = user_id);

-- 7. Define RLS Policies for interview_questions
DROP POLICY IF EXISTS "Users can view questions for own interviews" ON public.interview_questions;
CREATE POLICY "Users can view questions for own interviews"
    ON public.interview_questions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.mock_interviews
            WHERE mock_interviews.id = interview_questions.interview_id
              AND mock_interviews.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert questions for own interviews" ON public.interview_questions;
CREATE POLICY "Users can insert questions for own interviews"
    ON public.interview_questions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.mock_interviews
            WHERE mock_interviews.id = interview_questions.interview_id
              AND mock_interviews.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete questions for own interviews" ON public.interview_questions;
CREATE POLICY "Users can delete questions for own interviews"
    ON public.interview_questions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.mock_interviews
            WHERE mock_interviews.id = interview_questions.interview_id
              AND mock_interviews.user_id = auth.uid()
        )
    );

-- 8. Define RLS Policies for interview_answers
DROP POLICY IF EXISTS "Users can view answers for own interviews" ON public.interview_answers;
CREATE POLICY "Users can view answers for own interviews"
    ON public.interview_answers FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.interview_questions q
            JOIN public.mock_interviews i ON i.id = q.interview_id
            WHERE q.id = interview_answers.question_id
              AND i.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert answers for own interviews" ON public.interview_answers;
CREATE POLICY "Users can insert answers for own interviews"
    ON public.interview_answers FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.interview_questions q
            JOIN public.mock_interviews i ON i.id = q.interview_id
            WHERE q.id = interview_answers.question_id
              AND i.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update answers for own interviews" ON public.interview_answers;
CREATE POLICY "Users can update answers for own interviews"
    ON public.interview_answers FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.interview_questions q
            JOIN public.mock_interviews i ON i.id = q.interview_id
            WHERE q.id = interview_answers.question_id
              AND i.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.interview_questions q
            JOIN public.mock_interviews i ON i.id = q.interview_id
            WHERE q.id = interview_answers.question_id
              AND i.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete answers for own interviews" ON public.interview_answers;
CREATE POLICY "Users can delete answers for own interviews"
    ON public.interview_answers FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.interview_questions q
            JOIN public.mock_interviews i ON i.id = q.interview_id
            WHERE q.id = interview_answers.question_id
              AND i.user_id = auth.uid()
        )
    );
