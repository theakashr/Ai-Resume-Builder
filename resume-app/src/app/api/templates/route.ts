import { NextRequest } from 'next/server';
import { handleApiError } from '@/lib/errors/api-error';
import { paginatedResponse } from '@/lib/responses';
import { createClient } from '@/lib/supabase/server';
import { parseQueryParams } from '@/lib/validations';
import { templateQuerySchema } from '@/lib/validations/template';

/**
 * GET /api/templates
 * Lists active resume templates with filtering by template_type, is_ats_friendly, search, sorting, and pagination.
 * System-managed & read-only for client applications.
 */
export async function GET(request: NextRequest) {
  try {
    const query = parseQueryParams(request.url, templateQuerySchema);
    const { page, limit, template_type, is_ats_friendly, search, sortBy, order } = query;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = await createClient();

    let dbQuery = (supabase as any)
      .from('resume_templates')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    // Apply template_type filter
    if (template_type) {
      dbQuery = dbQuery.eq('template_type', template_type);
    }

    // Apply is_ats_friendly filter
    if (is_ats_friendly !== undefined) {
      dbQuery = dbQuery.eq('is_ats_friendly', is_ats_friendly);
    }

    // Apply search filter
    if (search) {
      dbQuery = dbQuery.ilike('name', `%${search}%`);
    }

    // Apply sorting & pagination
    dbQuery = dbQuery.order(sortBy, { ascending: order === 'asc' }).range(from, to);

    const { data: templates, count, error } = await dbQuery;

    if (error) {
      throw error;
    }

    return paginatedResponse(templates || [], page, limit, count || 0);
  } catch (error) {
    return handleApiError(error);
  }
}
