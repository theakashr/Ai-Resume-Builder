import { createClient } from '@/lib/supabase/server';
import { ApiError } from '@/lib/errors/api-error';
import { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { isMockSupabase } from '@/lib/env';

/**
 * Returns the currently authenticated user or session.
 * Supports active cookie sessions (Firebase/local auth) and Supabase sessions.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    // 1. Check for active user session cookie set by real login/signup/Firebase Auth
    const cookieStore = await cookies();
    const activeSessionCookie = cookieStore.get('active_user_session')?.value || cookieStore.get('mock-user')?.value;
    if (activeSessionCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(activeSessionCookie));
        if (parsed && (parsed.id || parsed.uid)) {
          const userId = parsed.id || parsed.uid;
          const userEmail = parsed.email || '';
          const fullName = parsed.fullName || parsed.full_name || (userEmail ? userEmail.split('@')[0] : 'User');

          return {
            id: userId,
            email: userEmail,
            user_metadata: {
              full_name: fullName,
              avatar_url: parsed.avatarUrl || '',
            },
            created_at: new Date().toISOString(),
            app_metadata: {},
            aud: 'authenticated',
            role: 'authenticated',
          } as any as User;
        }
      } catch {
        // Cookie parse fallback
      }
    }

    // 2. Try Supabase Auth if configured
    if (!isMockSupabase()) {
      try {
        const supabase = await createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (user && !error) {
          return user;
        }
      } catch {
        // Ignore Supabase fetch errors
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Returns the currently authenticated user ID or null.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user ? user.id : null;
}

/**
 * Requires an authenticated user session. Throws 401 ApiError if unauthenticated.
 */
export async function requireUser(): Promise<{ user: User; supabase: Awaited<ReturnType<typeof createClient>> }> {
  const user = await getCurrentUser();
  const supabase = await createClient();

  if (!user) {
    throw ApiError.unauthorized('Authentication session invalid or expired');
  }

  return { user, supabase };
}

/**
 * Requires an authenticated user ID. Throws 401 ApiError if unauthenticated.
 */
export async function requireUserId(): Promise<string> {
  const { user } = await requireUser();
  return user.id;
}

// Alias for backwards compatibility
export const requireAuth = requireUser;
