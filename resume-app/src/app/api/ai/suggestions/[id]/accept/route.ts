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
 * POST /api/ai/suggestions/[id]/accept
 * Marks an AI suggestion as accepted and updates the target section content if linked.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);

    const { user, supabase } = await requireUser();

    // Verify tenant ownership
    await verifySuggestionOwnership(id, user.id);

    // Fetch suggestion
    const { data: suggestion, error: fetchErr } = await (supabase as any)
      .from('ai_resume_suggestions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchErr || !suggestion) {
      throw ApiError.notFound('AI suggestion not found');
    }

    // Update suggestion status to accepted
    const { data: updatedSuggestion, error: updateErr } = await (supabase as any)
      .from('ai_resume_suggestions')
      .update({ status: 'accepted' })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateErr) {
      throw updateErr;
    }

    // If target section ID is linked, update section content
    if (suggestion.resume_section_id) {
      await (supabase as any)
        .from('resume_sections')
        .update({
          content: { text: suggestion.suggested_content },
        })
        .eq('id', suggestion.resume_section_id)
        .eq('resume_id', suggestion.resume_id);
    }

    return successResponse(updatedSuggestion);
  } catch (error) {
    return handleApiError(error);
  }
}
