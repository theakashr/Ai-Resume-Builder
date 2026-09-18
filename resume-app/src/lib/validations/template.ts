import { z } from 'zod';

export const templateQuerySchema = z.object({
  template_type: z.enum(['minimal', 'modern', 'professional', 'ats_friendly']).optional(),
  is_ats_friendly: z
    .preprocess((val) => {
      if (val === 'true' || val === true) return true;
      if (val === 'false' || val === false) return false;
      return undefined;
    }, z.boolean().optional())
    .optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['created_at', 'name', 'template_type']).optional().default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type TemplateQueryInput = z.infer<typeof templateQuerySchema>;
