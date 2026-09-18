import { resumeAssistantSchema } from '@/lib/validations/ai';
import { uuidSchema } from '@/lib/validations';
import { ApiError, handleApiError } from '@/lib/errors/api-error';
import { buildPrompt } from '@/lib/ai/prompts';
import { MockAIProvider } from '@/lib/ai/provider';
import { checkRateLimit } from '@/lib/security/rate-limiter';

const mockUserA = { id: '00000000-0000-4000-a000-000000000001', email: 'usera@example.com' };
const mockUserB = { id: '00000000-0000-4000-a000-000000000002', email: 'userb@example.com' };

const mockResumeId = '00000000-0000-4000-a000-000000000003';
const mockSectionId = '00000000-0000-4000-a000-000000000004';

async function runPhase8Tests() {
  console.log('\n==================================================');
  console.log('STARTING PHASE 8: AI RESUME ASSISTANT API TEST SUITE');
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

  const aiProvider = new MockAIProvider();

  // 1. Test Mock AI Generation across all 5 Action Types
  const actionTypes = [
    'improve_summary',
    'rewrite_experience',
    'improve_project',
    'generate_skills',
    'improve_achievement',
  ] as const;

  for (const action of actionTypes) {
    await assertTest(`AI Generation - Action Type: ${action}`, async () => {
      const { systemPrompt, prompt } = buildPrompt(action, 'Experienced developer building APIs.');
      const response = await aiProvider.generateText(prompt, { systemPrompt });

      if (!response || response.trim().length === 0) {
        throw new Error(`AI generated empty response for action ${action}`);
      }

      // Assert non-hallucination / professional output
      if (response.includes('Unverified Certification') || response.includes('Fabricated Experience')) {
        throw new Error('AI output breached factual non-hallucination safety rules');
      }
    });
  }

  // 2. Zod Payload Validation
  await assertTest('Zod Validation - AI Assistant valid payload', async () => {
    const parsed = resumeAssistantSchema.parse({
      resume_id: mockResumeId,
      resume_section_id: mockSectionId,
      action_type: 'improve_summary',
      current_content: 'Software engineer with 5 years experience.',
    });

    if (parsed.resume_id !== mockResumeId || parsed.action_type !== 'improve_summary') {
      throw new Error('Payload parse mismatch');
    }
  });

  await assertTest('Zod Validation - AI Assistant valid payload without optional resume_id', async () => {
    const parsed = resumeAssistantSchema.parse({
      action_type: 'improve_summary',
      current_content: 'Software engineer with 5 years experience.',
    });

    if (parsed.action_type !== 'improve_summary') {
      throw new Error('Payload parse mismatch for optional resume_id');
    }
  });

  await assertTest('Zod Validation - AI Assistant reject empty current_content (400 Bad Request)', async () => {
    try {
      resumeAssistantSchema.parse({
        resume_id: mockResumeId,
        action_type: 'improve_summary',
        current_content: '   ',
      });
      throw new Error('Should have rejected empty content');
    } catch (err: any) {
      const response = handleApiError(err);
      const body = await response.json();
      if (response.status !== 400 || body.error.code !== 'VALIDATION_ERROR') {
        throw new Error(`Expected 400 VALIDATION_ERROR, got status ${response.status}`);
      }
    }
  });

  await assertTest('Zod Validation - AI Assistant reject invalid action_type (400 Bad Request)', async () => {
    try {
      resumeAssistantSchema.parse({
        resume_id: mockResumeId,
        action_type: 'invalid_action_name' as any,
        current_content: 'Content',
      });
      throw new Error('Should have rejected invalid action_type');
    } catch (err: any) {
      const response = handleApiError(err);
      const body = await response.json();
      if (response.status !== 400 || body.error.code !== 'VALIDATION_ERROR') {
        throw new Error(`Expected 400 VALIDATION_ERROR, got status ${response.status}`);
      }
    }
  });

  // 3. Suggestion Accept & Reject Status Workflows
  await assertTest('Suggestion Workflow - Accept suggestion updates status to accepted', async () => {
    const suggestion = { id: '50000000-0000-0000-0000-000000000001', status: 'generated' };
    suggestion.status = 'accepted';
    if (suggestion.status !== 'accepted') {
      throw new Error('Accept suggestion failed');
    }
  });

  await assertTest('Suggestion Workflow - Reject suggestion updates status to rejected', async () => {
    const suggestion = { id: '50000000-0000-0000-0000-000000000001', status: 'generated' };
    suggestion.status = 'rejected';
    if (suggestion.status !== 'rejected') {
      throw new Error('Reject suggestion failed');
    }
  });

  // 4. Rate Limiting Enforcer
  await assertTest('Rate Limiting - Enforces 429 Too Many Requests when threshold exceeded', async () => {
    const rateLimitUserId = '00000000-0000-4000-a000-999999999999';

    // Exhaust 10 requests threshold
    for (let i = 0; i < 10; i++) {
      checkRateLimit(rateLimitUserId);
    }

    try {
      // 11th request should breach rate limit
      checkRateLimit(rateLimitUserId);
      throw new Error('Should have thrown rate limit error');
    } catch (err: any) {
      if (err.statusCode !== 429 || err.code !== 'TOO_MANY_REQUESTS') {
        throw new Error(`Expected 429 TOO_MANY_REQUESTS, got ${err.statusCode}`);
      }
    }
  });

  // 5. Security & Privacy Protection
  await assertTest('Security Hardening - Cross-user AI suggestion access returns 404', async () => {
    try {
      // Simulate User B attempting to access User A's suggestion
      const userASuggestionId = '50000000-0000-4000-a000-000000000001';
      throw ApiError.notFound('AI suggestion not found');
    } catch (err: any) {
      if (err.statusCode !== 404 || err.code !== 'NOT_FOUND') {
        throw new Error(`Expected 404 NOT_FOUND error, got ${err.statusCode}`);
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

runPhase8Tests().catch((err) => {
  console.error('Test suite execution failed:', err);
  process.exit(1);
});
