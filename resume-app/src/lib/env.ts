/**
 * Environment helpers for ResumeAI
 */

/**
 * Returns true when the configured Supabase URL is a known placeholder/mock value.
 */
export function isMockSupabase(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const isMockUrl = (
    url === '' ||
    url.includes('mock-supabase-id') ||
    url === 'https://mock-supabase-id.supabase.co' ||
    url.startsWith('https://placeholder')
  );

  return isMockUrl;
}

/**
 * Returns true when running in mock mode during local development or test suites.
 */
export function isMockEnvironment(): boolean {
  if (process.env.NODE_ENV === 'production') {
    // In production, mock environment is NEVER permitted.
    return false;
  }

  return (
    process.env.NODE_ENV === 'test' ||
    process.env.AI_PROVIDER === 'mock' ||
    isMockSupabase()
  );
}

/**
 * Helper that returns true when a real Gemini API key is configured.
 */
export function hasGeminiKey(): boolean {
  return !!process.env.GEMINI_API_KEY;
}
