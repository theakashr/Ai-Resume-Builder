// Inspect environment variables
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present (masked)' : 'Missing');
console.log('SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present (masked)' : 'Missing');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Present (masked)' : 'Missing');
console.log('All env keys containing SUPABASE or NEXT_PUBLIC:');
Object.keys(process.env).forEach((key) => {
  if (key.includes('SUPABASE') || key.includes('NEXT_PUBLIC')) {
    console.log(`  ${key}: ${process.env[key]}`);
  }
});
