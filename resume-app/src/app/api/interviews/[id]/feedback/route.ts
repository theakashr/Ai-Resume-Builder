import { NextRequest } from 'next/server';
import { handleApiError, ApiError } from '@/lib/errors/api-error';
import { successResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { uuidSchema } from '@/lib/validations';
import { verifyMockInterviewOwnership } from '@/lib/security/resource-ownership';
import { INTERVIEW_PRACTICE_DISCLAIMER } from '@/lib/interviews/engine';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/interviews/[id]/feedback
 * Returns per-question AI feedback breakdown and practice disclaimer.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);

    const { user, supabase } = await requireUser();

    // Verify tenant ownership
    await verifyMockInterviewOwnership(id, user.id);

    const { data: questions } = await (supabase as any)
      .from('interview_questions')
      .select('id, question, category, question_order')
      .eq('interview_id', id)
      .order('question_order', { ascending: true });

    const questionMap = new Map<string, any>();
    (questions || []).forEach((q: any) => questionMap.set(q.id, q));

    const questionIds = Array.from(questionMap.keys());

    let answers: any[] = [];
    if (questionIds.length > 0) {
      const { data: answersData } = await (supabase as any)
        .from('interview_answers')
        .select('*')
        .in('question_id', questionIds);
      answers = answersData || [];
    }

    const detailedFeedback = (questions || []).map((q: any) => {
      const answer = answers.find((a: any) => a.question_id === q.id);
      return {
        question_id: q.id,
        question: q.question,
        category: q.category,
        question_order: q.question_order,
        answer_text: answer?.answer_text || null,
        scores: answer
          ? {
              overall_score: answer.overall_score,
              technical_score: answer.technical_score,
              communication_score: answer.communication_score,
              confidence_score: answer.confidence_score,
              relevance_score: answer.relevance_score,
            }
          : null,
        ai_feedback: answer?.ai_feedback || null,
      };
    });

    return successResponse({
      interview_id: id,
      feedback: detailedFeedback,
      disclaimer: INTERVIEW_PRACTICE_DISCLAIMER,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
