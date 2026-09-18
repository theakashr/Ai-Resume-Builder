import { NextRequest } from 'next/server';
import { handleApiError } from '@/lib/errors/api-error';
import { successResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { parseRequestBody, uuidSchema } from '@/lib/validations';
import { updateSectionSchema } from '@/lib/validations/section';
import { verifyResumeSectionOwnership } from '@/lib/security/resource-ownership';

interface RouteParams {
  params: Promise<{ id: string; sectionId: string }>;
}

/**
 * PATCH /api/resumes/[id]/sections/[sectionId]
 * Updates a specific section belonging to the specified resume.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, sectionId } = await params;
    uuidSchema.parse(id);
    uuidSchema.parse(sectionId);

    const { user, supabase } = await requireUser();

    // Verify ownership of both resume and target section
    await verifyResumeSectionOwnership(sectionId, id, user.id);

    const body = await parseRequestBody(request, updateSectionSchema);

    const updatePayload = {
      ...(body.section_type !== undefined ? { section_type: body.section_type } : {}),
      ...(body.section_order !== undefined ? { section_order: body.section_order } : {}),
      ...(body.content !== undefined ? { content: body.content } : {}),
    };

    const { data: updatedSection, error } = await (supabase as any)
      .from('resume_sections')
      .update(updatePayload)
      .eq('id', sectionId)
      .eq('resume_id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return successResponse(updatedSection);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/resumes/[id]/sections/[sectionId]
 * Deletes a section belonging to the specified resume.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, sectionId } = await params;
    uuidSchema.parse(id);
    uuidSchema.parse(sectionId);

    const { user, supabase } = await requireUser();

    // Verify ownership of both resume and target section
    await verifyResumeSectionOwnership(sectionId, id, user.id);

    const { error } = await (supabase as any)
      .from('resume_sections')
      .delete()
      .eq('id', sectionId)
      .eq('resume_id', id);

    if (error) {
      throw error;
    }

    return successResponse({ deleted: true, id: sectionId });
  } catch (error) {
    return handleApiError(error);
  }
}
