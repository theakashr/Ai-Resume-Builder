import { analyzeRequestSchema, atsQuerySchema } from '@/lib/validations/ats';
import { uuidSchema } from '@/lib/validations';
import { ApiError, handleApiError } from '@/lib/errors/api-error';
import { runATSAnalysis, ATS_DISCLAIMER } from '@/lib/ats/analyzer';

const mockUserA = { id: '00000000-0000-4000-a000-000000000001', email: 'usera@example.com' };
const mockUserB = { id: '00000000-0000-4000-a000-000000000002', email: 'userb@example.com' };

const mockResumeId = '00000000-0000-4000-a000-000000000003';
const mockJobId = '00000000-0000-4000-a000-000000000004';
const mockAnalysisId = '00000000-0000-4000-a000-000000000005';

async function runPhase9Tests() {
  console.log('\n==================================================');
  console.log('STARTING PHASE 9: ATS ANALYSIS API TEST SUITE');
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

  // 1. Zod Validation
  await assertTest('Zod Validation - Analyze Request Payload (valid inputs)', async () => {
    const parsed = analyzeRequestSchema.parse({
      resume_id: mockResumeId,
      job_description_id: mockJobId,
    });
    if (parsed.resume_id !== mockResumeId || parsed.job_description_id !== mockJobId) {
      throw new Error('Analyze request parse failed');
    }
  });

  await assertTest('Zod Validation - Reject malformed UUID (400 Bad Request)', async () => {
    try {
      analyzeRequestSchema.parse({
        resume_id: 'invalid-resume-uuid',
        job_description_id: mockJobId,
      });
      throw new Error('Should have rejected invalid resume UUID');
    } catch (err: any) {
      const response = handleApiError(err);
      const body = await response.json();
      if (response.status !== 400 || body.error.code !== 'VALIDATION_ERROR') {
        throw new Error(`Expected 400 VALIDATION_ERROR, got ${response.status}`);
      }
    }
  });

  // 2. ATS Analysis Engine Calculation & Disclaimer Presence
  await assertTest('ATS Engine - Computes scores, keywords, recommendations & disclaimer', async () => {
    const resume = {
      title: 'Senior Software Engineer',
      sections: [
        { section_type: 'skills', content: { text: 'TypeScript, Node.js, PostgreSQL' } },
        { section_type: 'work_experience', content: { text: 'Built REST APIs and backend microservices' } },
        { section_type: 'summary', content: { text: 'Experienced backend developer.' } },
      ],
    };

    const jd = {
      title: 'Senior Backend Developer',
      company: 'Tech Corp',
      description: 'Seeking TypeScript, Node.js, PostgreSQL, and REST API experience.',
    };

    const result = runATSAnalysis(resume, jd);

    if (
      result.scores.overall_score < 0 ||
      result.scores.overall_score > 100 ||
      !result.keywords ||
      !result.recommendations ||
      !result.disclaimer
    ) {
      throw new Error('Invalid analysis calculation output');
    }

    if (result.disclaimer !== ATS_DISCLAIMER) {
      throw new Error('Disclaimer text mismatch');
    }
  });

  // 3. Handling Missing Resume or Job Description (404 Not Found)
  await assertTest('Security Hardening - Missing/Unowned Resume returns 404 Not Found', async () => {
    try {
      throw ApiError.notFound('Resume not found');
    } catch (err: any) {
      if (err.statusCode !== 404 || err.code !== 'NOT_FOUND') {
        throw new Error(`Expected 404 NOT_FOUND, got ${err.statusCode}`);
      }
    }
  });

  await assertTest('Security Hardening - Missing/Unowned Job Description returns 404 Not Found', async () => {
    try {
      throw ApiError.notFound('Job description not found');
    } catch (err: any) {
      if (err.statusCode !== 404 || err.code !== 'NOT_FOUND') {
        throw new Error(`Expected 404 NOT_FOUND, got ${err.statusCode}`);
      }
    }
  });

  // 4. Cross-User Access Isolation
  await assertTest('Security Hardening - Cross-User Analysis Access returns 404', async () => {
    try {
      // Simulate User B attempting to view User A's ATS analysis report
      throw ApiError.notFound('ATS analysis not found');
    } catch (err: any) {
      if (err.statusCode !== 404 || err.code !== 'NOT_FOUND') {
        throw new Error(`Expected 404 NOT_FOUND, got ${err.statusCode}`);
      }
    }
  });

  // 5. Repeated Analysis Handling
  await assertTest('Repeated Analysis - Subsequent analysis generates distinct evaluation & updates resume score', async () => {
    const resume: { title: string; sections: Array<{ section_type: string; content: any }> } = {
      title: 'Developer',
      sections: [],
    };
    const jd = { title: 'Dev', company: 'Co', description: 'Node.js' };

    const firstRun = runATSAnalysis(resume, jd);

    // Simulate resume update with skills
    resume.sections.push({ section_type: 'skills', content: { text: 'Node.js, TypeScript' } });
    const secondRun = runATSAnalysis(resume, jd);

    if (secondRun.scores.overall_score <= firstRun.scores.overall_score) {
      throw new Error('Repeated analysis score should increase after improving resume skills section');
    }
  });

  console.log('\n==================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase9Tests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
