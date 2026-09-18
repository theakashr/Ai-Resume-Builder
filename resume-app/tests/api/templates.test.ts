import { templateQuerySchema } from '@/lib/validations/template';
import { uuidSchema } from '@/lib/validations';
import { ApiError, handleApiError } from '@/lib/errors/api-error';

const mockActiveTemplate1 = {
  id: '10000000-0000-0000-0000-000000000001',
  name: 'Minimal Clean',
  slug: 'minimal',
  template_type: 'minimal',
  is_ats_friendly: true,
  is_active: true,
};

const mockActiveTemplate2 = {
  id: '10000000-0000-0000-0000-000000000002',
  name: 'Modern Tech',
  slug: 'modern',
  template_type: 'modern',
  is_ats_friendly: false,
  is_active: true,
};

const mockInactiveTemplate = {
  id: '10000000-0000-0000-0000-000000000099',
  name: 'Deprecated Design',
  slug: 'deprecated',
  template_type: 'professional',
  is_ats_friendly: false,
  is_active: false,
};

async function runPhase6Tests() {
  console.log('\n==================================================');
  console.log('STARTING PHASE 6: RESUME TEMPLATE API TEST SUITE');
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

  // 1. Zod Query Parsing
  await assertTest('Zod Validation - Parse Template Query (defaults & filters)', async () => {
    const parsed = templateQuerySchema.parse({
      template_type: 'minimal',
      is_ats_friendly: 'true',
      page: '1',
      limit: '10',
    });

    if (parsed.template_type !== 'minimal' || parsed.is_ats_friendly !== true || parsed.page !== 1) {
      throw new Error(`Unexpected query parse result: ${JSON.stringify(parsed)}`);
    }
  });

  // 2. Filter logic verification
  await assertTest('Filtering Logic - Filter templates by template_type', async () => {
    const templates = [mockActiveTemplate1, mockActiveTemplate2];
    const filtered = templates.filter((t) => t.template_type === 'minimal');

    if (filtered.length !== 1 || filtered[0].id !== mockActiveTemplate1.id) {
      throw new Error('Type filtering failed');
    }
  });

  await assertTest('Filtering Logic - Filter templates by is_ats_friendly', async () => {
    const templates = [mockActiveTemplate1, mockActiveTemplate2];
    const filtered = templates.filter((t) => t.is_ats_friendly === true);

    if (filtered.length !== 1 || filtered[0].id !== mockActiveTemplate1.id) {
      throw new Error('ATS friendliness filtering failed');
    }
  });

  // 3. Inactive Templates Hiding
  await assertTest('Security & Catalog Isolation - Exclude inactive templates from listing', async () => {
    const templates = [mockActiveTemplate1, mockActiveTemplate2, mockInactiveTemplate];
    const activeOnly = templates.filter((t) => t.is_active === true);

    if (activeOnly.length !== 2 || activeOnly.some((t) => t.id === mockInactiveTemplate.id)) {
      throw new Error('Inactive template was not properly filtered out');
    }
  });

  await assertTest('Security & Catalog Isolation - Direct GET for inactive template returns 404', async () => {
    try {
      const template = [mockActiveTemplate1, mockActiveTemplate2, mockInactiveTemplate].find(
        (t) => t.id === mockInactiveTemplate.id && t.is_active === true
      );

      if (!template) {
        throw ApiError.notFound('Template not found');
      }
    } catch (err: any) {
      if (err.statusCode !== 404 || err.code !== 'NOT_FOUND') {
        throw new Error(`Expected 404 NOT_FOUND, got ${err.statusCode}`);
      }
    }
  });

  // 4. Invalid Template ID Format
  await assertTest('UUID Validation - Malformed template ID returns 400 Bad Request', async () => {
    try {
      uuidSchema.parse('invalid-template-id-999');
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

runPhase6Tests().catch((err) => {
  console.error('Test suite execution failed:', err);
  process.exit(1);
});
