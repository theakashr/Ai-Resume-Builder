import { NextRequest } from 'next/server';
import { handleApiError } from '@/lib/errors/api-error';
import { successResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { getUserPlanAndUsage } from '@/lib/billing/limits';

/**
 * GET /api/billing/subscription
 * Retrieves current active subscription details, server-side plan quota limits, and usage metrics.
 */
export async function GET(request: NextRequest) {
  try {
    const { user, supabase } = await requireUser();

    const { data: subscription } = await (supabase as any)
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const { planId, limits, usage } = await getUserPlanAndUsage(user.id);

    return successResponse({
      subscription: subscription || {
        user_id: user.id,
        plan_id: 'free',
        status: 'active',
        stripe_customer_id: null,
        stripe_subscription_id: null,
        cancel_at_period_end: false,
      },
      plan_id: planId,
      limits,
      usage,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
