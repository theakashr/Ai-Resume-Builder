import { NextRequest } from 'next/server';
import { handleApiError } from '@/lib/errors/api-error';
import { successResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { parseRequestBody, uuidSchema } from '@/lib/validations';
import { reorderSectionsSchema } from '@/lib/validations/section';
import { verifyResumeOwnership, verifyResumeSectionOwnership } from '@/lib/security/resource-ownership';

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function handleReorder(request: NextRequest, id: string) {
  uuidSchema.parse(id);

  const { user, supabase } = await requireUser();

  // Enforce tenant isolation
  await verifyResumeOwnership(id, user.id);

  const body = await parseRequestBody(request, reorderSectionsSchema);

  // Verify ownership for all requested sections before mutating
  for (const sectionItem of body.sections) {
    await verifyResumeSectionOwnership(sectionItem.id, id, user.id);
  }

  // Update order for each section
  const updates = body.sections.map(async (item) => {
    return (supabase as any)
      .from('resume_sections')
      .update({ section_order: item.section_order })
      .eq('id', item.id)
      .eq('resume_id', id);
  });

  await Promise.all(updates);

  // Return updated list of sections sorted by section_order
  const { data: updatedSections } = await (supabase as any)
    .from('resume_sections')
    .select('*')
    .eq('resume_id', id)
    .order('section_order', { ascending: true });

  return successResponse({
    reordered: true,
    sections: updatedSections || [],
  });
}

/**
 * POST /api/resumes/[id]/sections/reorder
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    return await handleReorder(request, id);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/resumes/[id]/sections/reorder
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    return await handleReorder(request, id);
  } catch (error) {
    return handleApiError(error);
  }
}
