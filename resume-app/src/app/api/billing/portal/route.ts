import { NextRequest } from 'next/server';
import { handleApiError } from '@/lib/errors/api-error';
import { createdResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { parseRequestBody } from '@/lib/validations';
import { portalSchema } from '@/lib/validations/billing';
import { createCustomerPortalSession } from '@/lib/billing/stripe';

/**
 * POST /api/billing/portal
 * Generates a Stripe Customer Portal session URL for managing billing methods & subscriptions.
 */
export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await requireUser();
    let body: { return_url?: string } = {};
    try {
      body = await parseRequestBody(request, portalSchema);
    } catch {
      // Optional body
    }

    const { data: sub } = await (supabase as any)
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    const portal = await createCustomerPortalSession({
      userId: user.id,
      stripeCustomerId: sub?.stripe_customer_id || undefined,
      returnUrl: body.return_url,
    });

    return createdResponse(portal);
  } catch (error) {
    return handleApiError(error);
  }
}
