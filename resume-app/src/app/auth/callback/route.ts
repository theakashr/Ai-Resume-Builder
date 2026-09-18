import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Validates that a redirect path is a safe internal relative path.
 * Prevents open-redirect vulnerabilities (Phase 12).
 */
function isSafeRedirectPath(path: string): boolean {
  if (!path || typeof path !== 'string') return false;
  // Must start with / but NOT with // (protocol-relative URL attack)
  if (!path.startsWith('/') || path.startsWith('//')) return false;
  // Must not contain any protocol indicators
  if (/^\/[^/]/.test(path) === false) return false;
  // Reject anything that looks like an external URL
  if (path.toLowerCase().includes('://')) return false;
  return true;
}

/**
 * OAuth callback handler for Supabase Google auth (Phase 4).
 *
 * Flow:
 *   Google → Supabase → GET /auth/callback?code=xxx&next=/dashboard
 *     → exchangeCodeForSession
 *     → upsert profile (Phase 5 & 6)
 *     → redirect to /dashboard (or safe `next` param)
 *
 * Failures → /login?error=google_auth_failed
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code  = searchParams.get('code');
  const next  = searchParams.get('next') ?? '/dashboard';
  const oauthError = searchParams.get('error');

  // Handle provider-level OAuth errors (e.g. user cancelled) — Phase 13
  if (oauthError) {
    console.error('[OAuth Callback] Provider error:', oauthError, searchParams.get('error_description'));
    return NextResponse.redirect(`${origin}/login?error=google_auth_failed`);
  }

  // Missing authorization code
  if (!code) {
    console.error('[OAuth Callback] No authorization code received');
    return NextResponse.redirect(`${origin}/login?error=google_auth_failed`);
  }

  // Validate `next` param — prevent open redirect (Phase 12)
  const safeNext = isSafeRedirectPath(next) ? next : '/dashboard';

  try {
    const supabase = await createClient();

    // Exchange the authorization code for a session (Phase 4, step 2)
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError || !data?.user) {
      console.error('[OAuth Callback] Session exchange failed:', exchangeError?.message ?? 'No user returned');
      return NextResponse.redirect(`${origin}/login?error=google_auth_failed`);
    }

    const user = data.user;

    // Extract Google profile metadata (Phase 5)
    // Name priority: full_name → name → email username → 'ResumeAI User' (Phase 6)
    const googleName: string =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      (user.email ? user.email.split('@')[0] : null) ||
      'ResumeAI User';

    const avatarUrl: string | null =
      user.user_metadata?.avatar_url || null;

    // Phase 5 & 6: Profile creation / synchronization
    // Check if a profile already exists for this user
    // Note: (supabase as any) — same pattern as signup/page.tsx; Supabase type inference
    // returns `never` for .from() when mock URL is configured in @supabase/ssr 0.12.4.
    const { data: existingProfile, error: fetchErr } = await (supabase as any)
      .from('profiles')
      .select('user_id, full_name')
      .eq('user_id', user.id)
      .maybeSingle();

    if (fetchErr) {
      // Log but don't block — auth succeeded, profile sync is non-critical
      console.error('[OAuth Callback] Profile fetch error:', fetchErr.message);
    }

    if (!existingProfile) {
      // ── First Google login — create profile with Google metadata (Phase 5) ──
      const { error: insertErr } = await (supabase as any)
        .from('profiles')
        .insert({
          user_id:           user.id,
          email:             user.email ?? null,
          full_name:         googleName,          // Initial value from Google
          profile_image_url: avatarUrl,           // Phase 7 — schema already has this column
          updated_at:        new Date().toISOString(),
        });

      if (insertErr) {
        // Profile creation failed — log but continue (auth session is valid)
        console.error('[OAuth Callback] Profile insert failed:', insertErr.message);
      }
    } else {
      // ── Subsequent Google login — only sync email + timestamp (Phase 6) ──
      // DO NOT overwrite full_name or profile_image_url — user may have edited them
      const { error: updateErr } = await (supabase as any)
        .from('profiles')
        .update({
          email:      user.email ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateErr) {
        console.error('[OAuth Callback] Profile update failed:', updateErr.message);
      }
    }

    // Redirect to destination — session cookie is already set by exchangeCodeForSession
    return NextResponse.redirect(`${origin}${safeNext}`);

  } catch (err: unknown) {
    // Catch-all — never expose raw errors to client (Phase 13)
    console.error('[OAuth Callback] Unexpected error:', err instanceof Error ? err.message : String(err));
    return NextResponse.redirect(`${origin}/login?error=google_auth_failed`);
  }
}
