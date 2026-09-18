import { NextRequest } from 'next/server';
import { handleApiError } from '@/lib/errors/api-error';
import { successResponse } from '@/lib/responses';
import { requireAuth } from '@/lib/auth/get-session';

export async function GET(request: NextRequest) {
  try {
    const { user, supabase } = await requireAuth();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return successResponse(profile || { user_id: user.id, email: user.email });
  } catch (error) {
    return handleApiError(error);
  }
}
