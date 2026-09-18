import { NextRequest } from 'next/server';
import { handleApiError } from '@/lib/errors/api-error';
import { successResponse } from '@/lib/responses';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    let dbStatus = 'healthy';
    let count = 0;

    try {
      const supabase = await createClient();
      const { count: c } = await supabase
        .from('resume_templates')
        .select('*', { count: 'exact', head: true });
      count = c || 0;
    } catch {
      dbStatus = 'configured';
    }

    return successResponse({
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        auth: 'configured',
        active_templates_count: count,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
