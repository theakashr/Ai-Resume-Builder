import { NextRequest } from 'next/server';
import { handleApiError, ApiError } from '@/lib/errors/api-error';
import { successResponse, createdResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { parseRequestBody, uuidSchema } from '@/lib/validations';
import { createVersionSchema } from '@/lib/validations/version';
import { verifyResumeOwnership } from '@/lib/security/resource-ownership';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/resumes/[id]/versions
 * Lists all version snapshots for the specified resume, ordered by version_number descending.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);

    const { user, supabase } = await requireUser();

    // Verify tenant ownership
    await verifyResumeOwnership(id, user.id);

    const { data: versions, error } = await (supabase as any)
      .from('resume_versions')
      .select('*')
      .eq('resume_id', id)
      .order('version_number', { ascending: false });

    if (error) {
      throw error;
    }

    return successResponse(versions || []);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/resumes/[id]/versions
 * Creates a new version snapshot capturing the current resume state and its sections.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);

    const { user, supabase } = await requireUser();

    // Verify tenant ownership
    await verifyResumeOwnership(id, user.id);

    let body: { notes?: string } = {};
    try {
      body = await parseRequestBody(request, createVersionSchema);
    } catch (err: any) {
      // Allow empty or missing request body for version snapshot creation
      if (err instanceof ApiError && err.message === 'Invalid JSON body') {
        body = {};
      } else if (err.name === 'ZodError') {
        throw err;
      }
    }

    // 1. Retrieve current resume record
    const { data: resumeRecord, error: resumeErr } = await (supabase as any)
      .from('resumes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (resumeErr || !resumeRecord) {
      throw ApiError.notFound('Resume not found');
    }

    // 2. Retrieve current sections ordered by section_order
    const { data: sectionsRecords } = await (supabase as any)
      .from('resume_sections')
      .select('*')
      .eq('resume_id', id)
      .order('section_order', { ascending: true });

    // 3. Build snapshot payload
    const snapshotPayload = {
      resume: resumeRecord,
      sections: sectionsRecords || [],
      notes: body.notes || null,
      created_at: new Date().toISOString(),
    };

    // 4. Calculate next version_number
    const { data: latestVersion } = await (supabase as any)
      .from('resume_versions')
      .select('version_number')
      .eq('resume_id', id)
      .order('version_number', { ascending: false })
      .limit(1);

    const nextVersionNumber =
      latestVersion && latestVersion.length > 0 ? latestVersion[0].version_number + 1 : 1;

    // 5. Insert new version record
    const { data: newVersion, error: insertErr } = await (supabase as any)
      .from('resume_versions')
      .insert({
        resume_id: id,
        version_number: nextVersionNumber,
        snapshot: snapshotPayload,
      })
      .select()
      .single();

    if (insertErr) {
      throw insertErr;
    }

    return createdResponse(newVersion);
  } catch (error) {
    return handleApiError(error);
  }
}
