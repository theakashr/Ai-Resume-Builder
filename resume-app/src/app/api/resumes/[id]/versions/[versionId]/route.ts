import { NextRequest } from 'next/server';
import { handleApiError, ApiError } from '@/lib/errors/api-error';
import { successResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { uuidSchema } from '@/lib/validations';
import { verifyResumeVersionOwnership } from '@/lib/security/resource-ownership';

interface RouteParams {
  params: Promise<{ id: string; versionId: string }>;
}

/**
 * GET /api/resumes/[id]/versions/[versionId]
 * Retrieves a specific version snapshot belonging to the specified resume.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, versionId } = await params;
    uuidSchema.parse(id);
    uuidSchema.parse(versionId);

    const { user, supabase } = await requireUser();

    // Enforce tenant isolation via version ownership verification
    await verifyResumeVersionOwnership(versionId, id, user.id);

    const { data: version, error } = await (supabase as any)
      .from('resume_versions')
      .select('*')
      .eq('id', versionId)
      .eq('resume_id', id)
      .single();

    if (error || !version) {
      throw ApiError.notFound('Resume version not found');
    }

    return successResponse(version);
  } catch (error) {
    return handleApiError(error);
  }
}
