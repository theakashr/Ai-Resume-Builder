import { NextRequest } from 'next/server';
import { handleApiError, ApiError } from '@/lib/errors/api-error';
import { successResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { parseRequestBody, uuidSchema } from '@/lib/validations';
import { updateJobSchema } from '@/lib/validations/job';
import { verifyJobDescriptionOwnership } from '@/lib/security/resource-ownership';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/jobs/[id]
 * Retrieves details for a specific job description belonging strictly to the authenticated user.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);

    const { user, supabase } = await requireUser();

    // Fetch job description with user_id tenant isolation
    const { data: job, error } = await (supabase as any)
      .from('job_descriptions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !job) {
      // Throw 404 to avoid exposing resource existence to unauthorized callers
      throw ApiError.notFound('Job description not found');
    }

    return successResponse(job);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/jobs/[id]
 * Updates an existing job description belonging to the authenticated user.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);

    const { user, supabase } = await requireUser();

    // Verify ownership before mutating
    await verifyJobDescriptionOwnership(id, user.id);

    const body = await parseRequestBody(request, updateJobSchema);

    const updatePayload = {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.company !== undefined ? { company: body.company } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.source_url !== undefined ? { source_url: body.source_url } : {}),
    };

    const { data: updatedJob, error } = await (supabase as any)
      .from('job_descriptions')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return successResponse(updatedJob);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/jobs/[id]
 * Deletes a job description belonging to the authenticated user.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);

    const { user, supabase } = await requireUser();

    // Verify ownership before deleting
    await verifyJobDescriptionOwnership(id, user.id);

    const { error } = await (supabase as any)
      .from('job_descriptions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return successResponse({ deleted: true, id });
  } catch (error) {
    return handleApiError(error);
  }
}
