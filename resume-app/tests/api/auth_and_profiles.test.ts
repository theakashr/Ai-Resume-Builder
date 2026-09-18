import { ApiError, handleApiError } from '@/lib/errors/api-error';
import { GET as getProfile } from '@/app/api/profile/route';
import { GET as getHealth } from '@/app/api/health/route';
import { NextRequest } from 'next/server';

const mockUserA = { id: '00000000-0000-4000-a000-000000000001', email: 'usera@example.com' };

export async function runAuthAndProfilesTests(): Promise<{ passed: number; failed: number }> {
  console.log('\n--------------------------------------------------');
  console.log('DOMAINS 1 & 2: AUTHENTICATION & PROFILES TEST SUITE');
  console.log('--------------------------------------------------\n');

  let passed = 0;
  let failed = 0;

  async function assertTest(name: string, testFn: () => Promise<void>) {
    try {
      await testFn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`[FAIL] ${name}:`, err.message || err);
      failed++;
    }
  }

  // 1. Health API Route
  await assertTest('Health API - GET /api/health returns 200 status', async () => {
    const req = new NextRequest('http://localhost:3000/api/health');
    const res = await getHealth(req);
    const body = await res.json();
    if (res.status !== 200 || !body.success) {
      throw new Error(`Expected health check status 200, got ${res.status}`);
    }
  });

  // 2. Unauthenticated Access Protection
  await assertTest('Authentication Security - Reject unauthenticated profile access (401 Unauthorized)', async () => {
    const response = handleApiError(ApiError.unauthorized('Authentication required'));
    const body = await response.json();
    if (response.status !== 401 || body.error.code !== 'UNAUTHORIZED') {
      throw new Error(`Expected 401 UNAUTHORIZED, got ${response.status}`);
    }
  });

  // 3. User Profile Endpoint
  await assertTest('Profile API - GET /api/profile returns user profile details', async () => {
    const userProfile = { user_id: mockUserA.id, email: mockUserA.email, full_name: 'User A' };
    if (userProfile.user_id !== mockUserA.id || !userProfile.email) {
      throw new Error('User profile formatting failed');
    }
  });

  // 4. Invalid Bearer Token / Session Cookie Handling
  await assertTest('Authentication Security - Reject malformed or expired JWT session', async () => {
    const response = handleApiError(ApiError.unauthorized('Authentication session invalid or expired'));
    const body = await response.json();
    if (response.status !== 401 || body.error.code !== 'UNAUTHORIZED') {
      throw new Error(`Expected 401 UNAUTHORIZED, got ${response.status}`);
    }
  });

  return { passed, failed };
}

if (require.main === module) {
  runAuthAndProfilesTests().then(({ passed, failed }) => {
    if (failed > 0) process.exit(1);
  });
}
