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
 * GET /api/interviews/[id]/results
 * Aggregates scores, strengths, improvement areas, AI feedback, practice topics, and practice disclaimer.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);

    const { user, supabase } = await requireUser();

    // Verify tenant ownership
    await verifyMockInterviewOwnership(id, user.id);

    const { data: interview, error: fetchErr } = await (supabase as any)
      .from('mock_interviews')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchErr || !interview) {
      throw ApiError.notFound('Mock interview session not found');
    }

    const { data: questions } = await (supabase as any)
      .from('interview_questions')
      .select('id, question, category')
      .eq('interview_id', id);

    const questionIds = (questions || []).map((q: any) => q.id);

    let answers: any[] = [];
    if (questionIds.length > 0) {
      const { data: answersData } = await (supabase as any)
        .from('interview_answers')
        .select('*')
        .in('question_id', questionIds);
      answers = answersData || [];
    }

    // Compute average dimension scores
    const count = answers.length || 1;
    const technicalScore = Math.round(answers.reduce((s, a) => s + (a.technical_score || 0), 0) / count) || 0;
    const communicationScore = Math.round(answers.reduce((s, a) => s + (a.communication_score || 0), 0) / count) || 0;
    const confidenceScore = Math.round(answers.reduce((s, a) => s + (a.confidence_score || 0), 0) / count) || 0;
    const relevanceScore = Math.round(answers.reduce((s, a) => s + (a.relevance_score || 0), 0) / count) || 0;
    const overallScore = interview.overall_score || Math.round((technicalScore + communicationScore + confidenceScore + relevanceScore) / 4);

    // Aggregate strengths, improvements, and practice areas
    const strengthsSet = new Set<string>();
    const improvementsSet = new Set<string>();
    const practiceAreasSet = new Set<string>();

    answers.forEach((a) => {
      const fb = a.ai_feedback || {};
      if (Array.isArray(fb.strengths)) fb.strengths.forEach((s: string) => strengthsSet.add(s));
      if (Array.isArray(fb.improvements)) fb.improvements.forEach((i: string) => improvementsSet.add(i));
      if (Array.isArray(fb.practice_areas)) fb.practice_areas.forEach((p: string) => practiceAreasSet.add(p));
    });

    return successResponse({
      interview_id: id,
      status: interview.status,
      target_role: interview.target_role,
      interview_type: interview.interview_type,
      difficulty: interview.difficulty,
      scores: {
        overall_score: overallScore,
        technical_score: technicalScore,
        communication_score: communicationScore,
        confidence_score: confidenceScore,
        relevance_score: relevanceScore,
      },
      strengths: Array.from(strengthsSet),
      areas_for_improvement: Array.from(improvementsSet),
      recommended_practice_areas: Array.from(practiceAreasSet),
      submitted_answers_count: answers.length,
      total_questions_count: questions?.length || 0,
      disclaimer: INTERVIEW_PRACTICE_DISCLAIMER,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
