import { NextRequest } from 'next/server';
import { handleApiError, ApiError } from '@/lib/errors/api-error';
import { successResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { uuidSchema } from '@/lib/validations';
import { verifySuggestionOwnership } from '@/lib/security/resource-ownership';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/ai/suggestions/[id]/reject
 * Marks an AI suggestion as rejected.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);

    const { user, supabase } = await requireUser();

    // Verify tenant ownership
    await verifySuggestionOwnership(id, user.id);

    // Update suggestion status to rejected
    const { data: updatedSuggestion, error: updateErr } = await (supabase as any)
      .from('ai_resume_suggestions')
      .update({ status: 'rejected' })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateErr || !updatedSuggestion) {
      throw ApiError.notFound('AI suggestion not found');
    }

    return successResponse(updatedSuggestion);
  } catch (error) {
    return handleApiError(error);
  }
}
