import { z } from 'zod';

export const analyzeRequestSchema = z.object({
  resume_id: z.string().uuid({ message: 'Invalid resume UUID format' }),
  job_description_id: z.string().uuid({ message: 'Invalid job description UUID format' }),
});

export const atsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['created_at', 'overall_score']).optional().default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type AnalyzeRequestInput = z.infer<typeof analyzeRequestSchema>;
export type ATSQueryInput = z.infer<typeof atsQuerySchema>;
