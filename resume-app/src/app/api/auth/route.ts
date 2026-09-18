import { NextRequest } from 'next/server';
import { handleApiError } from '@/lib/errors/api-error';
import { successResponse } from '@/lib/responses';
import { getCurrentUser } from '@/lib/auth/get-session';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    return successResponse({
      authenticated: !!user,
      user: user
        ? {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
          }
        : null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
