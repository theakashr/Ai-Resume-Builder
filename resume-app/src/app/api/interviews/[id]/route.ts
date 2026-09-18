import { NextRequest } from 'next/server';
import { handleApiError, ApiError } from '@/lib/errors/api-error';
import { successResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { uuidSchema } from '@/lib/validations';
import { verifyMockInterviewOwnership } from '@/lib/security/resource-ownership';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/interviews/[id]
 * Retrieves details for a specific mock interview session, including generated questions and submitted answers.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);

    const { user, supabase } = await requireUser();

    // Verify tenant ownership
    await verifyMockInterviewOwnership(id, user.id);

    const { data: interview, error: interviewErr } = await (supabase as any)
      .from('mock_interviews')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (interviewErr || !interview) {
      throw ApiError.notFound('Mock interview session not found');
    }

    const { data: questions } = await (supabase as any)
      .from('interview_questions')
      .select('*')
      .eq('interview_id', id)
      .order('question_order', { ascending: true });

    return successResponse({
      interview,
      questions: questions || [],
    });
  } catch (error) {
    return handleApiError(error);
  }
}
