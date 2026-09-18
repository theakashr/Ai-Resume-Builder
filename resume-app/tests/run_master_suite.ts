import { execSync } from 'child_process';

interface SuiteResult {
  name: string;
  command: string;
  passed: number;
  failed: number;
  success: boolean;
}

const SUITES = [
  { name: '1 & 2. Authentication & User Profiles', command: 'npx tsx tests/api/auth_and_profiles.test.ts' },
  { name: '3. Resumes CRUD API', command: 'npx tsx tests/api/resumes.test.ts' },
  { name: '4 & 5. Resume Sections & Versioning', command: 'npx tsx tests/api/sections_and_versions.test.ts' },
  { name: '6. Templates Catalog API', command: 'npx tsx tests/api/templates.test.ts' },
  { name: '7. Job Descriptions API', command: 'npx tsx tests/api/jobs.test.ts' },
  { name: '8. AI Resume Assistant Backend', command: 'npx tsx tests/api/ai_assistant.test.ts' },
  { name: '9. ATS Analysis Backend', command: 'npx tsx tests/api/ats_analysis.test.ts' },
  { name: '10 & 11. Mock Interviews & Results/Feedback', command: 'npx tsx tests/api/mock_interviews.test.ts' },
  { name: '12. File Upload & PDF Export', command: 'npx tsx tests/api/file_upload_and_export.test.ts' },
  { name: '13 & Security. Subscriptions, Webhooks & Rate Limiting', command: 'npx tsx tests/api/billing_subscriptions.test.ts' },
];

async function runMasterSuite() {
  console.log('\n==================================================');
  console.log('RESUMEAI MASTER BACKEND QA TEST RUNNER');
  console.log('==================================================\n');

  const results: SuiteResult[] = [];
  let totalPassed = 0;
  let totalFailed = 0;

  for (const suite of SUITES) {
    console.log(`\nExecuting Suite: ${suite.name}...`);
    try {
      const output = execSync(suite.command, { encoding: 'utf-8' });
      console.log(output);

      // Parse passed/failed counts from stdout
      const passedMatch = output.match(/(\d+)\s+PASSED/i);
      const failedMatch = output.match(/(\d+)\s+FAILED/i);

      const passed = passedMatch ? parseInt(passedMatch[1], 10) : 0;
      const failed = failedMatch ? parseInt(failedMatch[1], 10) : 0;

      totalPassed += passed;
      totalFailed += failed;

      results.push({
        name: suite.name,
        command: suite.command,
        passed,
        failed,
        success: failed === 0,
      });
    } catch (err: any) {
      console.error(`Suite ${suite.name} encountered an error:`, err.stdout || err.message);
      results.push({
        name: suite.name,
        command: suite.command,
        passed: 0,
        failed: 1,
        success: false,
      });
      totalFailed += 1;
    }
  }

  console.log('\n==================================================');
  console.log('MASTER QA TEST SUITE SUMMARY');
  console.log('==================================================\n');

  results.forEach((r) => {
    console.log(`${r.success ? '[PASS]' : '[FAIL]'} ${r.name}: ${r.passed} Passed, ${r.failed} Failed`);
  });

  console.log('\n--------------------------------------------------');
  console.log(`TOTAL TEST RESULTS: ${totalPassed} PASSED, ${totalFailed} FAILED`);
  console.log('--------------------------------------------------\n');

  if (totalFailed > 0) {
    process.exit(1);
  }
}

runMasterSuite();
