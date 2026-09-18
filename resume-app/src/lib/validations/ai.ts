import { z } from 'zod';

export const resumeAssistantSchema = z.object({
  resume_id: z.string().uuid({ message: 'Invalid resume UUID format' }).optional().nullable(),
  resume_section_id: z.string().uuid({ message: 'Invalid section UUID format' }).optional().nullable(),
  action_type: z.enum(
    [
      'improve_summary',
      'rewrite_experience',
      'improve_project',
      'generate_skills',
      'improve_achievement',
      'general_qa',
      'chat_question',
      'general_advice',
    ],
    { message: 'Valid action_type is required' }
  ),
  current_content: z
    .string()
    .trim()
    .min(1, 'Current content cannot be empty')
    .max(10000, 'Current content cannot exceed 10,000 characters'),
});

export type ResumeAssistantInput = z.infer<typeof resumeAssistantSchema>;
