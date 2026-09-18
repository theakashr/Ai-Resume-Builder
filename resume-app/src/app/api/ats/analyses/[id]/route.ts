import { NextRequest } from 'next/server';
import { handleApiError, ApiError } from '@/lib/errors/api-error';
import { successResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { uuidSchema } from '@/lib/validations';
import { verifyAnalysisOwnership } from '@/lib/security/resource-ownership';
import { ATS_DISCLAIMER } from '@/lib/ats/analyzer';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/ats/analyses/[id]
 * Retrieves full ATS analysis details including keyword breakdown and AI recommendations.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);

    const { user, supabase } = await requireUser();

    // Enforce tenant isolation via analysis ownership check
    await verifyAnalysisOwnership(id, user.id);

    const { data: analysis, error: analysisErr } = await (supabase as any)
      .from('ats_analyses')
      .select('*, resumes(title), job_descriptions(title, company)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (analysisErr || !analysis) {
      throw ApiError.notFound('ATS analysis not found');
    }

    const { data: keywords } = await (supabase as any)
      .from('ats_keywords')
      .select('*')
      .eq('analysis_id', id);

    const { data: recommendations } = await (supabase as any)
      .from('ai_recommendations')
      .select('*')
      .eq('analysis_id', id);

    return successResponse({
      analysis,
      keywords: keywords || [],
      recommendations: recommendations || [],
      disclaimer: ATS_DISCLAIMER,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
