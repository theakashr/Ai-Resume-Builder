import { z } from 'zod';

export const createResumeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(120, 'Title cannot exceed 120 characters'),
  template_id: z.string().uuid({ message: 'Invalid template UUID format' }).optional().nullable(),
  status: z.enum(['draft', 'completed', 'archived']).optional().default('draft'),
});

export const updateResumeSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  template_id: z.string().uuid().optional().nullable(),
  status: z.enum(['draft', 'completed', 'archived']).optional(),
  ats_score: z.number().int().min(0).max(100).optional().nullable(),
  completion_percentage: z.number().int().min(0).max(100).optional(),
});

export const resumeQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  status: z.enum(['draft', 'completed', 'archived']).optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'title', 'ats_score']).optional().default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
export type ResumeQueryInput = z.infer<typeof resumeQuerySchema>;
