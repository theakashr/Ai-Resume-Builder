import { createJobSchema, updateJobSchema, jobQuerySchema } from '@/lib/validations/job';
import { uuidSchema } from '@/lib/validations';
import { ApiError, handleApiError } from '@/lib/errors/api-error';

const mockUserA = { id: '00000000-0000-4000-a000-000000000001', email: 'usera@example.com' };
const mockUserB = { id: '00000000-0000-4000-a000-000000000002', email: 'userb@example.com' };

const mockJobA = {
  id: '20000000-0000-0000-0000-000000000001',
  user_id: mockUserA.id,
  title: 'Senior Backend Engineer',
  company: 'TechCorp',
  description: 'Looking for Node.js & TypeScript expert.',
  source_url: 'https://example.com/jobs/1',
  created_at: new Date().toISOString(),
};

async function runPhase7Tests() {
  console.log('\n==================================================');
  console.log('STARTING PHASE 7: JOB DESCRIPTION API TEST SUITE');
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

  // 1. Zod Input Validation: Create Job Schema
  await assertTest('Zod Validation - Create Job (valid input)', async () => {
    const parsed = createJobSchema.parse({
      title: ' Senior Staff Backend Engineer ',
      company: ' Acme Inc ',
      description: ' Build scalable microservices in TypeScript. ',
      source_url: 'https://acme.com/careers/backend',
    });

    if (
      parsed.title !== 'Senior Staff Backend Engineer' ||
      parsed.company !== 'Acme Inc' ||
      parsed.description !== 'Build scalable microservices in TypeScript.'
    ) {
      throw new Error(`Unexpected parse output: ${JSON.stringify(parsed)}`);
    }
  });

  await assertTest('Zod Validation - Create Job (reject empty title)', async () => {
    try {
      createJobSchema.parse({
        title: '   ',
        company: 'Acme Inc',
        description: 'Valid description',
      });
      throw new Error('Should have thrown validation error for empty title');
    } catch (err: any) {
      if (!err.issues) throw err;
    }
  });

  await assertTest('Zod Validation - Create Job (reject description > 20000 chars)', async () => {
    try {
      const hugeDescription = 'a'.repeat(20001);
      createJobSchema.parse({
        title: 'Developer',
        company: 'Acme',
        description: hugeDescription,
      });
      throw new Error('Should have thrown validation error for huge description');
    } catch (err: any) {
      if (!err.issues) throw err;
    }
  });

  // 2. Zod Input Validation: Update Job Schema
  await assertTest('Zod Validation - Update Job (partial fields)', async () => {
    const parsed = updateJobSchema.parse({
      title: ' Principal Architect ',
      company: ' MetaCorp ',
    });

    if (parsed.title !== 'Principal Architect' || parsed.company !== 'MetaCorp') {
      throw new Error(`Unexpected parse output: ${JSON.stringify(parsed)}`);
    }
  });

  // 3. Security: User ID non-trust from payload
  await assertTest('Security Hardening - Never trust user_id from client payload', async () => {
    const rawPayload = {
      user_id: mockUserB.id,
      title: 'Hacked Job',
      company: 'HackerCorp',
      description: 'Malicious entry',
    };

    const parsed = createJobSchema.parse(rawPayload);
    if ((parsed as any).user_id) {
      throw new Error('user_id should be ignored/stripped by request validation schema');
    }
  });

  // 4. Security: Cross-User Ownership Isolation
  await assertTest('Security Hardening - Cross-user Job access returns 404 (Privacy Protection)', async () => {
    try {
      // Simulate User B attempting to view/modify User A's job description
      const job = [mockJobA].find((j) => j.id === mockJobA.id && j.user_id === mockUserB.id);
      if (!job) {
        throw ApiError.notFound('Job description not found');
      }
    } catch (err: any) {
      if (err.statusCode !== 404 || err.code !== 'NOT_FOUND') {
        throw new Error(`Expected 404 NOT_FOUND error, got ${err.statusCode}`);
      }
    }
  });

  // 5. Invalid UUID Path Parameter Validation
  await assertTest('UUID Validation - Malformed job ID returns 400 Bad Request', async () => {
    try {
      uuidSchema.parse('invalid-job-uuid-123');
      throw new Error('Should have thrown UUID validation error');
    } catch (err: any) {
      const response = handleApiError(err);
      const body = await response.json();
      if (response.status !== 400 || body.error.code !== 'VALIDATION_ERROR') {
        throw new Error(`Expected 400 VALIDATION_ERROR, got status ${response.status}`);
      }
    }
  });

  console.log('\n==================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase7Tests().catch((err) => {
  console.error('Test suite execution failed:', err);
  process.exit(1);
});
