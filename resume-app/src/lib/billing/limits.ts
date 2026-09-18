import { ApiError } from '@/lib/errors/api-error';
import { createClient } from '@/lib/supabase/server';

export interface PlanLimits {
  resumes: number;
  ats_scans: number;
  ai_generations: number;
  mock_interviews: number;
}

export const PLAN_LIMITS: Record<'free' | 'pro' | 'enterprise', PlanLimits> = {
  free: {
    resumes: 2,
    ats_scans: 3,
    ai_generations: 5,
    mock_interviews: 1,
  },
  pro: {
    resumes: 15,
    ats_scans: 50,
    ai_generations: 100,
    mock_interviews: 20,
  },
  enterprise: {
    resumes: 100,
    ats_scans: 500,
    ai_generations: 1000,
    mock_interviews: 100,
  },
};

export async function getUserPlanAndUsage(userId: string) {
  const supabase = await createClient();

  const { data: subData } = await (supabase as any)
    .from('subscriptions')
    .select('plan_id, status, current_period_start, current_period_end')
    .eq('user_id', userId)
    .maybeSingle();

  const planId: 'free' | 'pro' | 'enterprise' =
    subData && subData.status === 'active' ? subData.plan_id : 'free';

  const limits = PLAN_LIMITS[planId] || PLAN_LIMITS.free;

  const { data: usageData } = await (supabase as any)
    .from('user_usage')
    .select('ats_scans_count, ai_generations_count, mock_interviews_count')
    .eq('user_id', userId)
    .maybeSingle();

  const { count: resumesCount } = await (supabase as any)
    .from('resumes')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  const usage = {
    resumes_count: resumesCount || 0,
    ats_scans_count: usageData?.ats_scans_count || 0,
    ai_generations_count: usageData?.ai_generations_count || 0,
    mock_interviews_count: usageData?.mock_interviews_count || 0,
  };

  return { planId, limits, usage };
}

export async function checkFeatureQuota(
  userId: string,
  feature: 'resumes' | 'ats_scans' | 'ai_generations' | 'mock_interviews'
): Promise<void> {
  const { planId, limits, usage } = await getUserPlanAndUsage(userId);

  let current = 0;
  let max = 0;

  switch (feature) {
    case 'resumes':
      current = usage.resumes_count;
      max = limits.resumes;
      break;
    case 'ats_scans':
      current = usage.ats_scans_count;
      max = limits.ats_scans;
      break;
    case 'ai_generations':
      current = usage.ai_generations_count;
      max = limits.ai_generations;
      break;
    case 'mock_interviews':
      current = usage.mock_interviews_count;
      max = limits.mock_interviews;
      break;
  }

  if (current >= max) {
    throw ApiError.forbidden(
      `Quota limit reached for ${feature.replace('_', ' ')} (${current}/${max}) on the ${planId.toUpperCase()} plan. Please upgrade your subscription to access higher limits.`
    );
  }
}
