import { z } from 'zod';

export const createVersionSchema = z.object({
  notes: z.string().trim().max(250, 'Version notes cannot exceed 250 characters').optional(),
});

export type CreateVersionInput = z.infer<typeof createVersionSchema>;
