import { NextRequest } from 'next/server';
import { handleApiError, ApiError } from '@/lib/errors/api-error';
import { successResponse } from '@/lib/responses';
import { createClient } from '@/lib/supabase/server';
import { uuidSchema } from '@/lib/validations';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/templates/[id]
 * Retrieves details for a specific active resume template by ID.
 * System-managed & read-only for client applications.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    uuidSchema.parse(id);

    const supabase = await createClient();

    // Query active template strictly by ID
    const { data: template, error } = await (supabase as any)
      .from('resume_templates')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !template) {
      throw ApiError.notFound('Template not found');
    }

    return successResponse(template);
  } catch (error) {
    return handleApiError(error);
  }
}
