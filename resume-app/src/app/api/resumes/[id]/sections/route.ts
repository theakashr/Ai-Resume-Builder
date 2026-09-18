import { NextRequest } from 'next/server';
import { handleApiError } from '@/lib/errors/api-error';
import { successResponse, createdResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { parseRequestBody, uuidSchema } from '@/lib/validations';
import { createSectionSchema } from '@/lib/validations/section';
import { verifyResumeOwnership } from '@/lib/security/resource-ownership';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/resumes/[id]/sections
 * Returns all sections for the resume, ordered strictly by section_order ascending.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);

    const { user, supabase } = await requireUser();

    // Enforce tenant isolation via ownership verification
    await verifyResumeOwnership(id, user.id);

    const { data: sections, error } = await (supabase as any)
      .from('resume_sections')
      .select('*')
      .eq('resume_id', id)
      .order('section_order', { ascending: true });

    if (error) {
      throw error;
    }

    return successResponse(sections || []);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/resumes/[id]/sections
 * Creates a new section for the specified resume.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);

    const { user, supabase } = await requireUser();

    // Enforce tenant isolation via ownership verification
    await verifyResumeOwnership(id, user.id);

    const body = await parseRequestBody(request, createSectionSchema);

    // If section_order is not explicitly specified, calculate next order index
    let sectionOrder = body.section_order;
    if (sectionOrder === undefined) {
      const { data: existingSections } = await (supabase as any)
        .from('resume_sections')
        .select('section_order')
        .eq('resume_id', id)
        .order('section_order', { ascending: false })
        .limit(1);

      sectionOrder = existingSections && existingSections.length > 0 ? existingSections[0].section_order + 1 : 0;
    }

    const { data: newSection, error } = await (supabase as any)
      .from('resume_sections')
      .insert({
        resume_id: id,
        section_type: body.section_type,
        section_order: sectionOrder,
        content: body.content || {},
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return createdResponse(newSection);
  } catch (error) {
    return handleApiError(error);
  }
}
