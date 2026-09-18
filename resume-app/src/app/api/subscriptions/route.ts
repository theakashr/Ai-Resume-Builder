import { NextRequest } from 'next/server';
import { handleApiError } from '@/lib/errors/api-error';
import { successResponse } from '@/lib/responses';
import { requireAuth } from '@/lib/auth/get-session';

export async function GET(request: NextRequest) {
  try {
    const { user, supabase } = await requireAuth();

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subError && subError.code !== 'PGRST116') {
      throw subError;
    }

    const { data: usage } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return successResponse({
      subscription: subscription || { plan_id: 'free', status: 'active' },
      usage: usage || { ats_scans_count: 0, ai_generations_count: 0, mock_interviews_count: 0 },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
