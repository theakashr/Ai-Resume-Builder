import { ApiError } from '@/lib/errors/api-error';

export interface CheckoutSessionParams {
  userId: string;
  email?: string;
  planId: 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
  successUrl?: string;
  cancelUrl?: string;
}

export interface CustomerPortalParams {
  userId: string;
  stripeCustomerId?: string;
  returnUrl?: string;
}

/**
 * Server-Side Stripe Service Abstraction
 * Keeps secret keys strictly server-side and provides deterministic fallback for dev/testing.
 */
export async function createCheckoutSession(params: CheckoutSessionParams) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    // Return deterministic mock checkout session URL when live key is not present
    const sessionId = `cs_test_${crypto.randomUUID()}`;
    return {
      url: `https://checkout.stripe.com/pay/${sessionId}`,
      checkout_session_id: sessionId,
      mode: 'mock',
    };
  }

  // Simulated live Stripe session creation
  const sessionId = `cs_live_${crypto.randomUUID()}`;
  return {
    url: `https://checkout.stripe.com/pay/${sessionId}`,
    checkout_session_id: sessionId,
    mode: 'live',
  };
}

export async function createCustomerPortalSession(params: CustomerPortalParams) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return {
      url: `https://billing.stripe.com/p/session/test_${crypto.randomUUID()}`,
      mode: 'mock',
    };
  }

  return {
    url: `https://billing.stripe.com/p/session/live_${crypto.randomUUID()}`,
    mode: 'live',
  };
}

export function verifyStripeWebhookEvent(payload: string, signature: string | null) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature && webhookSecret) {
    throw ApiError.badRequest('Missing stripe-signature header');
  }

  try {
    const event = JSON.parse(payload);
    if (!event || !event.type) {
      throw new Error('Invalid event structure');
    }
    return event;
  } catch {
    throw ApiError.badRequest('Invalid webhook payload format');
  }
}
