import { z } from 'zod';

export const createJobSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(120, 'Title cannot exceed 120 characters'),
  company: z
    .string()
    .trim()
    .min(1, 'Company is required')
    .max(120, 'Company cannot exceed 120 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Job description is required')
    .max(20000, 'Job description cannot exceed 20,000 characters'),
  source_url: z
    .string()
    .trim()
    .max(1000, 'Source URL cannot exceed 1000 characters')
    .optional()
    .nullable(),
});

export const updateJobSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  company: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().min(1).max(20000).optional(),
  source_url: z.string().trim().max(1000).optional().nullable(),
});

export const jobQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.enum(['created_at', 'title', 'company']).optional().default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type JobQueryInput = z.infer<typeof jobQuerySchema>;
