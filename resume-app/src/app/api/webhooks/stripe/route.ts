import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, ApiError } from '@/lib/errors/api-error';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyStripeWebhookEvent } from '@/lib/billing/stripe';

/**
 * POST /api/webhooks/stripe
 * Verified Stripe Webhook Event Handler.
 * The payment provider webhook is the SINGLE SOURCE OF TRUTH for subscription status.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    // Verify webhook event signature
    const event = verifyStripeWebhookEvent(rawBody, signature);
    const supabase = await createAdminClient();

    switch (event.type) {
      case 'checkout.session.completed':
      case 'customer.subscription.created': {
        const session = event.data?.object || {};
        const userId = session.client_reference_id || session.metadata?.user_id;
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        const planId = session.metadata?.plan_id || 'pro';

        if (userId) {
          await (supabase as any).from('subscriptions').upsert({
            user_id: userId,
            stripe_customer_id: customerId || null,
            stripe_subscription_id: subscriptionId || null,
            plan_id: planId,
            status: 'active',
            updated_at: new Date().toISOString(),
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data?.object || {};
        const customerId = invoice.customer;
        const subscriptionId = invoice.subscription;

        if (customerId || subscriptionId) {
          await (supabase as any)
            .from('subscriptions')
            .update({
              status: 'active',
              current_period_start: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
              current_period_end: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
              updated_at: new Date().toISOString(),
            })
            .or(`stripe_customer_id.eq.${customerId},stripe_subscription_id.eq.${subscriptionId}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data?.object || {};
        const customerId = invoice.customer;
        const subscriptionId = invoice.subscription;

        if (customerId || subscriptionId) {
          await (supabase as any)
            .from('subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .or(`stripe_customer_id.eq.${customerId},stripe_subscription_id.eq.${subscriptionId}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data?.object || {};
        const subscriptionId = sub.id;

        if (subscriptionId) {
          await (supabase as any)
            .from('subscriptions')
            .update({
              plan_id: 'free',
              status: 'canceled',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
