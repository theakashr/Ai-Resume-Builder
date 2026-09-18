import { NextRequest } from 'next/server';
import { handleApiError } from '@/lib/errors/api-error';
import { createdResponse, paginatedResponse } from '@/lib/responses';
import { requireUser } from '@/lib/auth/get-session';
import { parseRequestBody, parseQueryParams } from '@/lib/validations';
import { createJobSchema, jobQuerySchema } from '@/lib/validations/job';

/**
 * GET /api/jobs
 * Lists saved job descriptions belonging strictly to the authenticated user.
 */
export async function GET(request: NextRequest) {
  try {
    const { user, supabase } = await requireUser();
    const query = parseQueryParams(request.url, jobQuerySchema);

    const { page, limit, search, sortBy, order } = query;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let dbQuery = (supabase as any)
      .from('job_descriptions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);

    // Apply search filter (matches title or company)
    if (search) {
      dbQuery = dbQuery.or(`title.ilike.%${search}%,company.ilike.%${search}%`);
    }

    // Apply sorting & pagination
    dbQuery = dbQuery.order(sortBy, { ascending: order === 'asc' }).range(from, to);

    const { data: jobs, count, error } = await dbQuery;

    if (error) {
      throw error;
    }

    return paginatedResponse(jobs || [], page, limit, count || 0);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/jobs
 * Creates a new target job description for the authenticated user.
 */
export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await requireUser();
    const body = await parseRequestBody(request, createJobSchema);

    // Security: user_id is strictly derived from the authenticated user session
    const { data: newJob, error } = await (supabase as any)
      .from('job_descriptions')
      .insert({
        user_id: user.id,
        title: body.title,
        company: body.company,
        description: body.description,
        source_url: body.source_url || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return createdResponse(newJob);
  } catch (error) {
    return handleApiError(error);
  }
}
