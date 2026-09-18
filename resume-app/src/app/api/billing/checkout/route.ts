import { NextRequest } from 'next/server';
import { handleApiError } from '@/lib/errors/api-error';
import { createdResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { parseRequestBody } from '@/lib/validations';
import { checkoutSchema } from '@/lib/validations/billing';
import { createCheckoutSession } from '@/lib/billing/stripe';

/**
 * POST /api/billing/checkout
 * Creates a Stripe Checkout Session for Pro/Enterprise plans.
 * Server-only secret key handling; never exposes Stripe secret credentials to client.
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await requireUser();
    const body = await parseRequestBody(request, checkoutSchema);

    const session = await createCheckoutSession({
      userId: user.id,
      email: user.email,
      planId: body.plan_id,
      billingCycle: body.billing_cycle,
      successUrl: body.success_url,
      cancelUrl: body.cancel_url,
    });

    return createdResponse(session);
  } catch (error) {
    return handleApiError(error);
  }
}
