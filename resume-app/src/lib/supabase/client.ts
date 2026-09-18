import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase-id.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vY2siLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwOTQ1OTIwMCwiZXhwIjoyMDE1MDI1MjAwfQ.mock-anon-key-placeholder';

export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
