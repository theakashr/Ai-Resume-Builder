import { z } from 'zod';

// ============ INTERVIEW CREATION =============
export const createInterviewSchema = z.object({
  target_role: z
    .string()
    .trim()
    .min(1, 'Target role is required')
    .max(120, 'Target role cannot exceed 120 characters'),
  interview_type: z.enum(['technical', 'behavioral', 'hr', 'mixed'], {
    message: 'Interview type must be technical, behavioral, hr, or mixed',
  }).default('mixed'),
  difficulty: z.enum(['easy', 'medium', 'hard', 'adaptive'], {
    message: 'Difficulty must be easy, medium, hard, or adaptive',
  }).default('medium'),
  experience_level: z.string().optional().default('Entry Level'),
  questions_count: z.coerce.number().int().min(30).max(50).optional().default(30),
  resume_id: z.string().optional(),
  job_description: z.string().optional(),
});

// ============ ANSWER SUBMISSION =============
export const submitAnswerSchema = z.object({
  question_id: z.string().uuid({ message: 'Invalid question UUID format' }),
  answer_text: z
    .string()
    .trim()
    .min(1, 'Answer text cannot be empty')
    .max(10000, 'Answer text cannot exceed 10000 characters'),
  duration_seconds: z.number().optional(),
});

// ============ PAGINATION =============
export const interviewQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['created_at', 'overall_score', 'target_role']).optional().default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

// ============ EVALUATION SCHEMAS =============
export const starAnalysisSchema = z.object({
  situation: z.boolean(),
  task: z.boolean(),
  action: z.boolean(),
  result: z.boolean(),
});

export const evaluationResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  technicalScore: z.number().min(0).max(100),
  communicationScore: z.number().min(0).max(100),
  relevanceScore: z.number().min(0).max(100),
  starAnalysis: starAnalysisSchema,
  strengths: z.array(z.string()).min(1),
  improvements: z.array(z.string()).min(1),
  suggestedAnswer: z.string().min(1),
  technicalRelevance: z.boolean(),
  resumeContextUsed: z.boolean(),
});

// ============ TYPE INFERENCES =============
export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
export type InterviewQueryInput = z.infer<typeof interviewQuerySchema>;
export type StarAnalysis = z.infer<typeof starAnalysisSchema>;
export type EvaluationResultInput = z.infer<typeof evaluationResultSchema>;