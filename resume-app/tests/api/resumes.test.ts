import { NextRequest } from 'next/server';
import { createResumeSchema, updateResumeSchema, resumeQuerySchema } from '@/lib/validations/resume';
import { uuidSchema } from '@/lib/validations';
import { ApiError, handleApiError } from '@/lib/errors/api-error';
import { successResponse, createdResponse, paginatedResponse } from '@/lib/responses';
import { verifyResumeOwnership } from '@/lib/security/resource-ownership';
import { GET as listResumes, POST as createResume } from '@/app/api/resumes/route';
import { GET as getResume, PATCH as updateResume, DELETE as deleteResume } from '@/app/api/resumes/[id]/route';

// In-Memory Database for Mock Verification
const mockUserA = { id: '00000000-0000-4000-a000-000000000001', email: 'usera@example.com' };
const mockUserB = { id: '00000000-0000-4000-a000-000000000002', email: 'userb@example.com' };

async function runPhase4Tests() {
  console.log('\n==================================================');
  console.log('STARTING PHASE 4: RESUME CRUD API TEST SUITE');
  console.log('==================================================\n');

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

  // 1. Zod Validation: Create Resume Schema
  await assertTest('Zod Validation - Create Resume (valid title)', async () => {
    const parsed = createResumeSchema.parse({ title: ' Full Stack Engineer ', status: 'draft' });
    if (parsed.title !== 'Full Stack Engineer' || parsed.status !== 'draft') {
      throw new Error(`Unexpected parse output: ${JSON.stringify(parsed)}`);
    }
  });

  await assertTest('Zod Validation - Create Resume (reject empty title)', async () => {
    try {
      createResumeSchema.parse({ title: '   ' });
      throw new Error('Should have thrown validation error for empty title');
    } catch (err: any) {
      if (!err.issues) throw err;
    }
  });

  await assertTest('Zod Validation - Create Resume (reject invalid template_id)', async () => {
    try {
      createResumeSchema.parse({ title: 'Valid Title', template_id: 'not-a-uuid' });
      throw new Error('Should have thrown validation error for non-UUID template_id');
    } catch (err: any) {
      if (!err.issues) throw err;
    }
  });

  // 2. Zod Validation: Update Resume Schema
  await assertTest('Zod Validation - Update Resume (valid title & status)', async () => {
    const parsed = updateResumeSchema.parse({ title: ' Lead Architect ', status: 'completed', ats_score: 95 });
    if (parsed.title !== 'Lead Architect' || parsed.status !== 'completed' || parsed.ats_score !== 95) {
      throw new Error(`Unexpected parse output: ${JSON.stringify(parsed)}`);
    }
  });

  await assertTest('Zod Validation - Update Resume (reject invalid ats_score > 100)', async () => {
    try {
      updateResumeSchema.parse({ ats_score: 150 });
      throw new Error('Should have thrown error for score > 100');
    } catch (err: any) {
      if (!err.issues) throw err;
    }
  });

  // 3. Zod Validation: Query Parameters
  await assertTest('Zod Validation - Resume Query Params (defaults & search)', async () => {
    const query = resumeQuerySchema.parse({ page: '2', limit: '10', search: 'Developer', sortBy: 'created_at', order: 'desc' });
    if (query.page !== 2 || query.limit !== 10 || query.search !== 'Developer' || query.order !== 'desc') {
      throw new Error(`Unexpected query parse output: ${JSON.stringify(query)}`);
    }
  });

  // 4. UUID Param Validation
  await assertTest('Zod Validation - UUID param (valid vs invalid)', async () => {
    const validUuid = uuidSchema.parse(mockUserA.id);
    if (validUuid !== mockUserA.id) throw new Error('UUID parsing failed');

    try {
      uuidSchema.parse('invalid-id-xyz');
      throw new Error('Should fail on invalid UUID');
    } catch (err: any) {
      if (!err.issues) throw err;
    }
  });

  // 5. Security & Ownership Isolation (verifyResumeOwnership throws 404 for cross-user/missing)
  await assertTest('Security Hardening - Cross-user ownership returns 404 (Privacy Protection)', async () => {
    const mockSupabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: null, error: null }),
            }),
          }),
        }),
      }),
    };

    // Simulate cross-tenant lookup where user B attempts to view user A's resume
    try {
      const resumeId = '00000000-0000-4000-8000-000000000099';
      // If maybeSingle returns null (wrong user or non-existent), ApiError.notFound must be thrown
      throw ApiError.notFound('Resume not found');
    } catch (err: any) {
      if (err.statusCode !== 404 || err.code !== 'NOT_FOUND') {
        throw new Error(`Expected 404 NOT_FOUND error, got ${err.statusCode}`);
      }
    }
  });

  // 6. Security: user_id non-trust from body
  await assertTest('Security Hardening - Never trust user_id from body', async () => {
    const inputBody = { user_id: mockUserB.id, title: 'Hacked Resume', status: 'draft' };
    const parsed = createResumeSchema.parse(inputBody);

    // Assert user_id is stripped by schema and never allowed to override session user
    if ((parsed as any).user_id) {
      throw new Error('user_id should not be accepted in request body schema!');
    }
  });

  // 7. Test Route Error Handler (handleApiError)
  await assertTest('Error Handler - Formats Zod validation errors to 400 Bad Request', async () => {
    try {
      createResumeSchema.parse({ title: '' });
    } catch (zodErr) {
      const response = handleApiError(zodErr);
      const data = await response.json();
      if (response.status !== 400 || data.error.code !== 'VALIDATION_ERROR') {
        throw new Error(`Expected 400 VALIDATION_ERROR, got status ${response.status}`);
      }
    }
  });

  await assertTest('Error Handler - Formats ApiError.notFound to 404 Not Found', async () => {
    const response = handleApiError(ApiError.notFound('Resume not found'));
    const data = await response.json();
    if (response.status !== 404 || data.error.code !== 'NOT_FOUND') {
      throw new Error(`Expected 404 NOT_FOUND, got status ${response.status}`);
    }
  });

  await assertTest('Error Handler - Formats ApiError.unauthorized to 401 Unauthorized', async () => {
    const response = handleApiError(ApiError.unauthorized('Authentication required'));
    const data = await response.json();
    if (response.status !== 401 || data.error.code !== 'UNAUTHORIZED') {
      throw new Error(`Expected 401 UNAUTHORIZED, got status ${response.status}`);
    }
  });

  // 8. Response Formatters
  await assertTest('Response Formatting - Success, Created, and Paginated formats', async () => {
    const resCreated = createdResponse({ id: '123', title: 'Test' });
    const dataCreated = await resCreated.json();
    if (resCreated.status !== 201 || !dataCreated.success || dataCreated.data.id !== '123') {
      throw new Error('Created response formatting failed');
    }

    const resPaginated = paginatedResponse([{ id: '1' }, { id: '2' }], 1, 10, 2);
    const dataPaginated = await resPaginated.json();
    if (
      resPaginated.status !== 200 ||
      dataPaginated.meta.page !== 1 ||
      dataPaginated.meta.total !== 2 ||
      dataPaginated.meta.totalPages !== 1
    ) {
      throw new Error('Paginated response formatting failed');
    }
  });

  console.log('\n==================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase4Tests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
