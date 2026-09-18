import { z } from 'zod';

export const createSectionSchema = z.object({
  section_type: z
    .string()
    .trim()
    .min(1, 'Section type is required')
    .max(50, 'Section type cannot exceed 50 characters'),
  section_order: z.number().int().min(0).optional(),
  content: z.record(z.string(), z.unknown()).optional().default({}),
});

export const updateSectionSchema = z.object({
  section_type: z.string().trim().min(1).max(50).optional(),
  section_order: z.number().int().min(0).optional(),
  content: z.record(z.string(), z.unknown()).optional(),
});

export const reorderSectionsSchema = z.object({
  sections: z
    .array(
      z.object({
        id: z.string().uuid({ message: 'Invalid section UUID format' }),
        section_order: z.number().int().min(0),
      })
    )
    .min(1, 'Sections array cannot be empty'),
});

export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
export type ReorderSectionsInput = z.infer<typeof reorderSectionsSchema>;
