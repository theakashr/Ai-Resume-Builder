-- Migration: 20260801000009_subscriptions.sql
-- Description: Phase 9 - Subscriptions & Usage Quota Management (Subscriptions, User Usage, RLS & Indexes)

-- 1. Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT UNIQUE,
    plan_id TEXT NOT NULL DEFAULT 'free' CHECK (plan_id IN ('free', 'pro', 'enterprise')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create User Usage Quota Table
CREATE TABLE IF NOT EXISTS public.user_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    ats_scans_count INTEGER NOT NULL DEFAULT 0 CHECK (ats_scans_count >= 0),
    ai_generations_count INTEGER NOT NULL DEFAULT 0 CHECK (ai_generations_count >= 0),
    mock_interviews_count INTEGER NOT NULL DEFAULT 0 CHECK (mock_interviews_count >= 0),
    reset_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 month'),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Attach Automated updated_at Triggers
DROP TRIGGER IF EXISTS set_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER set_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_user_usage_updated_at ON public.user_usage;
CREATE TRIGGER set_user_usage_updated_at
    BEFORE UPDATE ON public.user_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_cust ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON public.user_usage(user_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- 6. Define RLS Policies for subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can insert own subscriptions"
    ON public.subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can update own subscriptions"
    ON public.subscriptions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 7. Define RLS Policies for user_usage
DROP POLICY IF EXISTS "Users can view own usage" ON public.user_usage;
CREATE POLICY "Users can view own usage"
    ON public.user_usage FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own usage" ON public.user_usage;
CREATE POLICY "Users can insert own usage"
    ON public.user_usage FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own usage" ON public.user_usage;
CREATE POLICY "Users can update own usage"
    ON public.user_usage FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
