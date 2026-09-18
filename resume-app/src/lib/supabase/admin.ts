import { createServerClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

/**
 * Server-only Admin Client using SUPABASE_SERVICE_ROLE_KEY.
 * WARNING: NEVER import or expose this file in client-side components.
 */
export async function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new Error('SECURITY VIOLATION: Admin Supabase Client cannot be instantiated on the browser/client.');
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.');
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // No-op for admin operations
        },
      },
    }
  );
}
