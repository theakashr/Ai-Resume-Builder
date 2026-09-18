import { NextRequest } from 'next/server';
import { handleApiError } from '@/lib/errors/api-error';
import { paginatedResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { parseQueryParams } from '@/lib/validations';
import { atsQuerySchema } from '@/lib/validations/ats';
import { ATS_DISCLAIMER } from '@/lib/ats/analyzer';

/**
 * GET /api/ats/analyses
 * Lists historical ATS analysis reports belonging strictly to the authenticated user.
 */
export async function GET(request: NextRequest) {
  try {
    const { user, supabase } = await requireUser();
    const query = parseQueryParams(request.url, atsQuerySchema);

    const { page, limit, sortBy, order } = query;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: analyses, count, error } = await (supabase as any)
      .from('ats_analyses')
      .select('*, resumes(title), job_descriptions(title, company)', { count: 'exact' })
      .eq('user_id', user.id)
      .order(sortBy, { ascending: order === 'asc' })
      .range(from, to);

    if (error) {
      throw error;
    }

    return paginatedResponse(
      (analyses || []).map((a: any) => ({ ...a, disclaimer: ATS_DISCLAIMER })),
      page,
      limit,
      count || 0
    );
  } catch (error) {
    return handleApiError(error);
  }
}
