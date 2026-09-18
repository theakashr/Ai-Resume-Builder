import { z } from 'zod';

export const exportResumeSchema = z.object({
  format: z.enum(['pdf']).optional().default('pdf'),
  template_id: z.string().uuid({ message: 'Invalid template UUID format' }).optional().nullable(),
});

export type ExportResumeInput = z.infer<typeof exportResumeSchema>;
