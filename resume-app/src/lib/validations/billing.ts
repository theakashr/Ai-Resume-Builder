import { z } from 'zod';

export const checkoutSchema = z.object({
  plan_id: z.enum(['pro', 'enterprise'], { message: 'Plan ID must be pro or enterprise' }),
  billing_cycle: z.enum(['monthly', 'yearly'], { message: 'Billing cycle must be monthly or yearly' }),
  success_url: z.string().url().optional(),
  cancel_url: z.string().url().optional(),
});

export const portalSchema = z.object({
  return_url: z.string().url().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type PortalInput = z.infer<typeof portalSchema>;
