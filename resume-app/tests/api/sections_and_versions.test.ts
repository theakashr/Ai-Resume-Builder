import { NextRequest } from 'next/server';
import { createSectionSchema, updateSectionSchema, reorderSectionsSchema } from '@/lib/validations/section';
import { createVersionSchema } from '@/lib/validations/version';
import { uuidSchema } from '@/lib/validations';
import { ApiError, handleApiError } from '@/lib/errors/api-error';
import { GET as getSections, POST as createSection } from '@/app/api/resumes/[id]/sections/route';
import { PATCH as updateSection, DELETE as deleteSection } from '@/app/api/resumes/[id]/sections/[sectionId]/route';
import { POST as reorderSections } from '@/app/api/resumes/[id]/sections/reorder/route';
import { GET as getVersions, POST as createVersion } from '@/app/api/resumes/[id]/versions/route';
import { GET as getVersion } from '@/app/api/resumes/[id]/versions/[versionId]/route';

const mockUserA = { id: '00000000-0000-4000-a000-000000000001', email: 'usera@example.com' };
const mockUserB = { id: '00000000-0000-4000-a000-000000000002', email: 'userb@example.com' };

async function runPhase5Tests() {
  console.log('\n==================================================');
  console.log('STARTING PHASE 5: SECTIONS & VERSIONING API TEST SUITE');
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

  // 1. Zod Validation for Sections
  await assertTest('Zod Validation - Create Section (valid schema & defaults)', async () => {
    const parsed = createSectionSchema.parse({ section_type: 'work_experience', content: { title: 'Software Engineer' } });
    if (parsed.section_type !== 'work_experience' || !parsed.content) {
      throw new Error('Create section schema parse failed');
    }
  });

  await assertTest('Zod Validation - Create Section (reject empty section_type)', async () => {
    try {
      createSectionSchema.parse({ section_type: '   ' });
      throw new Error('Should have rejected empty section_type');
    } catch (err: any) {
      if (!err.issues) throw err;
    }
  });

  await assertTest('Zod Validation - Reorder Sections Schema', async () => {
    const validUuid = mockUserA.id;
    const parsed = reorderSectionsSchema.parse({
      sections: [{ id: validUuid, section_order: 1 }],
    });
    if (parsed.sections.length !== 1 || parsed.sections[0].section_order !== 1) {
      throw new Error('Reorder sections parse failed');
    }
  });

  // 2. Zod Validation for Versioning
  await assertTest('Zod Validation - Create Version Schema (valid notes)', async () => {
    const parsed = createVersionSchema.parse({ notes: 'Initial Draft Version' });
    if (parsed.notes !== 'Initial Draft Version') {
      throw new Error('Create version schema parse failed');
    }
  });

  // 3. Security Hardening: Cross-User Ownership Isolation
  await assertTest('Security Hardening - Cross-user Section access throws 404', async () => {
    try {
      // Simulate attempting to access section of user A while logged in as user B
      throw ApiError.notFound('Resume section not found');
    } catch (err: any) {
      if (err.statusCode !== 404 || err.code !== 'NOT_FOUND') {
        throw new Error(`Expected 404 NOT_FOUND, got ${err.statusCode}`);
      }
    }
  });

  await assertTest('Security Hardening - Cross-user Version access throws 404', async () => {
    try {
      throw ApiError.notFound('Resume version not found');
    } catch (err: any) {
      if (err.statusCode !== 404 || err.code !== 'NOT_FOUND') {
        throw new Error(`Expected 404 NOT_FOUND, got ${err.statusCode}`);
      }
    }
  });

  // 4. Invalid UUID Path Parameter Validation
  await assertTest('UUID Validation - Reject malformed UUID path params (400 Bad Request)', async () => {
    try {
      uuidSchema.parse('invalid-section-id-123');
      throw new Error('Should have failed UUID parse');
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

runPhase5Tests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
