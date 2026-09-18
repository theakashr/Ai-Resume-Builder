import fs from 'fs';
import path from 'path';

// Load .env.local manually
try {
  const envContent = fs.readFileSync(path.resolve('.env.local'), 'utf-8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const index = trimmed.indexOf('=');
      if (index !== -1) {
        const key = trimmed.substring(0, index).trim();
        const val = trimmed.substring(index + 1).trim();
        process.env[key] = val;
      }
    }
  });
} catch (e: any) {
  console.error('Failed to load env:', e.message);
}

import { createAdminClient } from './src/lib/supabase/admin';

async function test() {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase.from('resume_templates').select('*').limit(1);
    console.log('Query success:', data);
    console.log('Query error:', error);
  } catch (err: any) {
    console.error('Query thrown error:', err.message);
  }
}

test();
